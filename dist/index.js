"use strict";
/* src/index.ts */
const platform_js_1 = require("./platform.js");
const settings_js_1 = require("./settings.js");
module.exports = (api) => {
    api.registerPlatform(settings_js_1.PLUGIN_NAME, settings_js_1.PLATFORM_NAME, platform_js_1.RoombOMaticPlatform);
};
