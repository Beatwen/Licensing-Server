// src/controllers/licenseController.ts
import { Request, Response } from "express";
import License from "../models/licensing";
import { User } from "../models/user";
import Device from "../models/device";
import { sendEmail } from "../utils/emailUtils";

export const activateAndValidateLicense = async (req: Request, res: Response): Promise<void> => {
    const userKey = req.header("X-USER-KEY");
    const deviceId = req.header("X-DEVICE-ID");
    const { licenseKey } = req.body;

    if (!userKey || !deviceId || !licenseKey) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }

    try {
        const license = await License.findOne({ where: { licenseKey } });
        if (!license) {
            res.status(404).json({ valid: false, message: "License not found." });
            return;
        }

        if (license.status === "inactive") {
            license.status = "active";
            await license.save();
        }
        const existingDevice = await Device.findOne({
            where: { licenseId: license.id, deviceId },
        });

        if (existingDevice) {
            res.status(200).json({ valid: true, message: "Device is already registered with this license." });
            return;
        }

        const deviceCount = await Device.count({ where: { licenseId: license.id } });

        if (deviceCount >= 3) {
            res.status(403).json({ valid: false, message: "Maximum number of devices reached (3)." });
            return;
        }

        await Device.create({
            deviceId,
            licenseId: license.id,
        });
        res.status(200).json({ valid: true, message: "License activated and device registered successfully." });
    } catch (error) {
        console.error("Error activating and validating license:", error);
        res.status(500).json({ valid: false, error: "Internal server error." });
    }
};

export const getUserLicenses = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Missing user key." });
        return;
    }
    const licenses = await License.findAll({ where: { userId: id } });
    res.status(200).json(licenses);
}
export const validateLicense = async (req: Request, res: Response): Promise<void> => {
    
    const userKey = req.header("X-USER-KEY");
    const deviceId = req.header("X-DEVICE-ID");
    
    console.log("userKey", userKey);
    console.log("deviceId", deviceId);
    const { licenseKey } = req.body;

    if (!userKey || !deviceId || !licenseKey) {
        res.status(400).json({ error: "Missing required fields." });
        return;
    }
    try {
        const license = await License.findOne({
            where: { licenseKey, status: "active" },
        });

        if (!license) {
            res.status(404).json({ valid: false, message: "License not found or inactive." });
            return;
        }

        // Verify the user exists
        const user = await User.findByPk(userKey);
        if (!user) {
            res.status(403).json({ valid: false, message: "Invalid user." });
            return;
        }

        // Check if the device is already registered
        const existingDevice = await Device.findOne({
            where: { licenseId: license.id, deviceId },
        });

        if (existingDevice) {
            res.status(200).json({ valid: true, message: "Device is already registered." });
            return;
        }

        // Count the devices associated with the license
        const deviceCount = await Device.count({ where: { licenseId: license.id } });

        if (deviceCount >= 3) {
            // Refuse if more than 3 devices
            res.status(403).json({ valid: false, message: "Maximum number of devices reached (3). Please buy another license" });
            return;
        }
        // Add the new device
        await Device.create({
            deviceId,
            licenseId: license.id,
        });
        res.status(200).json({ valid: true, message: "Device registered successfully." });
    } catch (error) {
        console.error("Error validating license:", error);
        res.status(500).json({ valid: false, error: "Internal server error." });
    }
};

export const activateLicense = async (req: Request, res: Response): Promise<void> => {
    const userKey = req.header("X-USER-KEY");
    const { licenseKey } = req.body;
    if (userKey === undefined || !licenseKey) {
        res.status(400).json({ error: "Missing user key or license key." });
        return;
    }
    if (!licenseKey) {
        res.status(400).json({ error: "Missing license key." });
        return;
    }

    try {
        // Verify the license exists
        const license = await License.findOne({
            where: { licenseKey, status: "inactive" },
        });

        if (!license) {
            res.status(404).json({ message: "License not found or already active." });
            return;
        }

        // Activate the license
        license.status = "active";
        await license.save();

        res.status(200).json({ message: "License activated successfully." });
    } catch (error) {
        console.error("Error activating license:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
// src/controllers/licenseController.ts
export const buyLicense = async (req: Request, res: Response): Promise<void> => {
    const { licenseType, userId } = req.body;
    console.log("licenseType", licenseType);
    console.log("userId", userId);
    if (!licenseType || !userId) {
        res.status(400).json({ error: "License type and userID are required." });
        return;
    }

    try {
        const licenseKey = `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        
        const license = await License.create({
            type: licenseType,
            licenseKey,
            status: "inactive",
            userId: user!.id, 
        });
        

        const emailContent = `
            <h1>License Purchase Confirmation</h1>
            <p>Dear user,</p>
            <p>Thank you for purchasing a license. Your license key is:</p>
            <p><strong>${licenseKey}</strong></p>
            <p>Please activate it in your application to start using it.</p>
        `;
        await sendEmail((user.email), "Your License Key", emailContent);

        res.status(201).json({ message: "License created and email sent.", license });
    } catch (error) {
        console.error("Error processing license purchase:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
export const createFreeLicense = async (userId: number): Promise<License> => {
    const licenseKey = `FREE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const freeLicense = await License.create({
        type: "free",
        licenseKey,
        status: "active",
        userId,
    });

    return freeLicense;
};

export const LicenseController = {
    validateLicense,
    activateAndValidateLicense,
    activateLicense,
    buyLicense,
    getUserLicenses,
}