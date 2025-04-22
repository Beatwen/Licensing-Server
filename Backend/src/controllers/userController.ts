import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/custom";
import { User } from "../models/user";
import License from "../models/licensing";
import { generateConfirmationToken } from "../utils/tokenUtils";
import { sendConfirmationEmail } from "../utils/emailUtils";
import { createFreeLicense } from "./licenseController";
import { createUserUtil } from "../utils/userUtils";
import bcrypt from "bcrypt";


export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { userName, firstName, lastName, email, password } = req.body;
  try {
    // Utilisez la fonction utilitaire pour créer l'utilisateur
    const newUser = await createUserUtil(userName, firstName, lastName, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
    console.log("User created successfully");
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
// Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      include: { model: License, as: "licenses" }, // Include licenses in the query
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: { model: License, as: "licenses" }, // Include licenses in the query
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { lastName, firstName,userName, email, newPassword, currentPassword } = req.body;
  
  console.log("req.body", req.body);
  try {
    const user = await User.findByPk(id);
    if (user) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
      }
      await user.update({ lastName, firstName,userName, email });
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    const password = req.body.password;
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        await user.destroy();
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const UserController = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getCurrentUser,
  };