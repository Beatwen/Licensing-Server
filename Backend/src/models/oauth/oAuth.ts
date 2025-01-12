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
    console.log("Client Record:", clientRecord);

    const accessTokenPayload = {
      sub: user.id,
      client_id: clientRecord.clientOauthId,
      scope: token.scope,
    };
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    console.log("JWT Secret Key:", jwtSecret);
    console.log("Access Token Payload:", accessTokenPayload);
    const accessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '1h' });
    console.log("Access Token:", accessToken);
    
    const accessTokenData = {
      accessToken: accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      clientId: clientRecord.id,
      oauthClientId: clientRecord.clientOauthId,
      userId: user.id,
    };
    console.log("Access Token Data:", accessTokenData);

    await AccessToken.create(accessTokenData);
    console.log("Access Token Created");

    const refreshTokenPayload = {
      sub: user.id,
      client_id: clientRecord.clientOauthId,
    };
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY;
    if (!jwtRefreshSecret) {
      throw new Error("JWT_REFRESH_SECRET_KEY is not defined");
    }
    console.log("JWT Refresh Secret Key:", jwtRefreshSecret);
    console.log("Refresh Token Payload:", refreshTokenPayload);
    const refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecret, { expiresIn: '14d' });
    console.log("Refresh Token:", refreshToken);

    console.log("Creating Refresh Token with clientOauthId:", clientRecord.clientOauthId);
    const refreshTokenData = {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      clientId: clientRecord.id, // Ensure clientId is set correctly
      oauthClientId: clientRecord.clientOauthId, // Ensure oauthClientId is set correctly
      userId: user.id,
    };
    console.log("Refresh Token Data:", refreshTokenData);

    await RefreshToken.create(refreshTokenData);
    console.log("Refresh Token Created");

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
    const token = await AccessToken.findOne({ where: { accessToken } });
    if (!token) {
      return null;
    }
    const client = await Client.findOne({ where: { id: token.clientId } });
    if (!client) {
      return null;
    }
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client: { id: client.clientOauthId, grants: client.grants }, // Inclure grants
      user: { id: token.userId }, 
    };
  },

  getRefreshToken: async (refreshToken: string) => {
    const token = await RefreshToken.findOne({ where: { refreshToken } });
    if (!token) {
      return null;
    }
    const client = await Client.findOne({ where: { id: token.clientId } });
    if (!client) {
      return null;
    }
    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: { id: client.clientOauthId, grants: client.grants },
      user: { id: token.userId},
    };
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