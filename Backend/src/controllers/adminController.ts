import { Request, Response } from "express";
import { User } from "../models/user";
import License from "../models/licensing";
import Device from "../models/device";
import bcrypt from "bcrypt";

export class AdminController {
  // Gestion des utilisateurs
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: License,
            as: 'licenses',
            include: [
              {
                model: Device,
                as: 'devices'
              }
            ]
          }
        ]
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, password, isAdmin } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Mise à jour des champs
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (isAdmin !== undefined) user.isAdmin = isAdmin;
      
      // Si un nouveau mot de passe est fourni, le hasher
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      await user.save();
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Supprimer d'abord les licences et les appareils associés
      const licenses = await License.findAll({ where: { userId } });
      for (const license of licenses) {
        await Device.destroy({ where: { licenseId: license.id } });
      }
      await License.destroy({ where: { userId } });

      // Supprimer l'utilisateur
      await user.destroy();
      res.status(200).json({ message: "User and associated data deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Gestion des licences
  static async getUserLicenses(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const licenses = await License.findAll({
        where: { userId },
        include: [
          {
            model: Device,
            as: 'devices'
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(licenses);
    } catch (error) {
      console.error("Error fetching user licenses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateLicense(req: Request, res: Response): Promise<void> {
    try {
      const { licenseId } = req.params;
      const { status, expirationDate, maxDevices } = req.body;

      const license = await License.findByPk(licenseId);
      if (!license) {
        res.status(404).json({ error: "License not found" });
        return;
      }

      if (status) license.status = status;

      await license.save();
      res.status(200).json({ message: "License updated successfully" });
    } catch (error) {
      console.error("Error updating license:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteLicense(req: Request, res: Response): Promise<void> {
    try {
      const { licenseId } = req.params;
      const license = await License.findByPk(licenseId);

      if (!license) {
        res.status(404).json({ error: "License not found" });
        return;
      }

      // Supprimer d'abord les appareils associés
      await Device.destroy({ where: { licenseId } });
      
      // Supprimer la licence
      await license.destroy();
      res.status(200).json({ message: "License and associated devices deleted successfully" });
    } catch (error) {
      console.error("Error deleting license:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Gestion des appareils
  static async getLicenseDevices(req: Request, res: Response): Promise<void> {
    try {
      const { licenseId } = req.params;
      const devices = await Device.findAll({
        where: { licenseId },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(devices);
    } catch (error) {
      console.error("Error fetching license devices:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteDevice(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId } = req.params;
      const device = await Device.findByPk(deviceId);

      if (!device) {
        res.status(404).json({ error: "Device not found" });
        return;
      }

      await device.destroy();
      res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
      console.error("Error deleting device:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
} 