import { Request, Response } from "express";
import User from "../models/user";

// Créer un utilisateur
export const createUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Received body:", req.body); // Log du corps reçu
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
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
  const { name, email, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.update({ name, email, password });
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
    if (user) {
      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const UserController = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };