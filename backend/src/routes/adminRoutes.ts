import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  addProject,
  updateProject,
  deleteProject,
  addExperience,
  updateExperience,
  deleteExperience,
  updateSiteConfig
} from '../controllers/adminController';

const router = Router();

// Protect all admin routes with JWT
router.use(authenticateToken);

// Projects
router.post('/projects', addProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Experiences
router.post('/experiences', addExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);

// Site Config (Hero, About, Contact, Theme)
router.put('/site-config', updateSiteConfig);

export default router;
