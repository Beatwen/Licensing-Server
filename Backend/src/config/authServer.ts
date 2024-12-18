import OAuth2Server, { Request as OAuthRequest, Response as OAuthResponse } from "oauth2-server";
import oAuthModel from "./oAuthModel";

const oauth = new OAuth2Server({
  model: oAuthModel, 
  accessTokenLifetime: 3600, // 1 heure
});

export const authenticate = (req: any, res: any, next: any) => {
  const request = new OAuthRequest(req);
  const response = new OAuthResponse(res);

  oauth
    .authenticate(request, response)
    .then(() => next())
    .catch((err) => res.status(err.code || 500).json(err));
};

export default oauth;
