import express from 'express';
import { UserController } from "../controllers/userController";
import { authenticate, isAdmin, isOwnerOrAdmin } from "../config/authServer";

const userRouter = express.Router();

// Routes protégées pour utilisateur normal
userRouter.get("/me", authenticate, UserController.getCurrentUser);
userRouter.post("/", UserController.createUser); 
userRouter.put("/:id", authenticate, isOwnerOrAdmin, UserController.updateUser);
userRouter.delete("/:id", authenticate, isOwnerOrAdmin, UserController.deleteUser);

// Routes protégées pour admin uniquement
userRouter.get("/", authenticate, isAdmin, UserController.getAllUsers);
userRouter.get("/:id", authenticate, isAdmin, UserController.getUserById);

export default userRouter;
