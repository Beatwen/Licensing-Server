import sequelize from "./config/db";
import { ensureDatabaseAndUser } from "./config/databaseFactory";
import { runSeed } from "./seed/seed";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { User } from "./models/user";
import License from "./models/licensing";
import oauth, { authenticate } from "./config/authServer";
import cors from "cors";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import contactRouter from "./routes/contact";
import bodyParser from "body-parser";
import licenseRouter from "./routes/licenseRouter";
import Device from "./models/device";
import deviceRouter from "./routes/deviceRouter";
import Client from "./models/client";
import AccessToken from "./models/oauth/accessToken";
import RefreshToken from "./models/oauth/refreshToken";
import logRouter from "./routes/logRouter";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const startServer = async () => {
  try {
    // Vérification et configuration automatique
    await ensureDatabaseAndUser();

    // Appelle les méthodes `associate` pour configurer les relations
    // Initialize models
    User.initialize(sequelize);
    License.initialize(sequelize);
    Device.initialize(sequelize);
    Client.initialize(sequelize);
    AccessToken.initialize(sequelize);
    RefreshToken.initialize(sequelize);

    // Appelle les méthodes `associate` pour configurer les relations
    User.associate();
    License.associate();
    Device.associate();
    Client.associate();
    AccessToken.associate();
    RefreshToken.associate();

    // Synchronisation Sequelize
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");

    // Seeding des données
    // await runSeed();

    // Initialisation du serveur Express
    const app = express();
    
    // Configuration de la sécurité
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    }));

    // Configuration du rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limite chaque IP à 100 requêtes par fenêtre
      message: "Too many requests from this IP, please try again later."
    });
    app.use(limiter);

    // Configuration des cookies
    app.use(cookieParser());
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.cookie('session', 'value', {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000 // 1 heure
      });
      next();
    });
    
    app.use(cors({
      origin: [
        'https://licensing.noobastudio.be',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-KEY',
        'X-USER-KEY',
        'access_token',
        'authorization'
      ]
    }));
    
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    function validateApiKey(req: Request, res: Response, next: NextFunction): void {
      // Skip API key validation for logs endpoint
      if (req.path.startsWith("/logs")) {
        return next();
      }
      
      // Skip API key validation for email confirmation
      if (req.path.startsWith("/auth/confirm-email")) {
        return next(); 
      }

      // Skip API key validation for contact endpoint
      if (req.path.startsWith("/contact")) {
        return next();
      }

      const apiKey = req.headers['x-api-key'];

      if (!apiKey || apiKey !== process.env.API_KEY) {
          res.status(403).json({ error: "Invalid API key." });
          return;
      }

      next();
    }

    // Utilisation dans Express
    app.use(validateApiKey);

    // Montage des routeurs
    app.use("/auth", authRouter);
    app.use("/users", authenticate, userRouter);
    app.use("/licenses", authenticate, licenseRouter);
    app.use("/devices", authenticate, deviceRouter);
    app.use("/contact", contactRouter);
    app.use("/logs", logRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();



