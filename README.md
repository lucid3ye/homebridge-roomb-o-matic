
# 🤖 Homebridge Roomb‑O‑Matic

The O‑Matic Factory–engineered Homebridge plugin to connect iRobot Roomba vacuums as **true vacuum accessories** in HomeKit. Future-proofed for Matter semantics and designed with robust TypeScript architecture.

---

## ✨ Features

- ✅ Exposes as a classic Fan service (shows tiles in Home app today).
- ✅ Hybrid model support: works with advanced (`getRobotState`) and local-only (`getStatus`) Roombas.
- ✅ Explicit dock control with a dedicated switch.
- ✅ Battery level and bin status included.
- ✅ UI-configurable via Homebridge Config UI X.
- ✅ O‑Matic Factory brand governance and Spec 5 alignment.

---

## ⚡ Installation

```bash
sudo npm install -g homebridge-roomb-o-matic


⸻

🛠 Configuration

Recommended: Use Homebridge UI to configure (Config UI X).

Or manually in config.json:

{
  "platform": "Roomb-O-Matic",
  "name": "Roomb-O-Matic",
  "devices": [
    {
      "name": "Living Room Roomba",
      "blid": "your-blid",
      "robotpwd": "your-password",
      "ipaddress": "192.168.1.x"
    }
  ]
}


⸻

🔑 How to get your BLID & password

npm install -g dorita980
cd ~ && mkdir roomba-get-password && cd roomba-get-password
npm init -y
npm install dorita980

Create a file get-password.js:

const dorita980 = require('dorita980');

dorita980.getRobotPublicInfo((i) => {
  dorita980.getPassword(i.ip, i.blid).then((pwd) => {
    console.log('BLID:', i.blid);
    console.log('Password:', pwd.password);
    process.exit();
  }).catch(console.error);
});

Then run:

node get-password.js


⸻

🗺 Roadmap
	•	Add support for advanced mission controls (room zones).
	•	Prepare native Vacuum service when Homebridge/HAP supports it.
	•	Integrate Matter support once Roomba firmware supports Matter 1.2.

⸻

🚨 v1.1.5 Release Notes
	•	✅ Classic Fan service for Home app tile visibility.
	•	✅ Hybrid support for both local-only and advanced Roombas.
	•	✅ Explicit dock switch added.
	•	✅ Improved state polling logic (hybrid detection).
	•	✅ Set proper accessory category to Vacuum for future-proofing.
	•	✅ Updated logs and error handling.

⸻

💬 Support

Please open issues or discussions on GitHub if you run into trouble — or if you’d like to help shape future advanced features!

