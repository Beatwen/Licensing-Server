import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Device from "../models/device";
import License from "../models/licensing";
import Client from "../models/client"; 
import {User} from "../models/user"; 
import RefreshToken from "../models/oauth/refreshToken";
import { UniqueConstraintError } from "sequelize"; 
import { createUserUtil } from "../utils/userUtils"; 
import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server"; 
import oAuthModel from "../models/oauth/oAuth";

const oauth = new OAuth2Server({
  model: oAuthModel,
  accessTokenLifetime: 3600, // 1 heure
});

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

      const request = new OAuthRequest(req);
      const response = new OAuthResponse(res);

      const token = await oauth.token(request, response);

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
        token: token,
        redirectTo,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;

    // Vérifiez que tous les champs requis sont présents
    if (!firstName) {
      res.status(400).json({ error: "Firstname is required" });
      return;
    }
    else if (!lastName) {
      res.status(400).json({ error: "Lastname is required" });
    }
    else if ( !email) {
      res.status(400).json({ error: "Email is required" });
    }
    else if (!password) {
      res.status(400).json({ error: "Password is required" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const newUser = await createUserUtil(userName, firstName, lastName, email, password);


    const clientId = uuidv4();
    const clientSecret = uuidv4();
    const grants = ["password", "refresh_token"];

    const newClient = await Client.create({
      clientOauthId: clientId,
      clientSecret,
      grants,
      userId: newUser.id,
    });

    res.status(201).json({
      message: "User and client registered successfully",
      user: newUser,
      client: {
        clientId: newClient.clientOauthId,
        clientSecret: newClient.clientSecret,
      },
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

authRouter.post("/logout", async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }
  console.log("Token ici !!!:", token);
  try {
    const refreshToken = await RefreshToken.findOne({ 
      where: { refreshToken: token }, 
      include: [
        { model: Client, as: 'Client' },
        { model: User, as: 'User' }
      ] 
    });
    console.log("Refresh Token:", refreshToken);

    if (!refreshToken) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    // Accéder aux propriétés de Client et User
    const clientOauthId = refreshToken.Client?.clientOauthId;
    const clientGrants = refreshToken.Client?.grants;
    const userId = refreshToken.User?.id;

    if (!clientOauthId || !clientGrants || !userId) {
      res.status(400).json({ error: "Invalid token data" });
      return;
    }

    const revoked = await oAuthModel.revokeToken({
      refreshToken: refreshToken.refreshToken,
      client: { id: clientOauthId, grants: clientGrants },
      user: { id: userId.toString() },
    });

    if (!revoked) {
      res.status(400).json({ error: "Failed to revoke token" });
      return;
    }

    // Révoquer le refresh token en le supprimant de la base de données
    await RefreshToken.destroy({ where: { refreshToken: token } });
    console.log("Refresh Token revoked");

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
export default authRouter;