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
        // Vacuum control via classic Fan (shows in Home app)
        this.vacuumService = new this.api.hap.Service.Fan(name, 'vacuum');
        this.vacuumService
            .getCharacteristic(this.api.hap.Characteristic.On)
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
        // Hybrid detection
        if (typeof this.robot.getRobotState === 'function') {
            this.log.info(`${this.device.name}: Advanced state polling enabled.`);
            this.initializeStatePolling();
        }
        else if (typeof this.robot.getStatus === 'function') {
            this.log.info(`${this.device.name}: Legacy state polling enabled.`);
            this.initializeLegacyStatePolling();
        }
        else {
            this.log.warn(`${this.device.name}: No state polling supported on this model.`);
        }
    }
    async handleActiveSet(value) {
        try {
            if (value) {
                this.log.info(`${this.device.name}: Starting cleaning`);
                await this.robot.start();
            }
            else {
                this.log.info(`${this.device.name}: Stopping cleaning`);
                await this.robot.stop();
            }
        }
        catch (err) {
            this.log.error(`${this.device.name}: Vacuum command failed — ${err}`);
        }
    }
    async handleDockSet(value) {
        try {
            if (value) {
                this.log.info(`${this.device.name}: Sending to dock`);
                await this.robot.dock();
            }
        }
        catch (err) {
            this.log.error(`${this.device.name}: Dock command failed — ${err}`);
        }
    }
    initializeStatePolling() {
        this.fetchHybridState();
        this.statePollInterval = setInterval(() => this.fetchHybridState(), 60000);
    }
    initializeLegacyStatePolling() {
        this.fetchLegacyState();
        this.statePollInterval = setInterval(() => this.fetchLegacyState(), 60000);
    }
    async fetchHybridState() {
        try {
            const state = await this.robot.getRobotState(['batPct', 'bin', 'cleanMissionStatus']);
            const battery = state.batPct;
            const charging = state.cleanMissionStatus?.phase === 'charge';
            const binFull = state.bin?.full ?? false;
            this.updateCharacteristics(battery, charging, binFull);
        }
        catch (err) {
            this.log.error(`${this.device.name}: Hybrid state fetch failed — ${err}`);
        }
    }
    async fetchLegacyState() {
        try {
            const state = await this.robot.getStatus();
            const battery = state.battery;
            const charging = state.charging;
            const binFull = state.binFull ?? false;
            this.updateCharacteristics(battery, charging, binFull);
        }
        catch (err) {
            this.log.error(`${this.device.name}: Legacy state fetch failed — ${err}`);
        }
    }
    updateCharacteristics(battery, charging, binFull) {
        this.batteryService
            .setCharacteristic(this.api.hap.Characteristic.BatteryLevel, battery);
        this.batteryService
            .setCharacteristic(this.api.hap.Characteristic.ChargingState, charging
            ? this.api.hap.Characteristic.ChargingState.CHARGING
            : this.api.hap.Characteristic.ChargingState.NOT_CHARGING);
        this.binSensorService
            .setCharacteristic(this.api.hap.Characteristic.ContactSensorState, binFull
            ? this.api.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
            : this.api.hap.Characteristic.ContactSensorState.CONTACT_DETECTED);
    }
    getServices() {
        return this.services;
    }
    dispose() {
        if (this.statePollInterval) {
            clearInterval(this.statePollInterval);
            this.statePollInterval = undefined;
        }
    }
}
exports.RoombaAccessory = RoombaAccessory;
