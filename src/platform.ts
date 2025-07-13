/* src/platform.ts */

import type { API, Characteristic, DynamicPlatformPlugin, Logging, PlatformAccessory, Service } from 'homebridge'

export interface Robot {
  blid: string;
  name: string;
  // add any other properties as needed
}
import type { DeviceConfig } from './settings.js'
import { getRoombas } from './roomba.js'
import RoombaAccessory from './accessory.js'

export class RoombOMaticPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service
  public readonly Characteristic: typeof Characteristic
  private readonly accessories: Map<string, PlatformAccessory> = new Map()

  constructor(
    public readonly log: Logging,
    public readonly config: any,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service
    this.Characteristic = api.hap.Characteristic

    this.api.on('didFinishLaunching', () => {
      this.discoverDevices()
    })
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log(`Configuring cached accessory: ${accessory.displayName}`)
    this.accessories.set(accessory.UUID, accessory)
  }

  private async discoverDevices(): Promise<void> {
    if (!this.config.devices) {
      this.log.error('No devices configured.')
      return
    }

    const robots = await getRoombas(this.config.devices, this.log);
    const devices: (Robot & DeviceConfig)[] = this.config.devices.map((config: DeviceConfig) => {
      const matchedRobot = robots.find((robot: Robot) => robot.blid === config.blid);
      return {
        ...matchedRobot!,
        name: config.name,
      };
    });

    for (const device of devices) {
      const uuid = this.api.hap.uuid.generate(device.blid)
      const existingAccessory = this.accessories.get(uuid)

      if (existingAccessory) {
        this.log.info(`Restoring existing accessory: ${existingAccessory.displayName}`)
        existingAccessory.category = this.api.hap.Categories.OTHER;
        new RoombaAccessory(this, existingAccessory, this.log, device, this.config, this.api)
        this.api.updatePlatformAccessories([existingAccessory])
      } else {
        this.log.info(`Adding new accessory: ${device.name}`)
        const accessory = new this.api.platformAccessory(device.name, uuid)
        accessory.category = this.api.hap.Categories.OTHER;
        new RoombaAccessory(this, accessory, this.log, device, this.config, this.api)
        this.api.registerPlatformAccessories('homebridge-roomb-o-matic', 'RoombOMatic', [accessory])
      }
    }
  }
}
