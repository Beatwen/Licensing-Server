import sequelize from "./config/db";
import userRouter from "./routes/userRouter";
import express from "express";
import User from "./models/user";
import License, { defineRelations } from "./models/licensing";
import cors from "cors";

// Initialisation des modèles
User.initialize(sequelize);
License.initialize(sequelize);

// Définir les relations
defineRelations();

// Synchroniser la base
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synchronized");
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

