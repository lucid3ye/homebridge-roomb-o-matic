import { API } from 'homebridge';
import { RoombOMaticPlatform } from './platform.js';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import pkg from '../package.json' assert { type: 'json' };

export = (api: API) => {
  // Log plugin version on startup for clarity
  // (Helps with debugging and confirming deployment)
  // eslint-disable-next-line no-console
  console.log(`[${PLUGIN_NAME}] Loaded — Version ${pkg.version}`);

  api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, RoombOMaticPlatform);
};
