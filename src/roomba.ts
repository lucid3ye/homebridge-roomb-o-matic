/**
 * Roomb-O-Matic Roomba Integration — Version 1.7
 * Part of the O‑Matic Factory Homebridge Suite
 * https://o-matic.me
 */

import dorita980 from 'dorita980';
import type { Logging } from 'homebridge';
import type { DeviceConfig } from './settings.js';

export interface Robot {
  name: string;
  blid: string;
  password: string;
  ip: string;
  client?: any;
}

export async function getRoombas(devices: DeviceConfig[], log: Logging): Promise<Robot[]> {
  const robots: Robot[] = [];

  for (const device of devices) {
    const { blid, password, ip } = device;
    try {
      const client = new dorita980.Local(blid, password, ip);
      log.info(`Connected to Roomba at ${ip}`);
      await client.getRobotState(['name']); // Quick ping
      robots.push({ name: device.name, blid, password, ip, client });
    } catch (error) {
      log.warn(`Failed to connect to Roomba (${device.name}) at ${ip}: ${error}`);
    }
  }

  return robots;
}

export async function startRoomba(robot: Robot, log: Logging): Promise<void> {
  try {
    await robot.client.start();
    log.info(`${robot.name}: Cleaning started.`);
  } catch (err) {
    log.error(`${robot.name}: Failed to start cleaning - ${err}`);
    throw err;
  }
}

export async function stopRoomba(robot: Robot, log: Logging): Promise<void> {
  try {
    await robot.client.stop();
    log.info(`${robot.name}: Cleaning stopped.`);
  } catch (err) {
    log.error(`${robot.name}: Failed to stop cleaning - ${err}`);
    throw err;
  }
}
