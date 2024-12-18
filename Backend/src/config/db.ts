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
}

// Chargement des variables d'environnement
const config: DBConfig = {
  DB_NAME: process.env.DB_NAME || "licensing_db",
  DB_USER: process.env.DB_USER || "licensing_user",
  DB_PASSWORD: process.env.DB_PASSWORD || "password",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
};

// Fonction pour s'assurer que la base de données existe
const ensureDatabaseExists = async (): Promise<void> => {
  const client = new Client({
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
  });

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
  } finally {
    await client.end();
  }
};

// Initialisation de Sequelize
const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: "postgres",
    port: config.DB_PORT,
  }
);

// Exécute l'assurance de la base et exporte Sequelize
(async () => {
  await ensureDatabaseExists();
  console.log("Connected to PostgreSQL!");
})();

export default sequelize;

