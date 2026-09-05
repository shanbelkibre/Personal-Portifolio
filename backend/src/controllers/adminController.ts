import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PROJECTS
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        category: true,
        features: { orderBy: { orderIndex: "asc" } },
        technologies: { include: { technology: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const mapped = projects.map((p) => ({
      id: p.id, title: p.title, description: p.description,
      longDescription: p.longDescription, githubUrl: p.githubUrl,
      demoUrl: p.demoUrl, imageUrl: p.imageUrl, featured: p.featured,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      features: p.features.map((f) => f.description),
      technologies: p.technologies.map((t) => ({ id: t.technology.id, name: t.technology.name })),
    }));
    res.json({ success: true, projects: mapped });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

export const addProject = async (req: Request, res: Response) => {
  try {
    const { title, description, longDescription, githubUrl, demoUrl, imageUrl, categoryId, featured, features, technologyIds } = req.body;
    const project = await prisma.project.create({
      data: {
        title: title || "New Project", description: description || "",
        longDescription: longDescription || null, githubUrl: githubUrl || null,
        demoUrl: demoUrl || null, imageUrl: imageUrl || null,
        featured: featured ?? false, categoryId: categoryId || null,
        features: { create: (features || []).map((f: string, i: number) => ({ description: f, orderIndex: i })) },
        technologies: { create: (technologyIds || []).map((tId: string) => ({ technologyId: tId })) },
      },
      include: { category: true, features: { orderBy: { orderIndex: "asc" } }, technologies: { include: { technology: true } } },
    });
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ success: false, message: "Failed to add project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const { title, description, longDescription, githubUrl, demoUrl, imageUrl, categoryId, featured, features, technologyIds } = req.body;
    await prisma.project.update({ where: { id }, data: { title, description, longDescription, githubUrl, demoUrl, imageUrl, featured, categoryId: categoryId || null } });
    if (Array.isArray(features)) {
      await prisma.projectFeature.deleteMany({ where: { projectId: id } });
      if (features.length > 0) await prisma.projectFeature.createMany({ data: features.map((f: string, i: number) => ({ description: f, orderIndex: i, projectId: id })) });
    }
    if (Array.isArray(technologyIds)) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });
      if (technologyIds.length > 0) await prisma.projectTechnology.createMany({ data: technologyIds.map((tId: string) => ({ projectId: id, technologyId: tId })) });
    }
    const updated = await prisma.project.findUnique({ where: { id }, include: { category: true, features: { orderBy: { orderIndex: "asc" } }, technologies: { include: { technology: true } } } });
    res.json({ success: true, project: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: (req.params["id"] as string) } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};

// EXPERIENCES
export const getExperiences = async (_req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({
      include: { company: true, achievements: { orderBy: { orderIndex: "asc" } }, skills: { include: { technology: true } } },
      orderBy: { createdAt: "desc" },
    });
    const mapped = experiences.map((e) => ({
      id: e.id, role: e.role, company: e.company?.name || "",
      periodStart: e.periodStart, periodEnd: e.periodEnd, description: e.description,
      achievements: e.achievements.map((a) => a.description),
      skills: e.skills.map((s) => ({ id: s.technology.id, name: s.technology.name })),
    }));
    res.json({ success: true, experiences: mapped });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ success: false, message: "Failed to fetch experiences" });
  }
};

export const addExperience = async (req: Request, res: Response) => {
  try {
    const { role, company, periodStart, periodEnd, description, achievements, technologyIds } = req.body;
    const compRecord = company ? await prisma.company.upsert({ where: { name: company }, update: {}, create: { name: company } }) : null;
    const experience = await prisma.experience.create({
      data: {
        role: role || "New Role", periodStart: periodStart || "", periodEnd: periodEnd || "",
        description: description || "", companyId: compRecord?.id || null,
        achievements: { create: (achievements || []).map((a: string, i: number) => ({ description: a, orderIndex: i })) },
        skills: { create: (technologyIds || []).map((tId: string) => ({ technologyId: tId })) },
      },
      include: { company: true, achievements: { orderBy: { orderIndex: "asc" } }, skills: { include: { technology: true } } },
    });
    res.status(201).json({ success: true, experience });
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ success: false, message: "Failed to add experience" });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const { role, company, periodStart, periodEnd, description, achievements, technologyIds } = req.body;
    const compRecord = company ? await prisma.company.upsert({ where: { name: company }, update: {}, create: { name: company } }) : null;
    await prisma.experience.update({ where: { id }, data: { role, periodStart, periodEnd, description, companyId: compRecord?.id || null } });
    if (Array.isArray(achievements)) {
      await prisma.experienceAchievement.deleteMany({ where: { experienceId: id } });
      if (achievements.length > 0) await prisma.experienceAchievement.createMany({ data: achievements.map((a: string, i: number) => ({ description: a, orderIndex: i, experienceId: id })) });
    }
    if (Array.isArray(technologyIds)) {
      await prisma.experienceSkill.deleteMany({ where: { experienceId: id } });
      if (technologyIds.length > 0) await prisma.experienceSkill.createMany({ data: technologyIds.map((tId: string) => ({ experienceId: id, technologyId: tId })) });
    }
    const updated = await prisma.experience.findUnique({ where: { id }, include: { company: true, achievements: { orderBy: { orderIndex: "asc" } }, skills: { include: { technology: true } } } });
    res.json({ success: true, experience: updated });
  } catch (error) {
    console.error("Error updating experience:", error);
    res.status(500).json({ success: false, message: "Failed to update experience" });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    await prisma.experience.delete({ where: { id: (req.params["id"] as string) } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ success: false, message: "Failed to delete experience" });
  }
};

