import type {
  AccessoryPlugin,
  API,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  Logging,
  PlatformAccessory,
  Service,
} from 'homebridge';

import type { RoombOMaticPlatform } from './platform.js';
import type { DeviceConfig, RoombaPlatformConfig } from './settings.js';
import type { Robot } from './roomba.js';
import {
  startRoomba,
  stopRoomba,
  dockRoomba,
  getRobotStatus,
} from './roomba.js';

export class RoombaAccessory implements AccessoryPlugin {
  private switchService: Service;
  private batteryService?: Service;
  private dockService?: Service;
  private pollingInterval?: NodeJS.Timeout;
  private log: Logging;
  private api: API;
  private isRunning = false;
  private robot: Robot;

  constructor(
    readonly platform: RoombOMaticPlatform,
    accessory: PlatformAccessory,
    log: Logging,
    device: Robot & DeviceConfig,
    config: RoombaPlatformConfig,
    api: API,
  ) {
    this.api = api;
    this.log = log;
    this.robot = device;

    // HomeKit workaround: vacuums show as Fan
    accessory.category = this.api.hap.Categories.FAN;

    const Service = api.hap.Service;
    const Characteristic = api.hap.Characteristic;

    // Primary Fanv2 control service
    this.switchService =
      accessory.getService(Service.Fanv2) ??
      accessory.addService(Service.Fanv2, device.name);
    this.switchService.setPrimaryService(true);

    // Remove old Switch if present
    const oldSwitch = accessory.getService(Service.Switch);
    if (oldSwitch) accessory.removeService(oldSwitch);

    // Cleaning On/Off
    this.switchService
      .getCharacteristic(Characteristic.Active)
      .on('set', (value: CharacteristicValue, cb: CharacteristicSetCallback) => {
        const start = value === Characteristic.Active.ACTIVE;
        this.setRunningState(start, cb);
      })
      .on('get', (cb: CharacteristicGetCallback) => {
        cb(
          null,
          this.isRunning
            ? Characteristic.Active.ACTIVE
            : Characteristic.Active.INACTIVE,
        );
      });

    // Battery service setup
    this.batteryService =
      accessory.getService(Service.Battery) ??
      accessory.addService(Service.Battery, `${device.name} Battery`);

    this.batteryService
      .getCharacteristic(Characteristic.BatteryLevel)
      .on('get', (cb: CharacteristicGetCallback) => cb(null, 100));

    this.batteryService
      .getCharacteristic(Characteristic.ChargingState)
      .on('get', (cb: CharacteristicGetCallback) =>
        cb(null, Characteristic.ChargingState.NOT_CHARGING),
      );

    // Dock switch service (optional control)
    this.dockService =
      accessory.getService('Dock') ??
      accessory.addService(Service.Switch, 'Dock');

    this.dockService
      .getCharacteristic(Characteristic.On)
      .on('set', async (value: CharacteristicValue, cb: CharacteristicSetCallback) => {
        if (value) {
          try {
            await dockRoomba(this.robot, this.log);
          } catch (err: any) {
            this.log.warn(`Docking failed: ${err}`);
          }
        }
        cb(null);
      })
      .on('get', (cb: CharacteristicGetCallback) => cb(null, false));

    this.startPolling();
  }

  async setRunningState(start: boolean, cb: CharacteristicSetCallback) {
    this.log.debug(`Roomba setRunningState(${start})`);
    try {
      if (start) {
        await this.startCleaning();
        this.isRunning = true;
      } else {
        await this.stopCleaning();
        this.isRunning = false;
      }
      cb(null, this.isRunning ? 1 : 0);
    } catch (err: any) {
      cb(err);
    }
  }

  async startCleaning() {
    await startRoomba(this.robot, this.log);
  }

  async stopCleaning() {
    await stopRoomba(this.robot, this.log);
  }

  private startPolling() {
    const Characteristic = this.api.hap.Characteristic;

    this.pollingInterval = setInterval(async () => {
      try {
        const state = await getRobotStatus(this.robot, this.log);
        const phase = state.phase || '';
        const batteryPercent = state.batPct ?? 100;
        const charging = phase === 'charging' || phase === 'chargingerror';

        this.batteryService?.updateCharacteristic(
          Characteristic.BatteryLevel,
          batteryPercent,
        );

        this.batteryService?.updateCharacteristic(
          Characteristic.ChargingState,
          charging
            ? Characteristic.ChargingState.CHARGING
            : Characteristic.ChargingState.NOT_CHARGING,
        );

        const isRunning = ['run', 'cleaning'].includes(phase);
        this.switchService.updateCharacteristic(
          Characteristic.Active,
          isRunning ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE,
        );
        this.isRunning = isRunning;
      } catch (err) {
        this.log.debug('Polling failed:', err);
      }
    }, 60000); // 1 min
  }

  getServices(): Service[] {
    const services: Service[] = [this.switchService];
    if (this.batteryService) services.push(this.batteryService);
    if (this.dockService) services.push(this.dockService);
    return services;
  }
}
