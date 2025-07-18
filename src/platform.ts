/* src/platform.ts */

import type {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  Service,
} from 'homebridge';

import type { Robot } from './roomba.js';
import type { DeviceConfig } from './settings.js';
import { getRoombas } from './roomba.js';
import { RoombaAccessory } from './accessory.js';

export class RoombOMaticPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  private readonly accessories: Map<string, PlatformAccessory> = new Map();
  private static readonly pluginName = 'homebridge-roomb-o-matic';

  constructor(
    public readonly log: Logging,
    public readonly config: any,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;

    this.api.on('didFinishLaunching', () => {
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info(`Configuring cached accessory: ${accessory.displayName}`);
    this.accessories.set(accessory.UUID, accessory);
  }

  private async discoverDevices(): Promise<void> {
    if (!this.config.devices) {
      this.log.error('No devices configured.');
      return;
    }

    let robots: Robot[] = [];
    try {
      robots = await getRoombas(this.config.devices, this.log);
    } catch (err) {
      this.log.error('Error discovering Roombas:', err);
      return;
    }

    const devices: (Robot & DeviceConfig)[] = this.config.devices
      .map((config: DeviceConfig) => {
        const matchedRobot = robots.find((robot) => robot.blid === config.blid);
        if (!matchedRobot) {
          this.log.warn(`No match for device ${config.name} (blid: ${config.blid})`);
          return null;
        }
        return { ...matchedRobot, name: config.name };
      })
      .filter((d): d is Robot & DeviceConfig => d !== null);

    const setVacuumCategory = (acc: PlatformAccessory) => {
      acc.category = this.api.hap.Categories.VACUUM;
    };

    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(device.blid);
      const existingAccessory = this.accessories.get(uuid);

      if (existingAccessory) {
        this.log.info(`[${device.name}] Restoring existing accessory (UUID: ${uuid})`);
        setVacuumCategory(existingAccessory);
        new RoombaAccessory(this, existingAccessory, this.log, device, this.config, this.api);
        this.api.updatePlatformAccessories([existingAccessory]);
      } else {
        this.log.info(`[${device.name}] Adding new accessory (UUID: ${uuid})`);
        const accessory = new this.api.platformAccessory(device.name, uuid);
        setVacuumCategory(accessory);
        new RoombaAccessory(this, accessory, this.log, device, this.config, this.api);
        this.api.registerPlatformAccessories(
          RoombOMaticPlatform.pluginName,
          'RoombOMatic',
          [accessory],
        );
      }
    }
  }
}
