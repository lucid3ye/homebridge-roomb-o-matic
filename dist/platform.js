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
        if (!this.config.devices) {
            this.log.error('No devices configured.');
            return;
        }
        const devices = this.config.devices;
        for (const device of devices) {
            const uuid = this.api.hap.uuid.generate(device.blid);
            const existingAccessory = this.accessories.get(uuid);
            if (existingAccessory) {
                this.log.info(`Restoring existing accessory: ${existingAccessory.displayName}`);
                new accessory_js_1.RoombaAccessory(this.log, this.api, existingAccessory, device);
                this.api.updatePlatformAccessories([existingAccessory]);
            }
            else {
                this.log.info(`Adding new accessory: ${device.name}`);
                const accessory = new this.api.platformAccessory(device.name, uuid);
                new accessory_js_1.RoombaAccessory(this.log, this.api, accessory, device);
                this.api.registerPlatformAccessories(settings_js_1.PLUGIN_NAME, settings_js_1.PLATFORM_NAME, [accessory]);
            }
        }
    }
}
exports.RoombOMaticPlatform = RoombOMaticPlatform;
