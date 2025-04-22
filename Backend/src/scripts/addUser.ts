import { User } from "../models/user";
import Client from "../models/client";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db";
import { ensureDatabaseAndUser } from "../config/databaseFactory";
import Device from "../models/device";
import License from "../models/licensing";
import AccessToken from "../models/oauth/accessToken";
import RefreshToken from "../models/oauth/refreshToken";

const addUser = async () => {
  try {
    // Ensure database and user exist
    await ensureDatabaseAndUser();
    
    // Initialize all models
    User.initialize(sequelize);
    License.initialize(sequelize);
    Device.initialize(sequelize);
    Client.initialize(sequelize);
    AccessToken.initialize(sequelize);
    RefreshToken.initialize(sequelize);

    // Set up all associations
    User.associate();
    License.associate();
    Device.associate();
    Client.associate();
    AccessToken.associate();
    RefreshToken.associate();
    
    // Sync database
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");
    
    // Create user
    const email = "user@user.be";
    const password = "user";
    const firstName = "Test";
    const lastName = "User";
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(`User ${email} already exists.`);
      return;
    }
    
    // Create user
    const newUser = await User.create({
      userName: email,
      firstName,
      lastName,
      email,
      isAdmin: true,
      password,
      confirmationToken: null,
    });
    
    // Update user to confirm email
    await newUser.update({ emailConfirmed: true });
    
    console.log(`User created with ID: ${newUser.id}`);
    
    // Create OAuth client for the user
    const clientId = uuidv4();
    const clientSecret = uuidv4();
    const grants = ["password", "refresh_token"];
    
    const newClient = await Client.create({
      clientOauthId: clientId,
      clientSecret,
      grants,
      userId: newUser.id,
    });
    
    console.log(`OAuth client created with ID: ${newClient.clientOauthId}`);
    console.log(`Client secret: ${newClient.clientSecret}`);
    
    console.log("User and client created successfully.");
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the function
addUser(); 