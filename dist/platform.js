"use strict";
/* src/platform.ts */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoombOMaticPlatform = void 0;
const roomba_js_1 = require("./roomba.js");
const accessory_js_1 = __importDefault(require("./accessory.js"));
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
        this.log(`Configuring cached accessory: ${accessory.displayName}`);
        this.accessories.set(accessory.UUID, accessory);
    }
    async discoverDevices() {
        if (!this.config.devices) {
            this.log.error('No devices configured.');
            return;
        }
        const devices = await (0, roomba_js_1.getRoombas)(this.config.devices, this.log);
        for (const device of devices) {
            const uuid = this.api.hap.uuid.generate(device.blid);
            const existingAccessory = this.accessories.get(uuid);
            if (existingAccessory) {
                this.log.info(`Restoring existing accessory: ${existingAccessory.displayName}`);
                existingAccessory.category = 1 /* this.api.hap.Categories.OTHER */;
                new accessory_js_1.default(this, existingAccessory, this.log, device, this.config, this.api);
                this.api.updatePlatformAccessories([existingAccessory]);
            }
            else {
                this.log.info(`Adding new accessory: ${device.name}`);
                const accessory = new this.api.platformAccessory(device.name, uuid);
                accessory.category = 1 /* this.api.hap.Categories.OTHER */;
                new accessory_js_1.default(this, accessory, this.log, device, this.config, this.api);
                this.api.registerPlatformAccessories('homebridge-roomb-o-matic', 'RoombOMatic', [accessory]);
            }
        }
    }
}
exports.RoombOMaticPlatform = RoombOMaticPlatform;
