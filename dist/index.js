"use strict";
const platform_js_1 = require("./platform.js");
const settings_js_1 = require("./settings.js");
module.exports = (api) => {
    // Log plugin version on startup for clarity
    // eslint-disable-next-line no-console
    console.log(`[${settings_js_1.PLUGIN_NAME}] Loaded — Version 1.1.5`);
    api.registerPlatform(settings_js_1.PLUGIN_NAME, settings_js_1.PLATFORM_NAME, platform_js_1.RoombOMaticPlatform);
};
