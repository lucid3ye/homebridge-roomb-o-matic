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
  client: InstanceType<typeof dorita980.Local>;
}

export async function getRoombas(devices: DeviceConfig[], log: Logging): Promise<Robot[]> {
  const robots: Robot[] = [];

  for (const device of devices) {
    const { blid, password, ip } = device;
    try {
      const client = new dorita980.Local(blid, password, ip);
      await client.on('connect');
      await client.getRobotState(['name']); // Quick ping
      log.info(`Connected to Roomba at ${ip}`);
      robots.push({
        name: device.name,
        blid,
        password,
        ip,
        client,
      });
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

export async function dockRoomba(robot: Robot, log: Logging): Promise<void> {
  try {
    await robot.client.sendCommand('dock');
    log.info(`${robot.name}: Docking initiated.`);
  } catch (err) {
    log.error(`${robot.name}: Failed to dock - ${err}`);
    throw err;
  }
}

export async function getRobotStatus(robot: Robot, log: Logging): Promise<{
  batteryLevel: number;
  isDocked: boolean;
  isRunning: boolean;
}> {
  try {
    const state = await robot.client.getRobotState([
      'batPct',
      'cleanMissionStatus',
      'dock',
    ]);

    const batteryLevel = state.batPct ?? 100;
    const phase = state.cleanMissionStatus?.phase ?? '';
    const docked = state.dock?.known && state.dock?.state === 'dock';

    const isRunning = ['run', 'clean', 'hmUsrDock', 'pause'].includes(phase);
    const isDocked = phase === 'charge' || docked;

    return { batteryLevel, isDocked, isRunning };
  } catch (err) {
    log.warn(`${robot.name}: Failed to get status - ${err}`);
    return { batteryLevel: 0, isDocked: false, isRunning: false };
  }
}
