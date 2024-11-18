require('dotenv').config();

const { Sequelize, DataTypes } = require("sequelize");

// Connexion à PostgreSQL
const sequelize = new Sequelize("licensing_db", "licensing_user", "your_password", {
  host: "localhost",
  dialect: "postgres",
});

// Modèle User
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Modèle Licensing
const Licensing = sequelize.define("Licensing", {
  licenseKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

User.hasMany(Licensing, { foreignKey: "userId" });
Licensing.belongsTo(User, { foreignKey: "userId" });


const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");
    await sequelize.sync({ alter: true }); // Crée ou met à jour les tables
    console.log("Database synced!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, User, Licensing, initDb };
