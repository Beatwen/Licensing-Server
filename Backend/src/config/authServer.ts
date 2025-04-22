import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import oAuthModel from "../models/oauth/oAuth";
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

dotenv.config();

const oauth = new OAuth2Server({
  model: oAuthModel, 
  accessTokenLifetime: 3600, 
});

interface AuthenticatedRequest extends Request {
  user?: any;
  deviceId?: string;
  userKey?: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    // Extract token manually to ensure it's properly formatted
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      // Set the token directly in the request object for OAuth2Server
      (req as any).headers.authorization = `Bearer ${token}`;
    } else if (req.headers.access_token) {
      token = req.headers.access_token;
      
      // Set the token in the expected format
      (req as any).headers.authorization = `Bearer ${token}`;
    } 
    
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    
    const oauthToken = await oauth.authenticate(request, response);

    (req as AuthenticatedRequest).user = oauthToken.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    
    const user = await User.findByPk(authReq.user.sub);
    if (!user || !user.isAdmin) {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking admin rights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isOwnerOrAdmin = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  // Si c'est un admin, on autorise
  if (req.user.isAdmin) {
    return next();
  }

  // Vérification de l'ID dans l'URL
  if (req.params.id && req.params.id != req.user.id) {
    return res.status(403).json({ error: "Access denied: You can only access your own resources" });
  }

  // Vérification de l'ID dans le body (pour les routes de licence)
  if (req.body.userId && req.body.userId != req.user.id) {
    return res.status(403).json({ error: "Access denied: You can only manage your own resources" });
  }

  next();
};

export const authenticateHybrid = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'];
  const deviceId = req.headers['x-device-id'];
  const userKey = req.headers['x-user-key'];
  const authHeader = req.headers.authorization;

  // Si on a tous les headers spécifiques à l'app MAUI/Blazor
  if (apiKey && deviceId && userKey) {
    // Vérifier que l'API key correspond à celle attendue
    const expectedApiKey = process.env.API_KEY;
    if (apiKey !== expectedApiKey) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // On stocke les informations dans req pour utilisation ultérieure
    req.deviceId = deviceId;
    req.userKey = userKey;
    return next();
  }

  // Sinon, on utilise l'authentification OAuth2 standard
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET_KEY;

  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT_SECRET_KEY is not defined" });
  }

  jwt.verify(token, jwtSecret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token: access token is invalid" });
    }

    req.user = decoded;
    next();
  });
};

export default oauth;