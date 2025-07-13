"use strict";
/**
 * Roomb-O-Matic Accessory
 * homebridge-roomb-o-matic
 *
 * Developed by James Walker (O‑Matic Factory)
 * https://o-matic.me
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RoombaAccessory {
    constructor(platform, accessory, log, device, config, api) {
        this.platform = platform;
        this.isRunning = false;
        this.api = api;
        this.log = log;
        // Show as a Fan in HomeKit (current workaround for vacuums)
        accessory.category = 3 /* this.api.hap.Categories.FAN */;
        const Service = api.hap.Service;
        const Characteristic = api.hap.Characteristic;
        this.switchService =
            accessory.getService(Service.Fanv2) ?? accessory.addService(Service.Fanv2, device.name);
        this.switchService.setPrimaryService(true);
        // Remove old Switch if present
        const oldSwitch = accessory.getService(Service.Switch);
        if (oldSwitch)
            accessory.removeService(oldSwitch);
        this.switchService
            .getCharacteristic(Characteristic.Active)
            .on('set', (value, cb) => {
            const start = value === Characteristic.Active.ACTIVE;
            this.setRunningState(start, cb);
        })
            .on('get', (cb) => {
            cb(null, this.isRunning ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE);
        });
        // (Optional) Setup battery service and other care services here later
    }
    async setRunningState(start, cb) {
        try {
            if (start) {
                await this.startCleaning();
                this.isRunning = true;
            }
            else {
                await this.stopCleaning();
                this.isRunning = false;
            }
            cb(null, this.isRunning ? 1 : 0);
        }
        catch (err) {
            cb(err);
        }
    }
    async startCleaning() {
        // Connect and start Roomba (e.g., dorita980 local command)
        this.log.info('Starting Roomba (placeholder)');
    }
    async stopCleaning() {
        // Connect and stop/dock Roomba
        this.log.info('Stopping Roomba (placeholder)');
    }
    getServices() {
        const services = [this.switchService];
        if (this.batteryService)
            services.push(this.batteryService);
        return services;
    }
}
exports.default = RoombaAccessory;
