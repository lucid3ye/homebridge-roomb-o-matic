"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoombaAccessory = void 0;
const dorita980_1 = require("dorita980");
class RoombaAccessory {
    constructor(log, api, accessory, device) {
        this.log = log;
        this.api = api;
        this.accessory = accessory;
        this.device = device;
        const { blid, robotpwd, ipaddress, name } = device;
        this.robot = new dorita980_1.Local(blid, robotpwd, ipaddress);
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
    async handleActiveSet(value) {
        if (value) {
            this.log.info(`${this.device.name}: Starting cleaning`);
            await this.robot.start();
        }
        else {
            this.log.info(`${this.device.name}: Stopping cleaning`);
            await this.robot.stop();
        }
    }
    async handleDockSet(value) {
        if (value) {
            this.log.info(`${this.device.name}: Sending to dock`);
            await this.robot.dock();
        }
    }
    async updateBattery() {
        try {
            const status = await this.robot.getRobotState(['batPct', 'cleanMissionStatus']);
            this.batteryService
                .setCharacteristic(this.api.hap.Characteristic.BatteryLevel, status.batPct);
            this.batteryService
                .setCharacteristic(this.api.hap.Characteristic.ChargingState, status.cleanMissionStatus && status.cleanMissionStatus.phase === 'charge'
                ? this.api.hap.Characteristic.ChargingState.CHARGING
                : this.api.hap.Characteristic.ChargingState.NOT_CHARGING);
        }
        catch (error) {
            this.log.error(`${this.device.name}: Failed to update battery status — ${error}`);
        }
    }
    async updateBinStatus() {
        try {
            const status = await this.robot.getRobotState(['bin']);
            const binFull = status.bin && status.bin.full;
            this.binSensorService
                .setCharacteristic(this.api.hap.Characteristic.ContactSensorState, binFull ? this.api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
                : this.api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED);
        }
        catch (error) {
            this.log.error(`${this.device.name}: Failed to update bin status — ${error}`);
        }
    }
    getServices() {
        return this.services;
    }
}
exports.RoombaAccessory = RoombaAccessory;
