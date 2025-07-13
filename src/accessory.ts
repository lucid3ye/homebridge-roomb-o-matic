import { Service, CharacteristicValue, API, Logging } from 'homebridge';
import { RoombOMaticPlatform } from './platform.js';
import { Discovery, Robot } from '@karlvr/dorita980';  // or your actual import

export class RoombaAccessory {
  private vacuumService: Service;
  private dockService: Service;
  private batteryService: Service;
  private binSensorService: Service;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private robot: Robot,
    private readonly name: string,
  ) {
    // Vacuum Service
    this.vacuumService = new this.api.hap.Service.Fanv2(this.name, 'vacuum');
    this.vacuumService
      .getCharacteristic(this.api.hap.Characteristic.Active)
      .onSet(this.handleActiveSet.bind(this));

    // Dock Switch
    this.dockService = new this.api.hap.Service.Switch(`${this.name} Dock`, 'dock');
    this.dockService
      .getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.handleDockSet.bind(this));

    // Battery
    this.batteryService = new this.api.hap.Service.Battery(this.name, 'battery');
    this.updateBattery();

    // Bin Sensor
    this.binSensorService = new this.api.hap.Service.ContactSensor(`${this.name} Bin`, 'bin');
    this.updateBinStatus();

    this.services = [
      this.vacuumService,
      this.dockService,
      this.batteryService,
      this.binSensorService,
    ];
  }

  async handleActiveSet(value: CharacteristicValue) {
    if (value) {
      this.log.info(`${this.name}: Starting cleaning`);
      await this.robot.start();
    } else {
      this.log.info(`${this.name}: Stopping cleaning`);
      await this.robot.stop();
    }
  }

  async handleDockSet(value: CharacteristicValue) {
    if (value) {
      this.log.info(`${this.name}: Sending to dock`);
      await this.robot.dock();
    }
  }

  private async updateBattery() {
    const status = await this.robot.getStatus();
    this.batteryService
      .setCharacteristic(this.api.hap.Characteristic.BatteryLevel, status.battery);
    this.batteryService
      .setCharacteristic(this.api.hap.Characteristic.ChargingState,
        status.charging ? this.api.hap.Characteristic.ChargingState.CHARGING : this.api.hap.Characteristic.ChargingState.NOT_CHARGING);
  }

  private async updateBinStatus() {
    const status = await this.robot.getStatus();
    const binFull = status.binFull; // adjust based on actual property
    this.binSensorService
      .setCharacteristic(this.api.hap.Characteristic.ContactSensorState,
        binFull ? this.api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED : this.api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED);
  }

  getServices() {
    return this.services;
  }
}
