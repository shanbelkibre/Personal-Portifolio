import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getProjects, addProject, updateProject, deleteProject,
  getExperiences, addExperience, updateExperience, deleteExperience,
  getCertifications, addCertification, updateCertification, deleteCertification,
  getTechnologies, addTechnology, updateTechnology, deleteTechnology,
  getCategories, addCategory, updateCategory, deleteCategory,
  getSiteConfig, updateSiteConfig,
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require authentication
router.use(authenticateToken);

// Projects
router.get("/projects", getProjects);
router.post("/projects", addProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Experiences
router.get("/experiences", getExperiences);
router.post("/experiences", addExperience);
router.put("/experiences/:id", updateExperience);
router.delete("/experiences/:id", deleteExperience);

// Certifications
router.get("/certifications", getCertifications);
router.post("/certifications", addCertification);
router.put("/certifications/:id", updateCertification);
router.delete("/certifications/:id", deleteCertification);

// Technologies
router.get("/technologies", getTechnologies);
router.post("/technologies", addTechnology);
router.put("/technologies/:id", updateTechnology);
router.delete("/technologies/:id", deleteTechnology);

// Categories
router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Site Config
router.get("/site-config", getSiteConfig);
router.put("/site-config", updateSiteConfig);

export default router;
