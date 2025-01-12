import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import oAuthModel from "../models/oauth/oAuth";
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const oauth = new OAuth2Server({
  model: oAuthModel, 
  accessTokenLifetime: 3600, 
});

export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

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