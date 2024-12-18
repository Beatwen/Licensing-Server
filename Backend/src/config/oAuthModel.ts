import { PasswordModel, Token, Client, User } from "oauth2-server";

const users: User[] = [
  { id: 1, username: "test", password: "password123" },
];

const clients: Client[] = [
  { id: "1", clientId: "client_id", clientSecret: "client_secret", grants: ["password"] },
];

const tokens: Token[] = [];

const oAuthModel: PasswordModel = {
  // Retrieve a client by ID and secret
  getClient(clientId: string, clientSecret: string): Promise<Client | undefined> {
    return Promise.resolve(
      clients.find(
        (client) => client.clientId === clientId && client.clientSecret === clientSecret
      )
    );
  },

  // Retrieve a user by username and password
  getUser(username: string, password: string): Promise<User | undefined> {
    return Promise.resolve(
      users.find(
        (user) => user.username === username && user.password === password
      )
    );
  },

  // Save a token
  saveToken(token: Token, client: Client, user: User): Promise<Token> {
    const savedToken = { ...token, client, user };
    tokens.push(savedToken);
    return Promise.resolve(savedToken);
  },

  // Retrieve a token
  getAccessToken(accessToken: string): Promise<Token | undefined> {
    return Promise.resolve(
      tokens.find((token) => token.accessToken === accessToken)
    );
  },

  // Verify the token's scope
  verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
    return Promise.resolve(true); // Simplification: All tokens have access to all scopes
  },
};

export default oAuthModel;
