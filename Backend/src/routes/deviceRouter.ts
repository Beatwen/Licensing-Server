import { Router } from "express";
import Device from "../models/device";
import License from "../models/licensing";
import { authenticateHybrid } from "../config/authServer";

const deviceRouter = Router();

// Route utilisée par l'app MAUI/Blazor
deviceRouter.post("/add", authenticateHybrid, async (req, res) => {
  const { licenseKey, deviceId } = req.body;
  const maxDevices = 3;

  if (!licenseKey || !deviceId) {
    res.status(400).json({ error: "License key and device ID are required." });
    return;
  }

  try {
    const license = await License.findOne({ where: { licenseKey } });
    if (!license) {
      res.status(404).json({ error: "License not found." });
      return;
    }

    const deviceCount = await Device.count({ where: { licenseId: license.id } });
    if (deviceCount >= maxDevices) {
      res
        .status(403)
        .json({ error: `Maximum device limit (${maxDevices}) reached for this license.` });
      return;
    }

    const existingDevice = await Device.findOne({
      where: { licenseId: license.id, deviceId },
    });
    if (existingDevice) {
      res.status(200).json({ message: "Device already registered." });
      return;
    }

    await Device.create({ licenseId: license.id, deviceId });
    res.status(201).json({ message: "Device added successfully." });
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Routes pour l'interface web
deviceRouter.get("/:licenseKey", authenticateHybrid, async (req, res) => {
  const { licenseKey } = req.params;

  if (!licenseKey) {
    res.status(400).json({ error: "License key is required." });
    return;
  }

  try {
    const license = await License.findOne({
      where: { licenseKey },
      include: { model: Device, as: "devices" },
    });

    if (!license) {
      res.status(404).json({ error: "License not found." });
      return;
    }

    res.status(200).json({ devices: license.devices });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

deviceRouter.post("/remove", authenticateHybrid, async (req, res) => {
  const { licenseKey, deviceId } = req.body;
  console.log("licenseKey", licenseKey);
  console.log("deviceId", deviceId);

  if (!licenseKey || !deviceId) {
    res.status(400).json({ error: "License key and device ID are required." });
    return;
  }

  try {
    const license = await License.findOne({ where: { licenseKey } });
    if (!license) {
      res.status(400).json({ error: "Invalid license key." });
      return;
    }

    const device = await Device.findOne({
      where: { id: deviceId }
    });
    
    if (!device) {
      res.status(400).json({ error: "Device not found." });
      return;
    }

    if (device.licenseId !== license.id) {
      res.status(400).json({ error: "Device does not belong to this license." });
      return;
    }
    await device.destroy();
    res.status(200).json({ message: "Device removed successfully." });
  } catch (error) {
    console.error("Error removing device:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default deviceRouter;
