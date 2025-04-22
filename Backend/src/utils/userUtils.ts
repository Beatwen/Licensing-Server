import { User } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendConfirmationEmail } from "./emailUtils"; // Assurez-vous d'importer la fonction d'envoi d'email
import { createFreeLicense } from "../controllers/licenseController"; // Assurez-vous d'importer la fonction de création de licence

export const createUserUtil = async (userName: string, firstName: string, lastName: string, email: string, password: string) => {
  const confirmationToken = uuidv4();
  const newUser = await User.create({
    userName: userName || email,
    firstName,
    lastName,
    email,
    password: password,
    confirmationToken,
    isAdmin: false,
  });

  // Créez une licence gratuite pour l'utilisateur
  const freeLicense = await createFreeLicense(newUser.id);

  // Envoyez un email de confirmation
  await sendConfirmationEmail(email, confirmationToken, freeLicense);

  return newUser;
};