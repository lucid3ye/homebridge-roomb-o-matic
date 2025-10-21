/* src/platform.ts */

import type {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  Service,
} from 'homebridge';

import type { DeviceConfig } from './settings.js';
import { PLUGIN_NAME, PLATFORM_NAME } from './settings.js';
import { RoombaAccessory } from './accessory.js';

export class RoombOMaticPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  private readonly accessories: Map<string, PlatformAccessory> = new Map();

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
    if (!this.config.devices || !Array.isArray(this.config.devices) || this.config.devices.length === 0) {
      this.log.error('No devices configured. Please add devices in the Homebridge config.');
      return;
    }

    this.log.info(`Discovering ${this.config.devices.length} configured device(s)...`);

    for (const device of this.config.devices) {
      if (!device.blid || !device.robotpwd || !device.ipaddress) {
        this.log.error(`Device "${device.name || 'unknown'}" is missing required fields (blid, robotpwd, or ipaddress). Skipping.`);
        continue;
      }

      const uuid = this.api.hap.uuid.generate(device.blid);
      const existingAccessory = this.accessories.get(uuid);

      if (existingAccessory) {
        this.log.info(`Restoring existing accessory: ${existingAccessory.displayName}`);
        (existingAccessory as any).category = this.api.hap.Categories.FAN;
        new RoombaAccessory(this.log, this.api, existingAccessory, device);
        this.api.updatePlatformAccessories([existingAccessory]);
      } else {
        this.log.info(`Adding new accessory: ${device.name}`);
        const accessory = new this.api.platformAccessory(device.name, uuid);
        (accessory as any).category = this.api.hap.Categories.FAN;
        new RoombaAccessory(this.log, this.api, accessory, device);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }
}
