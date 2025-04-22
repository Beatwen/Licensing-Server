import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { authenticate, isAdmin } from "../config/authServer";

const adminRouter = Router();

// Routes protégées nécessitant les droits admin
adminRouter.get("/users", authenticate, isAdmin, AdminController.getAllUsers);
adminRouter.get("/users/:userId", authenticate, isAdmin, AdminController.getUserDetails);
adminRouter.put("/users/:userId", authenticate, isAdmin, AdminController.updateUser);
adminRouter.delete("/users/:userId", authenticate, isAdmin, AdminController.deleteUser);

// Gestion des licences
adminRouter.get("/users/:userId/licenses", authenticate, isAdmin, AdminController.getUserLicenses);
adminRouter.put("/licenses/:licenseId", authenticate, isAdmin, AdminController.updateLicense);
adminRouter.delete("/licenses/:licenseId", authenticate, isAdmin, AdminController.deleteLicense);

// Gestion des appareils
adminRouter.get("/licenses/:licenseId/devices", authenticate, isAdmin, AdminController.getLicenseDevices);
adminRouter.delete("/devices/:deviceId", authenticate, isAdmin, AdminController.deleteDevice);

export default adminRouter; 