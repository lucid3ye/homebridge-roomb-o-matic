import { API, Service, CharacteristicValue, Logging, PlatformAccessory } from 'homebridge';
import { Local } from 'dorita980';
import type { DeviceConfig } from './settings.js';

export class RoombaAccessory {
  private services: Service[];
  private vacuumService: Service;
  private dockService: Service;
  private batteryService: Service;
  private binSensorService: Service;
  private robot: any;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly device: DeviceConfig
  ) {
    const { blid, robotpwd, ipaddress, name } = device;
    this.robot = new Local(blid, robotpwd, ipaddress);

    this.vacuumService = new this.api.hap.Service.Fanv2(name, 'vacuum');
    this.vacuumService
      .getCharacteristic(this.api.hap.Characteristic.Active)
      .onSet(this.handleActiveSet.bind(this));

    this.dockService = new this.api.hap.Service.Switch(`${name} Dock`, 'dock');
    this.dockService
      .getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.handleDockSet.bind(this));

    this.batteryService = new this.api.hap.Service.Battery(name, 'battery');
    this.updateBattery();

    this.binSensorService = new this.api.hap.Service.ContactSensor(`${name} Bin`, 'bin');
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
      this.log.info(`${this.device.name}: Starting cleaning`);
      await this.robot.start();
    } else {
      this.log.info(`${this.device.name}: Stopping cleaning`);
      await this.robot.stop();
    }
  }

  async handleDockSet(value: CharacteristicValue) {
    if (value) {
      this.log.info(`${this.device.name}: Sending to dock`);
      await this.robot.dock();
    }
  }

  private async updateBattery() {
    try {
      const status = await this.robot.getRobotState(['batPct', 'cleanMissionStatus']);
      this.batteryService
        .setCharacteristic(this.api.hap.Characteristic.BatteryLevel, status.batPct);

      this.batteryService
        .setCharacteristic(
          this.api.hap.Characteristic.ChargingState,
          status.cleanMissionStatus && status.cleanMissionStatus.phase === 'charge'
            ? this.api.hap.Characteristic.ChargingState.CHARGING
            : this.api.hap.Characteristic.ChargingState.NOT_CHARGING
        );
    } catch (error) {
      this.log.error(`${this.device.name}: Failed to update battery status — ${error}`);
    }
  }

  private async updateBinStatus() {
    try {
      const status = await this.robot.getRobotState(['bin']);
      const binFull = status.bin && status.bin.full;
      this.binSensorService
        .setCharacteristic(
          this.api.hap.Characteristic.ContactSensorState,
          binFull ? this.api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                  : this.api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
        );
    } catch (error) {
      this.log.error(`${this.device.name}: Failed to update bin status — ${error}`);
    }
  }

  getServices(): Service[] {
    return this.services;
  }
}
