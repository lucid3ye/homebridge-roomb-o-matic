# 🧹 homebridge-roomb-o-matic

**Roomba plugin reimagined with O‑Matic Factory magic.**  
True vacuum semantics. Fully Homebridge UI-integrated. Built for future-ready, brand-driven Roomba control.

![npm](https://img.shields.io/npm/v/homebridge-roomb-o-matic)  
📦 [`homebridge-roomb-o-matic`](https://www.npmjs.com/package/homebridge-roomb-o-matic)  
🔧 [Configuration Schema](./config.schema.json)  
🔗 [GitHub](https://github.com/lucid3ye/homebridge-roomb-o-matic)

---

## 🆕 What’s New in v1.1.7

- ✅ **Vacuum Category Added:** Accessories now show up correctly in HomeKit as Vacuums (`Categories.VACUUM`)
- ✅ **Improved Tile Support:** One Roomba, one tile — or many, cleanly grouped
- ✅ **Updated Config Schema:** Better integration with Homebridge Config UI
- ✅ **New Metadata & Tags:** Improved discoverability in Homebridge Plugin Library

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
  "devices": [
    {
      "name": "Living Room Roomba",
      "blid": "314159265358979",
      "password": "your_roomba_password"
    }
  ]
}

Need help getting your Roomba blid and password? Use dorita980 or follow guides in the community.

⸻

🧪 Features
	•	🔐 Secure connection to Roomba via local network
	•	🧹 Start, stop, dock, locate via HomeKit
	•	🏠 True HomeKit vacuum accessory category
	•	🪟 Homebridge Config UI support with built-in schema
	•	🧠 Designed with long-term compatibility in mind

⸻

🐞 Troubleshooting

Check your logs in Homebridge. Common issues include:
	•	Wrong password or blid — double-check with dorita980 pairing script
	•	Robot not reachable — ensure it’s on the same network and awake
	•	Plugin not loading — try npm rebuild and restart Homebridge

Still stuck? Open an issue here:
👉 https://github.com/lucid3ye/homebridge-roomb-o-matic/issues

⸻

💡 Development

git clone https://github.com/lucid3ye/homebridge-roomb-o-matic.git
cd homebridge-roomb-o-matic
npm install
npm run build
npm link

Run Homebridge in another terminal to test your dev build.

⸻

📜 License

MIT — built by James Walker via O‑Matic Factory
Learn more: https://o-matic.me

⸻

🛡️ “Roomb-O-Matic” is not affiliated with iRobot. This is an independent plugin for personal use.

