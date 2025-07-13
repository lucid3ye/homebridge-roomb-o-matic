"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const platform_js_1 = require("./platform.js");
const settings_js_1 = require("./settings.js");
const package_json_1 = __importDefault(require("../package.json"));
module.exports = (api) => {
    // Log plugin version on startup for clarity
    // (Helps with debugging and confirming deployment)
    // eslint-disable-next-line no-console
    console.log(`[${settings_js_1.PLUGIN_NAME}] Loaded — Version ${package_json_1.default.version}`);
    api.registerPlatform(settings_js_1.PLUGIN_NAME, settings_js_1.PLATFORM_NAME, platform_js_1.RoombOMaticPlatform);
};
