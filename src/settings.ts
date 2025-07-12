/* src/settings.ts */

export interface DeviceConfig {
  blid: string
  ip?: string
  name: string
}

export interface RoombaPlatformConfig {
  name: string
  email?: string
  password?: string
  devices: DeviceConfig[]
  debug?: boolean
}

export const PLATFORM_NAME = 'RoombOMatic'
export const PLUGIN_NAME = 'homebridge-roomb-o-matic'
