import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { CookieOptions } from 'express';

// Configuration de Helmet pour la sécurité des en-têtes HTTP
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  hsts: {
    maxAge: 15552000,  // 180 jours
    includeSubDomains: true,
    preload: true
  }
});

// Configuration du rate limiter pour prévenir les attaques par force brute
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP pendant la période
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter plus restrictif pour les routes d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives par IP pendant la période
  message: 'Trop de tentatives d\'authentification, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware pour la validation des entrées de l'authentification
export const validateAuth = {
  login: [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  ],
  register: [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'),
    body('firstName').notEmpty().withMessage('Le prénom est requis'),
    body('lastName').notEmpty().withMessage('Le nom est requis'),
  ],
};

// Middleware pour valider les résultats
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Middleware pour les cookies sécurisés
export const secureCookies = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function(...args) {
    if (res.getHeader('Set-Cookie')) {
      const cookies = res.getHeader('Set-Cookie');
      const securedCookies = Array.isArray(cookies) 
        ? cookies.map(cookie => cookie + '; HttpOnly; Secure; SameSite=Strict')
        : [cookies + '; HttpOnly; Secure; SameSite=Strict'];
      res.setHeader('Set-Cookie', securedCookies);
    }
    return originalSend.apply(res, args);
  };
  next();
}; 