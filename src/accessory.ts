/**
 * Roomb-O-Matic Accessory — Version 1.7+
 * Part of the O‑Matic Factory Homebridge Suite
 * https://o-matic.me
 */

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
import { startRoomba, stopRoomba, getRobotStatus } from './roomba.js';

export default class RoombaAccessory implements AccessoryPlugin {
  private switchService: Service;
  private dockService: Service;
  private batteryService: Service;
  private isRunning = false;
  private isDocked = false;
  private batteryLevel = 100;
  private pollInterval?: NodeJS.Timeout;

  constructor(
    readonly platform: RoombOMaticPlatform,
    accessory: PlatformAccessory,
    private readonly log: Logging,
    private readonly device: Robot & DeviceConfig,
    private readonly config: RoombaPlatformConfig,
    private readonly api: API,
  ) {
    accessory.category = this.api.hap.Categories.FAN;

    const Service = api.hap.Service;
    const Characteristic = api.hap.Characteristic;

    this.switchService =
      accessory.getService(Service.Fanv2) ?? accessory.addService(Service.Fanv2, device.name);
    this.switchService.setPrimaryService(true);

    const oldSwitch = accessory.getService(Service.Switch);
    if (oldSwitch) accessory.removeService(oldSwitch);

    this.switchService
      .getCharacteristic(Characteristic.Active)
      .on('set', this.setRunningState.bind(this))
      .on('get', (cb) =>
        cb(null, this.isRunning ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE),
      );

    this.dockService =
      accessory.getService('Dock') || accessory.addService(Service.Switch, 'Dock', 'dock');
    this.dockService
      .getCharacteristic(Characteristic.On)
      .on('set', this.sendToDock.bind(this))
      .on('get', (cb) => cb(null, this.isDocked));

    this.batteryService =
      accessory.getService(Service.Battery) || accessory.addService(Service.Battery);
    this.batteryService
      .getCharacteristic(Characteristic.BatteryLevel)
      .on('get', (cb) => cb(null, this.batteryLevel));
    this.batteryService
      .getCharacteristic(Characteristic.ChargingState)
      .on('get', (cb) =>
        cb(null, this.isDocked ? Characteristic.ChargingState.CHARGING : Characteristic.ChargingState.NOT_CHARGING),
      );

    this.startPolling();
  }

  async setRunningState(value: CharacteristicValue, cb: CharacteristicSetCallback) {
    const start = value === this.api.hap.Characteristic.Active.ACTIVE;
    try {
      if (start) {
        await startRoomba(this.device, this.log);
        this.isRunning = true;
      } else {
        await stopRoomba(this.device, this.log);
        this.isRunning = false;
      }
      cb(null);
    } catch (err) {
      this.log.error(`Failed to set cleaning state: ${err}`);
      cb(err);
    }
  }

  async sendToDock(value: CharacteristicValue, cb: CharacteristicSetCallback) {
    if (!value) return cb(null); // No action on false
    try {
      await stopRoomba(this.device, this.log);
      this.isRunning = false;
      this.isDocked = true;
      cb(null);
    } catch (err) {
      this.log.error(`Failed to dock: ${err}`);
      cb(err);
    }
  }

  async pollStatus() {
    try {
      const status = await getRobotStatus(this.device, this.log);
      this.batteryLevel = status.batteryLevel;
      this.isDocked = status.isDocked;
      this.isRunning = status.isRunning;

      this.batteryService.updateCharacteristic(this.api.hap.Characteristic.BatteryLevel, this.batteryLevel);
      this.batteryService.updateCharacteristic(
        this.api.hap.Characteristic.ChargingState,
        this.isDocked ? this.api.hap.Characteristic.ChargingState.CHARGING : this.api.hap.Characteristic.ChargingState.NOT_CHARGING,
      );
      this.switchService.updateCharacteristic(
        this.api.hap.Characteristic.Active,
        this.isRunning ? this.api.hap.Characteristic.Active.ACTIVE : this.api.hap.Characteristic.Active.INACTIVE,
      );
      this.dockService.updateCharacteristic(this.api.hap.Characteristic.On, this.isDocked);
    } catch (err) {
      this.log.warn(`Polling error for ${this.device.name}: ${err}`);
    }
  }

  startPolling() {
    const interval = (this.config.pollInterval || 15) * 1000;
    this.pollInterval = setInterval(() => this.pollStatus(), interval);
    this.log.info(`Started polling ${this.device.name} every ${interval / 1000}s`);
  }

  getServices(): Service[] {
    return [this.switchService, this.dockService, this.batteryService];
  }
}
