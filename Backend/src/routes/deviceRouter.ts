import { Router, Request, Response, NextFunction } from "express";
import Device from "../models/device";
import License from "../models/licensing";

const deviceRouter = Router();

// Ajouter un appareil à une licence
deviceRouter.post(
    "/add",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { licenseKey, deviceId } = req.body;
      const maxDevices = 3; // Limite maximale d'appareils par licence
  
      if (!licenseKey || !deviceId) {
        res.status(400).json({ error: "License key and device ID are required." });
        return;
      }
  
      try {
        const license = await License.findOne({ where: { licenseKey, status: "active" } });
  
        if (!license) {
          res.status(404).json({ error: "License not found or inactive." });
          return;
        }
  
        // Vérifiez le nombre d'appareils existants pour cette licence
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
        next(error);
      }
    }
  );
  

// Lister les appareils associés à une licence
deviceRouter.get(
  "/:licenseKey",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { licenseKey } = req.params;

    try {
      const license = await License.findOne({
        where: { licenseKey },
        include: { model: Device, as: "devices" },
      });

      if (!license) {
        res.status(404).json({ error: "License not found." });
        return;
      }

      res.status(200).json({ devices: license.licenseKey });
    } catch (error) {
      console.error("Error fetching devices:", error);
      next(error);
    }
  }
);

// Supprimer un appareil d'une licence
deviceRouter.post(
  "/remove",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { licenseKey, deviceId } = req.body;

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

      const device = await Device.findOne({
        where: { licenseId: license.id, deviceId },
      });

      if (!device) {
        res.status(404).json({ error: "Device not found." });
        return;
      }

      await device.destroy();
      res.status(200).json({ message: "Device removed successfully." });
    } catch (error) {
      console.error("Error removing device:", error);
      next(error);
    }
  }
);

export default deviceRouter;
