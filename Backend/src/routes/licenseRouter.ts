// src/routes/licenseRouter.ts
import { Router } from "express";
import {LicenseController} from "../controllers/licenseController";

const licenseRouter = Router();

licenseRouter.get("/:id", LicenseController.getUserLicenses);
licenseRouter.post("/validate", LicenseController.validateLicense);
licenseRouter.post("/activate", LicenseController.activateLicense);
licenseRouter.post("/activate-and-validate", LicenseController.activateAndValidateLicense);
licenseRouter.post("/buy", LicenseController.buyLicense);


export default licenseRouter;
