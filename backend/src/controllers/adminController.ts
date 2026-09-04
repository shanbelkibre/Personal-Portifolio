import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PROJECTS
export const addProject = async (req: Request, res: Response) => {
  try {
    const { title, description, longDescription, github, demo, image, category, featured, features, tech } = req.body;
    
    // Simplification for the demo: We create a dummy category if it doesn't exist.
    // In a full app, you might want to manage categories separately.
    let catRecord = category ? await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category }
    }) : null;

    const project = await prisma.project.create({
      data: {
        title: title || 'New Project',
        description: description || '',
        longDescription,
        githubUrl: github,
        demoUrl: demo,
        imageUrl: image,
        featured: featured || false,
        categoryId: catRecord?.id,
        // Insert features
        features: {
          create: (features || []).map((f: string, i: number) => ({ description: f, orderIndex: i }))
        },
      }
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ success: false, message: 'Failed to add project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, longDescription, github, demo, image, category, featured } = req.body;
    
    let catRecord = category ? await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category }
    }) : null;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        longDescription,
        githubUrl: github,
        demoUrl: demo,
        imageUrl: image,
        featured,
        categoryId: catRecord?.id,
      }
    });

    res.json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// EXPERIENCES
export const addExperience = async (req: Request, res: Response) => {
  try {
    const { role, company, period, description, achievements } = req.body;
    
    // Parse period (very basic)
    const [start, end] = (period || ' - ').split(' - ');

    let compRecord = company ? await prisma.company.upsert({
      where: { name: company },
      update: {},
      create: { name: company }
    }) : null;

    const experience = await prisma.experience.create({
      data: {
        role: role || 'New Role',
        periodStart: start || 'Start',
        periodEnd: end || 'End',
        description: description || '',
        companyId: compRecord?.id,
        achievements: {
          create: (achievements || []).map((a: string, i: number) => ({ description: a, orderIndex: i }))
        }
      }
    });

    res.status(201).json({ success: true, experience });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ success: false, message: 'Failed to add experience' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, company, period, description } = req.body;
    
    const [start, end] = (period || ' - ').split(' - ');

    let compRecord = company ? await prisma.company.upsert({
      where: { name: company },
      update: {},
      create: { name: company }
    }) : null;

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        role,
        periodStart: start,
        periodEnd: end,
        description,
        companyId: compRecord?.id,
      }
    });

    res.json({ success: true, experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ success: false, message: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ success: false, message: 'Failed to delete experience' });
  }
};

// SITE CONFIG (Hero, Contact, Theme, About)
export const updateSiteConfig = async (req: Request, res: Response) => {
  try {
    const { hero, contact, theme, about } = req.body;
    
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: {} });
    }

    const dataToUpdate: any = {};
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
    if (theme && theme.colorTheme !== undefined) {
      dataToUpdate.themeColor = theme.colorTheme;
    }

    await prisma.siteConfig.update({
      where: { id: config.id },
      data: dataToUpdate
    });

    // Handle About Paragraphs separately (clear and recreate for simplicity)
    if (about && Array.isArray(about.paragraphs)) {
      await prisma.aboutParagraph.deleteMany({ where: { configId: config.id } });
      await prisma.siteConfig.update({
        where: { id: config.id },
        data: {
          paragraphs: {
            create: about.paragraphs.map((content: string, i: number) => ({ content, orderIndex: i }))
          }
        }
      });
    }

    res.json({ success: true, message: 'Site config updated' });
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(500).json({ success: false, message: 'Failed to update site config' });
  }
};