// CERTIFICATIONS
export const getCertifications = async (_req: Request, res: Response) => {
  try {
    const certifications = await prisma.certification.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch certifications" });
  }
};

export const addCertification = async (req: Request, res: Response) => {
  try {
    const { title, issuer, year } = req.body;
    const certification = await prisma.certification.create({ data: { title, issuer, year } });
    res.status(201).json({ success: true, certification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add certification" });
  }
};

export const updateCertification = async (req: Request, res: Response) => {
  try {
    const { title, issuer, year } = req.body;
    const certification = await prisma.certification.update({ where: { id: (req.params["id"] as string) }, data: { title, issuer, year } });
    res.json({ success: true, certification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update certification" });
  }
};

export const deleteCertification = async (req: Request, res: Response) => {
  try {
    await prisma.certification.delete({ where: { id: (req.params["id"] as string) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete certification" });
  }
};

// TECHNOLOGIES
export const getTechnologies = async (_req: Request, res: Response) => {
  try {
    const technologies = await prisma.technology.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { projects: true, experiences: true } } } });
    res.json({ success: true, technologies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch technologies" });
  }
};

export const addTechnology = async (req: Request, res: Response) => {
  try {
    const technology = await prisma.technology.create({ data: { name: req.body.name } });
    res.status(201).json({ success: true, technology });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add technology" });
  }
};

export const updateTechnology = async (req: Request, res: Response) => {
  try {
    const technology = await prisma.technology.update({ where: { id: (req.params["id"] as string) }, data: { name: req.body.name } });
    res.json({ success: true, technology });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update technology" });
  }
};

export const deleteTechnology = async (req: Request, res: Response) => {
  try {
    await prisma.technology.delete({ where: { id: (req.params["id"] as string) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete technology" });
  }
};

// CATEGORIES
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { projects: true } } } });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({ data: { name: req.body.name } });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.update({ where: { id: (req.params["id"] as string) }, data: { name: req.body.name } });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: (req.params["id"] as string) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
};

// SITE CONFIG
export const getSiteConfig = async (_req: Request, res: Response) => {
  try {
    const config = await prisma.siteConfig.findFirst({ include: { paragraphs: { orderBy: { orderIndex: "asc" } } } });
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch site config" });
  }
};

export const updateSiteConfig = async (req: Request, res: Response) => {
  try {
    const { hero, contact, theme, about } = req.body;
    let config = await prisma.siteConfig.findFirst();
    if (!config) config = await prisma.siteConfig.create({ data: {} });
    const dataToUpdate: Record<string, unknown> = {};
    if (hero) {
      if (hero.name !== undefined) dataToUpdate.heroName = hero.name;
      if (hero.badgeText !== undefined) dataToUpdate.heroBadge = hero.badgeText;
      if (hero.subtitle !== undefined) dataToUpdate.heroSubtitle = hero.subtitle;
      if (hero.bio !== undefined) dataToUpdate.heroBio = hero.bio;
      if (hero.githubUrl !== undefined) dataToUpdate.heroGithub = hero.githubUrl;
      if (hero.linkedinUrl !== undefined) dataToUpdate.heroLinkedin = hero.linkedinUrl;
    }
    if (contact) {
      if (contact.email !== undefined) dataToUpdate.contactEmail = contact.email;
      if (contact.phone !== undefined) dataToUpdate.contactPhone = contact.phone;
      if (contact.location !== undefined) dataToUpdate.contactLocation = contact.location;
    }
    if (theme?.colorTheme !== undefined) dataToUpdate.themeColor = theme.colorTheme;
    await prisma.siteConfig.update({ where: { id: config.id }, data: dataToUpdate });
    if (about && Array.isArray(about.paragraphs)) {
      await prisma.aboutParagraph.deleteMany({ where: { configId: config.id } });
      if (about.paragraphs.length > 0) {
        await prisma.aboutParagraph.createMany({ data: about.paragraphs.map((content: string, i: number) => ({ content, orderIndex: i, configId: config!.id })) });
      }
    }
    const updated = await prisma.siteConfig.findUnique({ where: { id: config.id }, include: { paragraphs: { orderBy: { orderIndex: "asc" } } } });
    res.json({ success: true, config: updated });
  } catch (error) {
    console.error("Error updating site config:", error);
    res.status(500).json({ success: false, message: "Failed to update site config" });
  }
};
