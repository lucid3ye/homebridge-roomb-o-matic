"use strict";
/* src/roomba.ts */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoombas = getRoombas;
exports.getIP = getIP;
exports.getCredentials = getCredentials;
const node_buffer_1 = require("node:buffer");
const node_dgram_1 = require("node:dgram");
const node_https_1 = require("node:https");
/**
 * Get Roombas — normalize robots object to array
 */
async function getRoombas(robots, log) {
    const all = Array.isArray(robots) ? robots : Object.values(robots);
    log.debug('Processed robots:', JSON.stringify(all));
    return all;
}
/**
 * Get local IP address of Roomba using UDP broadcast
 */
async function getIP(blid, attempt = 1) {
    return new Promise((resolve, reject) => {
        const server = (0, node_dgram_1.createSocket)('udp4');
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
            const message = node_buffer_1.Buffer.from([0xf0, 0x0f]); // Example broadcast packet
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
async function getCredentials(email, password) {
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
                'Content-Length': node_buffer_1.Buffer.byteLength(payload),
            },
        };
        const req = (0, node_https_1.request)(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.errorCode) {
                        reject(new Error(`Gigya error: ${json.errorMessage}`));
                    }
                    else {
                        resolve(json);
                    }
                }
                catch (err) {
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
