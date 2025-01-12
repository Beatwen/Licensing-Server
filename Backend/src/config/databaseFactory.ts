import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const ensureDatabaseAndUser = async (): Promise<void> => {
  const adminClient = new Client({
    user: "postgres", 
    host: process.env.DB_HOST || "localhost",
    password: process.env.POSTGRES_PASSWORD || "admin", // Mot de passe de l'utilisateur postgres
    port: Number(process.env.DB_PORT) || 5432,
  });

  try {
    await adminClient.connect();

    // Vérifie si l'utilisateur existe
    const userExists = await adminClient.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`,
      [process.env.DB_USER || "licensing_user"]
    );
    if (userExists.rowCount === 0) {
      console.log(`User ${process.env.DB_USER} does not exist. Creating...`);
      await adminClient.query(
        `CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD}';`
      );
      console.log(`User ${process.env.DB_USER} created.`);
    }

    // Vérifie si la base existe
    const dbExists = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [process.env.DB_NAME || "licensing_db"]
    );
    if (dbExists.rowCount === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database ${process.env.DB_NAME} created.`);
    }

    // Configurer le schéma et les permissions
    console.log("Configuring schema and permissions...");
    const appClient = new Client({
      user: "postgres", // Utilisateur admin pour cette étape
      host: process.env.DB_HOST || "localhost",
      password: process.env.POSTGRES_PASSWORD || "admin",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "licensing_db", // Connexion à la base
    });

    await appClient.connect();
    await appClient.query(`CREATE SCHEMA IF NOT EXISTS public;`);
    await appClient.query(
      `GRANT ALL PRIVILEGES ON SCHEMA public TO ${process.env.DB_USER};`
    );
    await appClient.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${process.env.DB_USER};`
    );
    console.log("Schema and permissions configured.");

    await appClient.end();
  } catch (error) {
    console.error("Error ensuring database and user exist:", error);
    throw error;
  } finally {
    await adminClient.end();
  }
};
