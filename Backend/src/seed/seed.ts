import {User} from "../models/user";
import License from "../models/licensing";
import sequelize from "../config/db";

export const seedUsers = async () => {
    console.log("Seeding users...");
  
    const users = [
      {
        userName: "alice@example.com",
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        password: "password123",
      },
      {
        userName: "bob@example.com",
        firstName: "Bob",
        lastName: "Builder",
        email: "bob@example.com",
        password: "password123",
      },
      {
        userName: "charlie@example.com",
        firstName: "Charlie",
        lastName: "Chocolate",
        email: "charlie@example.com",
        password: "password123",
      },
    ];
  
    for (const user of users) {
      await User.create(user);
    }
    console.log("Users seeded.");
  };
  

export const seedLicenses = async () => {
  console.log("Seeding licenses...");
  const licenses = [
    { type: "Standard", userId: 1, licenseKey: "123456", status: "active" },
    { type: "Premium", userId: 2, licenseKey: "abcdef", status: "active" },
    { type: "Enterprise", userId: 3, licenseKey: "qwerty", status: "active" },
  ];

  for (const license of licenses) {
    await License.create(license);
  }
  console.log("Licenses seeded.");
};

export const runSeed = async () => {
    try {
  
      // Drop all tables
      await sequelize.sync({ force: true }); // This will drop and recreate all tables
  
      console.log("Tables dropped and recreated.");
  
      // Seed users and licenses
      await seedUsers();
      await seedLicenses();
  
      console.log("Seeding completed.");
    } catch (error) {
      console.error("Error during seeding:", error);
    }
  };
  
