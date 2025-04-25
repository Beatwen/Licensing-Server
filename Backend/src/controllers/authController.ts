import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Device from "../models/device";
import License from "../models/licensing";
import Client from "../models/client";
import { User } from "../models/user";
import RefreshToken from "../models/oauth/refreshToken";
import { createUserUtil } from "../utils/userUtils";
import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import oAuthModel from "../models/oauth/oAuth";
import jwt from 'jsonwebtoken';
import oauth from "../config/authServer";
import AccessToken from "../models/oauth/accessToken";

export class AuthController {
  static async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  static async login(req: Request, res: Response): Promise<void> {
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

      const client = await Client.findOne({ where: { userId: user.id } });
      if (!client) {
        res.status(500).json({ error: "No OAuth client found for user" });
        return;
      }

      req.body.client_id = client.clientOauthId;
      req.body.client_secret = client.clientSecret;
      req.body.grant_type = 'password';
      req.body.username = email;

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

      res.status(200).json({
        message: "Login successful!",
        user: user,
        token: token,
        redirectTo,
        client: {
          clientId: client.clientOauthId,
          clientSecret: client.clientSecret
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { userName, firstName, lastName, email, password } = req.body;

      if (!firstName) {
        res.status(400).json({ error: "Firstname is required" });
        return;
      }
      else if (!lastName) {
        res.status(400).json({ error: "Lastname is required" });
        return;
      }
      else if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }
      else if (!password) {
        res.status(400).json({ error: "Password is required" });
        return;
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
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    try {
      const refreshToken = await RefreshToken.findOne({
        where: { refreshToken: token },
        include: [
          { model: Client, as: 'Client' },
          { model: User, as: 'User' }
        ]
      });

      if (!refreshToken) {
        res.status(400).json({ error: "Invalid token" });
        return;
      }

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

      await RefreshToken.destroy({ where: { refreshToken: token } });

      res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    try {
      const tokenRecord = await RefreshToken.findOne({
        where: { refreshToken },
        include: [
          { model: Client, as: 'Client' },
          { model: User, as: 'User' }
        ]
      });

      if (!tokenRecord) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }

      if (tokenRecord.refreshTokenExpiresAt && new Date(tokenRecord.refreshTokenExpiresAt) < new Date()) {
        res.status(401).json({ error: "Refresh token expired" });
        return;
      }

      const accessTokenPayload = {
        sub: tokenRecord.User?.id,
        client_id: tokenRecord.Client?.clientOauthId,
        scope: 'all',
      };

      const jwtSecret = process.env.JWT_SECRET_KEY;
      if (!jwtSecret) {
        res.status(500).json({ error: "JWT_SECRET_KEY is not defined" });
        return;
      }

      const newAccessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '1h' });

      // Generate new refresh token
      const newRefreshToken = uuidv4();
      const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Create new refresh token record
      await RefreshToken.create({
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt,
        clientId: tokenRecord.clientId,
        oauthClientId: tokenRecord.Client.clientOauthId,
        userId: tokenRecord.userId
      });

      // Delete old refresh token
      await RefreshToken.destroy({ where: { refreshToken } });

      await AccessToken.upsert({
        accessToken: newAccessToken,
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        clientId: tokenRecord.clientId,
        oauthClientId: tokenRecord.Client.clientOauthId,
        userId: tokenRecord.userId
      });

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        message: "Tokens refreshed successfully"
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
} 