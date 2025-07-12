/* src/roomba.ts */

import { Buffer } from 'node:buffer';
import { createSocket } from 'node:dgram';
import { request as httpsRequest } from 'node:https';

/**
 * Robot interface definition
 */
export interface Robot {
  blid: string;
  password: string;
  ip?: string;
}

/**
 * Get Roombas — normalize robots object to array
 */
export async function getRoombas(robots: Record<string, Robot> | Robot[], log: any): Promise<Robot[]> {
  const all = Array.isArray(robots) ? robots : Object.values(robots);
  log.debug('Processed robots:', JSON.stringify(all));
  return all;
}

/**
 * Get local IP address of Roomba using UDP broadcast
 */
export async function getIP(blid: string, attempt = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createSocket('udp4');

    server.on('error', (err) => {
      console.error(`UDP server error: ${err}`);
      server.close();
      reject(err);
    });

    server.on('message', (msg, rinfo) => {
      console.log(`Received UDP response from ${rinfo.address}`);
      server.close();
      resolve(rinfo.address);
    });

    server.on('listening', () => {
      console.log('UDP server listening, sending discovery packet...');
      const message = Buffer.from([0xf0, 0x0f]); // Example broadcast packet
      server.send(message, 0, message.length, 5678, '255.255.255.255', (err) => {
        if (err) {
          console.error(`UDP send error: ${err}`);
          server.close();
          reject(err);
        }
      });

      setTimeout(() => {
        void getIP(blid, attempt + 1).then(resolve).catch(reject);
        server.close();
      }, 5000);
    });

    server.bind();
  });
}

/**
 * Get credentials from Gigya (iRobot cloud login)
 */
export async function getCredentials(email: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const gigyaURL = new URL('https://accounts.us1.gigya.com/accounts.login');
    const payload = JSON.stringify({
      apiKey: 'your_api_key_here',
      loginID: email,
      password: password,
    });

    const options = {
      hostname: gigyaURL.hostname,
      path: gigyaURL.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = httpsRequest(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errorCode) {
            reject(new Error(`Gigya error: ${json.errorMessage}`));
          } else {
            resolve(json);
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}
