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
  private statePollInterval?: NodeJS.Timer;

  constructor(
    private readonly log: Logging,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly device: DeviceConfig
  ) {
    const { blid, robotpwd, ipaddress, name } = device;
    this.robot = new Local(blid, robotpwd, ipaddress);

    // Vacuum control via Fanv2
    this.vacuumService = new this.api.hap.Service.Fanv2(name, 'vacuum');
    this.vacuumService
      .getCharacteristic(this.api.hap.Characteristic.Active)
      .onSet(this.handleActiveSet.bind(this));

    // Dock control via Switch
    this.dockService = new this.api.hap.Service.Switch(`${name} Dock`, 'dock');
    this.dockService
      .getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.handleDockSet.bind(this));

    // Battery service
    this.batteryService = new this.api.hap.Service.Battery(name, 'battery');

    // Bin sensor service
    this.binSensorService = new this.api.hap.Service.ContactSensor(`${name} Bin`, 'bin');

    // Aggregate services
    this.services = [
      this.vacuumService,
      this.dockService,
      this.batteryService,
      this.binSensorService,
    ];

    // Start periodic state polling
    this.initializeStatePolling();
  }

  private async handleActiveSet(value: CharacteristicValue) {
    try {
      if (value) {
        this.log.info(`${this.device.name}: Starting cleaning`);
        await this.robot.start();
      } else {
        this.log.info(`${this.device.name}: Stopping cleaning`);
        await this.robot.stop();
      }
    } catch (err) {
      this.log.error(`${this.device.name}: Vacuum command failed — ${err}`);
    }
  }

  private async handleDockSet(value: CharacteristicValue) {
    try {
      if (value) {
        this.log.info(`${this.device.name}: Sending to dock`);
        await this.robot.dock();
      }
    } catch (err) {
      this.log.error(`${this.device.name}: Dock command failed — ${err}`);
    }
  }

  private initializeStatePolling() {
    this.fetchState();
    this.statePollInterval = setInterval(() => this.fetchState(), 60_000);
  }

  private async fetchState() {
    try {
      const state = await this.robot.getRobotState(['batPct', 'bin', 'cleanMissionStatus']);
      const battery = state.batPct;
      const charging = state.cleanMissionStatus?.phase === 'charge';
      const binFull = state.bin?.full ?? false;

      this.batteryService
        .setCharacteristic(this.api.hap.Characteristic.BatteryLevel, battery);
      this.batteryService
        .setCharacteristic(
          this.api.hap.Characteristic.ChargingState,
          charging
            ? this.api.hap.Characteristic.ChargingState.CHARGING
            : this.api.hap.Characteristic.ChargingState.NOT_CHARGING
        );
      this.binSensorService
        .setCharacteristic(
          this.api.hap.Characteristic.ContactSensorState,
          binFull
            ? this.api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED
        );
    } catch (err) {
      this.log.error(`${this.device.name}: State fetch failed — ${err}`);
    }
  }

  getServices(): Service[] {
    return this.services;
  }

  // Clean up timers when accessory is removed
  public dispose() {
    if (this.statePollInterval) {
      clearInterval(this.statePollInterval);
      this.statePollInterval = undefined;
    }
  }
}
