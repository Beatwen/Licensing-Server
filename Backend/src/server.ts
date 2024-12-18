import sequelize from "./config/db";
import { ensureDatabaseAndUser } from "./config/databaseFactory";
import { runSeed } from "./seed/seed"; // Importer les seeds
import express from "express";
import { Request, Response, NextFunction } from "express";
import {User} from "./models/user";
import License from "./models/licensing";
import cors from "cors";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import bodyParser from "body-parser";
import licenseRouter from "./routes/licenseRouter";
import Device from "./models/device";
import deviceRouter from "./routes/deviceRouter";


const startServer = async () => {
  try {
    // Vérification et configuration automatique
    await ensureDatabaseAndUser();

    // Appelle les méthodes `associate` pour configurer les relations
    User.initialize(sequelize);
    License.initialize(sequelize);
    Device.initialize(sequelize);
    
    User.associate();
    License.associate();
    Device.associate();
    
    

    // Synchronisation Sequelize
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");

    // Seeding des données
    // await runSeed();

    // Initialisation du serveur Express
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    function validateApiKey(req: Request, res: Response, next: NextFunction): void {
      const apiKey = req.headers['x-api-key'];

      if (req.path.startsWith("/auth/confirm-email")) {
        console.log("go to next");
        return next(); 
        
      }

      if (!apiKey || apiKey !== process.env.API_KEY) {
          res.status(403).json({ error: "Clé API invalide." });
          return;
      }

      next();
    }

    // Utilisation dans Express
    app.use(validateApiKey);

    // Montage des routeurs
    app.use("/users", userRouter);
    app.use("/licenses", licenseRouter);
    app.use("/auth", authRouter);
    app.use("/devices", deviceRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();



