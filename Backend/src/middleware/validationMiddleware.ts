import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const registrationValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false, gmail_convert_googlemaildotcom: false })
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[a-z]/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule')
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule'),
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis')
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false, gmail_convert_googlemaildotcom: false })
    .withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

export const licenseValidation: ValidationChain[] = [
  body('licenseType').isIn(['free', 'standard', 'premium', 'enterprise'])
    .withMessage('Type de licence invalide'),
  body('userId').isInt().withMessage('ID utilisateur invalide')
]; 