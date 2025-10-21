"use strict";
/* src/platform.ts */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoombOMaticPlatform = void 0;
const settings_js_1 = require("./settings.js");
const accessory_js_1 = require("./accessory.js");
class RoombOMaticPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.accessories = new Map();
        this.Service = api.hap.Service;
        this.Characteristic = api.hap.Characteristic;
        this.api.on('didFinishLaunching', () => {
            this.discoverDevices();
        });
    }
    configureAccessory(accessory) {
        this.log.info(`Configuring cached accessory: ${accessory.displayName}`);
        this.accessories.set(accessory.UUID, accessory);
    }
    async discoverDevices() {
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
                existingAccessory.category = 3 /* this.api.hap.Categories.FAN */;
                new accessory_js_1.RoombaAccessory(this.log, this.api, existingAccessory, device);
                this.api.updatePlatformAccessories([existingAccessory]);
            }
            else {
                this.log.info(`Adding new accessory: ${device.name}`);
                const accessory = new this.api.platformAccessory(device.name, uuid);
                accessory.category = 3 /* this.api.hap.Categories.FAN */;
                new accessory_js_1.RoombaAccessory(this.log, this.api, accessory, device);
                this.api.registerPlatformAccessories(settings_js_1.PLUGIN_NAME, settings_js_1.PLATFORM_NAME, [accessory]);
            }
        }
    }
}
exports.RoombOMaticPlatform = RoombOMaticPlatform;
