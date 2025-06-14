import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticate } from "../config/authServer";
import { registrationValidation, loginValidation } from "../middleware/validationMiddleware";

const authRouter = Router();

// Routes publiques
authRouter.post("/login", loginValidation, AuthController.login);
authRouter.post("/register", registrationValidation, AuthController.register);
authRouter.get("/confirm-email", AuthController.confirmEmail);
authRouter.post("/refresh", AuthController.refreshToken);
authRouter.post("/forgot-password", AuthController.forgotPassword);
authRouter.get("/verify-reset-token", AuthController.verifyResetToken);
authRouter.post("/reset-password", AuthController.resetPassword);

// Routes protégées (nécessitent d'être authentifié)
authRouter.post("/logout", authenticate, AuthController.logout);

export default authRouter;