/**
 * Roomb-O-Matic Accessory
 * homebridge-roomb-o-matic
 * 
 * Developed by James Walker (O‑Matic Factory)
 * https://o-matic.me
 */

import type { AccessoryPlugin, API, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Logging, PlatformAccessory, Service } from 'homebridge';
import type { DeviceConfig, RoombaPlatformConfig } from './settings.js';
import type { Robot } from './roomba.js';


export default class RoombaAccessory implements AccessoryPlugin {
  private switchService: Service;
  private batteryService?: Service;
  private log: Logging;
  private api: API;
  private isRunning = false;

  constructor(
    readonly platform: RoombaPlatform,
    accessory: PlatformAccessory,
    log: Logging,
    device: Robot & DeviceConfig,
    config: RoombaPlatformConfig,
    api: API,
  ) {
    this.api = api;
    this.log = log;

    // Show as a Fan in HomeKit (current workaround for vacuums)
    accessory.category = this.api.hap.Categories.FAN;

    const Service = api.hap.Service;
    const Characteristic = api.hap.Characteristic;

    this.switchService =
      accessory.getService(Service.Fanv2) ?? accessory.addService(Service.Fanv2, device.name);
    this.switchService.setPrimaryService(true);

    // Remove old Switch if present
    const oldSwitch = accessory.getService(Service.Switch);
    if (oldSwitch) accessory.removeService(oldSwitch);

    this.switchService
      .getCharacteristic(Characteristic.Active)
      .on('set', (value: CharacteristicValue, cb: CharacteristicSetCallback) => {
        const start = value === Characteristic.Active.ACTIVE;
        this.setRunningState(start, cb);
      })
      .on('get', (cb: CharacteristicGetCallback) => {
        cb(null, this.isRunning ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE);
      });

    // (Optional) Setup battery service and other care services here later
  }

  async setRunningState(start: boolean, cb: CharacteristicSetCallback) {
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
    // Connect and start Roomba (e.g., dorita980 local command)
    this.log.info('Starting Roomba (placeholder)');
  }

  async stopCleaning() {
    // Connect and stop/dock Roomba
    this.log.info('Stopping Roomba (placeholder)');
  }

  getServices(): Service[] {
    const services: Service[] = [this.switchService];
    if (this.batteryService) services.push(this.batteryService);
    return services;
  }
}
