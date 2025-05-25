import { Router, Request, Response } from 'express';
import { sendContactEmail, sendContactConfirmationEmail, ContactEmailData } from '../utils/emailUtils';

const contactRouter = Router();

// POST /api/contact - Envoyer un message de contact
contactRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, company, subject, message }: ContactEmailData = req.body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      res.status(400).json({ 
        message: 'Tous les champs obligatoires doivent être remplis' 
      });
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        message: 'Adresse email invalide' 
      });
      return;
    }

    const contactData: ContactEmailData = {
      name,
      email,
      company,
      subject,
      message
    };

    // Envoyer les emails
    await sendContactEmail(contactData);
    await sendContactConfirmationEmail(contactData);

    res.status(200).json({ 
      message: 'Message envoyé avec succès',
      success: true 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de contact:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur lors de l\'envoi du message',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default contactRouter; 