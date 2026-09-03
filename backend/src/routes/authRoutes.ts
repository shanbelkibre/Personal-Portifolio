import { Router } from 'express';
import { login, registerAdmin } from '../controllers/authController';
import { body } from 'express-validator';

const router = Router();

// Validation middleware to prevent basic SQL/XSS injections on auth routes
const authValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', authValidation, login);
router.post('/register', authValidation, registerAdmin); // Ideally this is secured or removed after first run

export default router;
