import { Sequelize } from "sequelize";
import { Client } from "pg"; // Pour la gestion directe des bases
import dotenv from "dotenv";

dotenv.config();

// Définition des types pour les variables d'environnement
interface DBConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_SSL: boolean;
}

// Chargement des variables d'environnement
const config: DBConfig = {
  DB_NAME: process.env.DB_NAME || "licensing_db",
  DB_USER: process.env.DB_USER || "licensing_user",
  DB_PASSWORD: process.env.DB_PASSWORD || "password",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_SSL: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
};

// Fonction pour s'assurer que la base de données existe
const ensureDatabaseExists = async (): Promise<void> => {
  const clientConfig = {
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    // Activer SSL pour les environnements de production
    ssl: config.DB_SSL ? {
      rejectUnauthorized: false // Peut être mis à true si vous avez un certificat valide
    } : false
  };

  const client = new Client(clientConfig);

  try {
    await client.connect();

    // Vérifie si la base existe
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.DB_NAME]
    );

    if (res.rowCount === 0) {
      console.log(`Database ${config.DB_NAME} does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${config.DB_NAME}`);
      console.log(`Database ${config.DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${config.DB_NAME} already exists.`);
    }
  } catch (err) {
    console.error("Error ensuring database exists:", err);
    throw err; // Propager l'erreur pour gérer l'échec de connexion
  } finally {
    await client.end();
  }
};

// Initialisation de Sequelize avec la configuration adaptée
const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: "postgres",
    port: config.DB_PORT,
    logging: process.env.NODE_ENV !== 'production', // Désactiver les logs en production
    dialectOptions: config.DB_SSL ? {
      ssl: {
        require: true,
        rejectUnauthorized: false // Peut être mis à true si vous avez un certificat valide
      }
    } : {},
    pool: {
      max: 10, // Nombre maximum de connexions dans le pool
      min: 0,  // Nombre minimum de connexions dans le pool
      acquire: 30000, // Délai avant échec lors de l'acquisition d'une connexion (ms)
      idle: 10000 // Durée maximale d'inactivité d'une connexion (ms)
    }
  }
);

// Exécute l'assurance de la base et exporte Sequelize
(async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;

