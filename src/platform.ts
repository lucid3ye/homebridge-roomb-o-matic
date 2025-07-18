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
import { getRoombas, getRobotStatus } from './roomba.js';
import { RoombaAccessory } from './accessory.js';

export class RoombOMaticPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  private readonly accessories: Map<string, PlatformAccessory> = new Map();
  private readonly robotMap: Map<string, Robot> = new Map();
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
        const fullDevice = { ...matchedRobot, name: config.name };
        this.robotMap.set(config.blid, fullDevice);
        return fullDevice;
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

    // ✅ Start polling
    this.startPolling();
  }

  private startPolling(): void {
    setInterval(async () => {
      for (const [blid, robot] of this.robotMap) {
        const accessory = this.accessories.get(this.api.hap.uuid.generate(blid));
        if (!accessory) continue;
        const status = await getRobotStatus(robot, this.log);
        accessory.context.battery = status.batPct;
        accessory.context.phase = status.phase;
        // Services will use context during get handlers
      }
    }, 60 * 1000); // every 60 seconds
  }
}
