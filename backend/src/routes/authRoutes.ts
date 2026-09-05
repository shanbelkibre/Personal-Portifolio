import { Router } from 'express';
import { login, registerAdmin, getMe } from '../controllers/authController.js';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

const authValidation = [
  body('username').trim().notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', authValidation, login);
router.post('/register', authValidation, registerAdmin);

// Get current user info (requires auth)
router.get('/me', authenticateToken, getMe);

// Logout (client clears token; server just confirms)
router.post('/logout', authenticateToken, (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
