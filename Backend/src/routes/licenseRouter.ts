// src/routes/licenseRouter.ts
import { Router } from "express";
import { LicenseController } from "../controllers/licenseController";
import { authenticate, isOwnerOrAdmin } from "../config/authServer";
import { licenseValidation, handleValidation } from "../middleware/validationMiddleware";

const licenseRouter = Router();

licenseRouter.get("/:id", authenticate, isOwnerOrAdmin, LicenseController.getUserLicenses);
licenseRouter.post("/validate", authenticate, isOwnerOrAdmin, LicenseController.validateLicense);
licenseRouter.post("/activate", authenticate, isOwnerOrAdmin, LicenseController.activateLicense);
licenseRouter.post("/activate-and-validate", authenticate, isOwnerOrAdmin, LicenseController.activateAndValidateLicense);
licenseRouter.post("/buy", authenticate, licenseValidation, handleValidation, LicenseController.buyLicense);

export default licenseRouter;
