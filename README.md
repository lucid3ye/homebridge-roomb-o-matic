# 🧹 homebridge-roomb-o-matic

**Roomba plugin reimagined with O‑Matic Factory magic.**  
True vacuum semantics. Fully Homebridge UI-integrated. Built for future-ready, brand-driven Roomba control.

![npm](https://img.shields.io/npm/v/homebridge-roomb-o-matic)  
📦 [`homebridge-roomb-o-matic`](https://www.npmjs.com/package/homebridge-roomb-o-matic)  
🔧 [Configuration Schema](./config.schema.json)  
🔗 [GitHub](https://github.com/lucid3ye/homebridge-roomb-o-matic)

---

## 🆕 What’s New in v1.2.0

- ✅ **Battery Level + Charging Status Reporting**
- ✅ **Dock Command Support**
- ✅ **Polling Loop Added** for live status updates
- ✅ **Fully Working Homebridge UI Schema**
- ✅ **Config Cleanup** (uses `ip` instead of `robotIP`)
- ✅ **Internal Cleanup & Agent Conformance (Spec 7)**

---

## 🧠 About

`homebridge-roomb-o-matic` is a modern Homebridge plugin that connects your iRobot Roombas to Apple HomeKit using the [dorita980](https://github.com/koalazak/dorita980) library — wrapped in brand-safe, reliable, and scalable architecture.

Brought to life by [O‑Matic Factory](https://o-matic.me), this plugin is designed for **Homebridge enthusiasts, tinkerers, and anyone who wants more from their Roomba.**

---

## 🛠 Installation

### ✅ From Homebridge UI

1. Navigate to the **Plugins** tab
2. Search for `roomb-o-matic`
3. Click **Install**
4. Follow the config instructions (see below)

### 📦 Or via terminal

```bash
npm install -g homebridge-roomb-o-matic


⸻

⚙️ Configuration

Once installed, go to the Homebridge Config UI or manually update your config.json like this:

{
  "platform": "RoombOMatic",
  "plugin_map": {
    "plugin_name": "homebridge-roomb-o-matic"
  },
  "name": "RoombOMatic",
  "devices": [
    {
      "name": "Living Room Roomba",
      "blid": "314159265358979",
      "ip": "192.168.1.42",
      "password": "your_roomba_password"
    }
  ],
  "debug": false
}

Need help getting your Roomba’s BLID and password? Use dorita980 or follow community guides.

⸻

🧪 Features
	•	🔐 Secure connection to Roomba via local network
	•	🧹 Start, stop, dock, locate — all via HomeKit
	•	🔋 Battery level + charging status
	•	🏠 True HomeKit Vacuum accessory category
	•	🪟 Homebridge Config UI support with full schema
	•	🧠 Designed with long-term compatibility in mind

⸻

🧯 Troubleshooting

Check your logs in Homebridge. Common issues include:
	•	❌ Incorrect password or BLID — double-check using dorita980 pairing
	•	❌ Robot unreachable — ensure it’s awake and on the same network
	•	❌ Plugin not loading — try npm rebuild and restart Homebridge

Still stuck? Open an issue here:
👉 https://github.com/lucid3ye/homebridge-roomb-o-matic/issues

⸻

💡 Development

git clone https://github.com/lucid3ye/homebridge-roomb-o-matic.git
cd homebridge-roomb-o-matic
npm install
npm run build
npm link

Then run Homebridge in a second terminal to test your dev build.

⸻

📜 License

MIT — built by James Walker via O‑Matic Factory
Learn more: https://o-matic.me

⸻

🛡️ Legal

“Roomb-O-Matic” is not affiliated with iRobot. This is an independent plugin intended for personal use only.

