import { API } from 'homebridge';
import { RoombOMaticPlatform } from './platform.js';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';

export = (api: API) => {
  // Log plugin version on startup for clarity
  // eslint-disable-next-line no-console
  console.log(`[${PLUGIN_NAME}] Loaded — Version 1.2.1`);

  api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, RoombOMaticPlatform);
};
