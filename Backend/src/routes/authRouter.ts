import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { sendConfirmationEmail } from "../utils/emailUtils";
import bcrypt from "bcrypt";
import Device from "../models/device";
import License from "../models/licensing";

const authRouter = Router();

authRouter.get(
    "/confirm-email",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.query.token as string; 

        if (!token) {
            res.status(400).json({ error: "Token is required" });
            return;
        }

        try {
            const user = await User.findOne({ where: { confirmationToken: token } });

            if (!user) {
                res.status(404).json({ error: "Invalid or expired token" });
                return;
            }
            user.emailConfirmed = true;
            user.confirmationToken = null; 
            await user.save();

            res.status(200).json({ message: "Email confirmed successfully!" });
        } catch (error) {
            console.error("Error confirming email:", error);
            next(error); 
        }
    }
);

authRouter.post(
    "/login",
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;
      const deviceId = req.header("X-DEVICE-ID");
  
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
  
      try {
        const user = await User.findOne({ where: { email } });
  
        if (!user) {
          res.status(404).json({ error: "User not found." });
          return;
        }
  
        if (!user.emailConfirmed) {
          res.status(403).json({ error: "Email not verified. Please confirm your email." });
          return;
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: "Invalid password." });
          return;
        }
  
        let redirectTo = "/license"; 
        if (deviceId) {
          const device = await Device.findOne({
            where: { deviceId }, 
            include: [
              {
                model: License, 
                as: "license",
                where: { userId: user.id, status: "active" },
              },
            ],
          });
  
          if (device) {
            redirectTo = "/index"; 
          }
        }
  
        // Login successful
        res.status(200).json({
          message: "Login successful!",
          user: user,
          redirectTo,
        });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    }
  );

export default authRouter;
