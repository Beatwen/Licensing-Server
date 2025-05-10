import bcrypt from "bcrypt";
import Client from "../client";
import { User } from "../user";
import AccessToken from "../oauth/accessToken";
import RefreshToken from "../oauth/refreshToken";
import { Token, AuthorizationCode, RefreshToken as OAuthRefreshToken } from "oauth2-server";
import jwt from 'jsonwebtoken';

const essai = process.env.DB_NAME;



const oAuthModel = {
  getClient: async (clientOauthId: string, clientSecret: string) => {
    const client = await Client.findOne({ where: { clientOauthId, clientSecret } });
    if (!client) {
      return null;
      
    }
    return {
      id: client.clientOauthId,
      grants: client.grants,
    };
  },

  getUser: async (username: string, password: string) => {
    const user = await User.findOne({ where: { email: username } });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  },

  saveToken: async (token: Token, client: any, user: any) => {

    // Fetch the client using clientOauthId
    const clientRecord = await Client.findOne({ where: { clientOauthId: client.id } });
    if (!clientRecord) {
      throw new Error("Client not found");
    }

    const accessTokenPayload = {
      sub: user.id,
      client_id: clientRecord.clientOauthId,
      scope: token.scope,
    };
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    const accessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '1h' });
    
    const accessTokenData = {
      accessToken: accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      clientId: clientRecord.id,
      oauthClientId: clientRecord.clientOauthId,
      userId: user.id,
    };

    await AccessToken.create(accessTokenData);

    const refreshTokenPayload = {
      sub: user.id,
      client_id: clientRecord.clientOauthId,
    };
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
    if (!jwtRefreshSecret) {
      throw new Error("JWT_REFRESH_SECRET_KEY is not defined");
    }
    const refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecret, { expiresIn: '365d' }); 
    const refreshTokenData = {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt || null, 
      clientId: clientRecord.id, 
      oauthClientId: clientRecord.clientOauthId, 
      userId: user.id,
    };
    await RefreshToken.create(refreshTokenData);


    return {
      accessToken: accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: { id: clientRecord.clientOauthId, grants: clientRecord.grants },
      user: { id: user.id },
    };
  },

  getAccessToken: async (accessToken: string) => {
    console.log("getAccessToken called with token:", accessToken);
    
    try {
      // Vérifier si le token est un JWT valide
      const jwtSecret = process.env.JWT_SECRET_KEY;
      if (!jwtSecret) {
        console.error("JWT_SECRET_KEY is not defined");
        return null;
      }
      
      try {
        const decoded = jwt.verify(accessToken, jwtSecret);
        console.log("JWT token decoded successfully:", decoded);
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError);
      }
      
      const token = await AccessToken.findOne({ where: { accessToken } });
      console.log("Token found in database:", token ? "Yes" : "No");
      
      if (!token) {
        return null;
      }
      
      const client = await Client.findOne({ where: { id: token.clientId } });
      console.log("Client found:", client ? "Yes" : "No");
      
      if (!client) {
        return null;
      }
      
      console.log("Returning token data for authentication");
      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: { id: client.clientOauthId, grants: client.grants }, // Inclure grants
        user: { id: token.userId }, 
      };
    } catch (error) {
      console.error("Error in getAccessToken:", error);
      return null;
    }
  },

  getRefreshToken: async (refreshToken: string) => {
    try {
      const token = await RefreshToken.findOne({ where: { refreshToken } });
      if (!token) {
        console.error("Refresh token not found");
        return null;
      }
      const client = await Client.findOne({ where: { id: token.clientId } });
      if (!client) {
        console.error("Client not found for refresh token");
        return null;
      }
      return {
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: { id: client.clientOauthId, grants: client.grants },
        user: { id: token.userId },
      };
    } catch (error) {
      console.error("Error fetching refresh token:", error);
      return null;
    }
  },

  revokeToken: async (token: OAuthRefreshToken) => {
    const refreshToken = await RefreshToken.findOne({ where: { refreshToken: token.refreshToken } });
    if (!refreshToken) {
      return false;
    }
    await refreshToken.destroy();
    return true;
  },

  verifyScope: async (token: Token, scope: string | string[]) => {
    return true;
  },
};

export default oAuthModel;