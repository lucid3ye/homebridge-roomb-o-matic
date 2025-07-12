# Homebridge Roomb-O-Matic

The O‑Matic Factory–engineered Homebridge plugin to connect iRobot Roomba vacuums as **vacuum accessories** in HomeKit (instead of fans). Future-proofed for Matter semantics and clean TypeScript design.

---

## ✨ Features

- ✅ Exposes as a vacuum accessory (using `Fanv2` workaround until full support lands).
- ✅ Clean start/stop controls.
- ✅ Future-ready design for Matter vacuum semantics.
- ✅ Cleaner code, modern TypeScript, minimal dependencies.
- ✅ O‑Matic Factory brand governance, Spec 5 aligned.

---

## ⚡ Installation

```bash
sudo npm install -g homebridge-roomb-o-matic


⸻

🛠 Configuration

In your Homebridge config.json:

{
  "platform": "RoombOMatic",
  "name": "Roomba",
  "email": "your-irobot-email",
  "password": "your-irobot-password",
  "devices": [
    {
      "blid": "your-blid",
      "ip": "192.168.1.x",
      "name": "Living Room Roomba"
    }
  ]
}


⸻

🗺 Roadmap
	•	Add explicit battery service.
	•	Add contact/obstacle sensors.
	•	Prepare Matter bridging logic (for future).

⸻

🤝 Credits

Originally inspired by homebridge-roomba and dorita980.
Reimagined and rebuilt under O‑Matic Factory brand standards by James Walker.
Spec 5 aligned, Closed Factory security, joyful code design.

⸻

💬 Support



