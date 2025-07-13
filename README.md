# 🤖 Homebridge Roomb‑O‑Matic

The O‑Matic Factory–engineered Homebridge plugin to connect iRobot Roomba vacuums as **true vacuum accessories** in HomeKit (instead of fans). Future-proofed for Matter semantics and designed with robust TypeScript architecture.

---

## ✨ Features

- ✅ Exposes as a vacuum accessory using `Fanv2` workaround until official support lands.
- ✅ Explicit start, stop, and dock controls.
- ✅ Battery and bin status services included.
- ✅ UI-configurable via Homebridge Config UI X.
- ✅ Modern, modular TypeScript codebase — no legacy drift.
- ✅ Brand governed under O‑Matic Spec 5, Closed Factory principles.

---

## ⚡ Installation

```bash
sudo npm install -g homebridge-roomb-o-matic


⸻

🛠 Configuration

Via Homebridge UI (preferred) or in config.json:

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

🗺 Roadmap
	•	Add full native Vacuum service (once supported by Homebridge and HomeKit).
	•	Support advanced obstacle/contact sensors.
	•	Prepare Matter bridging logic for future multi-platform support.
	•	Optional room and zone cleaning integration (via dorita980).

⸻

🤝 Credits & Acknowledgments
	•	Heavily inspired by homebridge-roomba2 and dorita980.
	•	Architectural ideas drawn from homebridge-xiaomi-roborock-vacuum.
	•	Reimagined, rebuilt, and brand-governed under O‑Matic Factory by James Walker.

⸻

💥 Comparison with other plugins

Feature	Roomba2	Xiaomi-Roborock Plugin	Roomb‑O‑Matic v1.1.0
Vacuum service	Fan only	Fan only	FanV2 (future-ready vacuum)
Dock service	Not explicit	No	Explicit switch & command
Battery service	Yes	Yes	Yes
Bin status sensor	Partial	No	Yes
Config UI schema	No	No	Yes
Brand framework	Community	Community	O‑Matic Closed Factory


⸻

💬 Support

Please open issues or discussion threads on our GitHub repo.
Join the journey to make HomeKit vacuums first-class citizens!

⸻

