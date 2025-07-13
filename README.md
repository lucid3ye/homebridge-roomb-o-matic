## 🚨 Release Notes

### v1.1.3 — Stability & Full State Support (July 2025)

- ✅ Replaced legacy `getStatus` calls with correct `getRobotState` from dorita980, enabling full compatibility with modern Roomba models.
- ✅ Battery level and charging state now report accurately using `batPct` and `cleanMissionStatus.phase`.
- ✅ Bin full sensor now works reliably using `bin.full`.
- ✅ Added periodic state polling every 60 seconds for live HomeKit updates without crashing.
- ✅ Major internal refactor: added robust error handling throughout to prevent Homebridge crash loops.
- ✅ Reduced drift, cleaned up legacy logic, and aligned with modern dorita980 semantics.

**Why so many releases today?**  
This rapid sequence was required to fix deep legacy API assumptions and to close out final runtime errors. v1.1.3 is the final stable build in this rapid series — we recommend all users upgrade immediately.

---

## 🔑 How to get your BLID and Password

To connect your Roomba, you need two pieces of information:

1️⃣ **BLID (Robot ID)**  
2️⃣ **Robot Password**

### 📄 Quick steps (dorita980 method)

```bash
npm install -g dorita980
cd ~/ && mkdir roomba-get-password && cd roomba-get-password
npm init -y
npm install dorita980

Then create a file called get-password.js:

const dorita980 = require('dorita980');

dorita980.getRobotPublicInfo((i) => {
  dorita980.getPassword(i.ip, i.blid).then((pwd) => {
    console.log('BLID:', i.blid);
    console.log('Password:', pwd.password);
    process.exit();
  }).catch(console.error);
});

Finally, run:

node get-password.js

Your BLID and password will be printed in the console. Use these in your Homebridge Roomb-O-Matic configuration.

⸻

💬 Support

Please open issues or discussions on our GitHub repository if you have questions or run into any problems. Join us on this journey to make HomeKit vacuums first-class citizens — the O‑Matic way!
