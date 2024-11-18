const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 3000;

// Simule une base de données locale
const licenses = {};

// Endpoint pour enregistrer une licence
app.post("/register", (req, res) => {
  const { deviceId, licenseKey } = req.body;

  if (!deviceId || !licenseKey) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  if (!licenses[deviceId]) {
    licenses[deviceId] = {
      licenseKey,
      activated: true,
      date: new Date(),
    };
    return res.json({ success: true, message: "License registered successfully" });
  }

  res.status(400).json({ success: false, message: "Device already registered" });
});

// Endpoint pour valider une licence
app.post("/validate", (req, res) => {
  const { deviceId, licenseKey } = req.body;

  const license = licenses[deviceId];
  if (license && license.licenseKey === licenseKey) {
    return res.json({ valid: true });
  }

  res.status(400).json({ valid: false, message: "Invalid license" });
});

// Endpoint pour consulter toutes les licences
app.get("/licenses", (req, res) => {
  res.json(licenses);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});