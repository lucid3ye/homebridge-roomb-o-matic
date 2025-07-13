import { API } from 'homebridge'
import { RoombOMaticPlatform } from './platform.js'

import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js'

export = (api: API) => {
  api.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, RoombOMaticPlatform)
}
