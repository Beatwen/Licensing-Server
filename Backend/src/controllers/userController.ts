import { Request, Response } from "express";
import { User } from "../models/user";
import License from "../models/licensing";
import { generateConfirmationToken } from "../utils/tokenUtils";
import { sendConfirmationEmail } from "../utils/emailUtils";
import { createFreeLicense } from "./licenseController";


export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { userName, firstName, lastName, email, password } = req.body;
  try {
    
    const confirmationToken = generateConfirmationToken();
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await User.create({
      userName: userName || email,
      firstName,
      lastName,
      email,
      password,
      confirmationToken,

    });
    const freeLicense = await createFreeLicense(user.id);

    await sendConfirmationEmail(email, confirmationToken, freeLicense);
    console.log("message sent");

    res.status(201).json({
      message: "User created successfully",
      user,
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
  const { lastName, firstName,userName, email, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.update({ lastName, firstName,userName, email, password });
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