import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    // 1. Fetch site_config and about paragraphs
    const siteConfig = await prisma.siteConfig.findFirst({
      include: {
        paragraphs: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    let aboutData = { paragraphs: [] as string[] };
    let hero = null;
    let contact = null;
    let theme = null;

    if (siteConfig) {
      aboutData.paragraphs = siteConfig.paragraphs.map(p => p.content);

      hero = {
        name: siteConfig.heroName,
        badgeText: siteConfig.heroBadge,
        subtitle: siteConfig.heroSubtitle,
        bio: siteConfig.heroBio,
        githubUrl: siteConfig.heroGithub,
        linkedinUrl: siteConfig.heroLinkedin,
      };

      contact = {
        email: siteConfig.contactEmail,
        phone: siteConfig.contactPhone,
        location: siteConfig.contactLocation,
      };

      theme = {
        colorTheme: siteConfig.themeColor,
      };
    }

    // 2. Fetch Projects
    const projects = await prisma.project.findMany({
      include: {
        category: true,
        features: {
          orderBy: { orderIndex: 'asc' }
        },
        technologies: {
          include: {
            technology: true
          }
        }
      }
    });

    // 3. Fetch Experiences
    const experiences = await prisma.experience.findMany({
      include: {
        company: true,
        achievements: {
          orderBy: { orderIndex: 'asc' }
        },
        skills: {
          include: {
            technology: true
          }
        }
      }
    });

    // 4. Fetch Certifications
    const certifications = await prisma.certification.findMany();

    // Mapping prisma objects to the flat structure expected by the frontend
    const mappedProjects = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      github: p.githubUrl,
      demo: p.demoUrl,
      image: p.imageUrl,
      category: p.category?.name,
      featured: p.featured,
      features: p.features.map(f => f.description),
      tech: p.technologies.map(t => t.technology.name)
    }));

    const mappedExperiences = experiences.map(e => {
      const s = e.periodStart?.trim();
      const end = e.periodEnd?.trim();
      let period = "";
      if (s && end) {
        period = s === end ? s : `${s} – ${end}`;
      } else {
        period = s || end || "";
      }
      return {
        id: e.id,
        role: e.role,
        company: e.company?.name,
        period,
        description: e.description,
        achievements: e.achievements.map(a => a.description),
        skills: e.skills.map(s => s.technology.name)
      };
    });

    // We send back a nested JSON structure similar to what the frontend expects
    res.json({
      hero,
      about: aboutData,
      contact,
      theme,
      projects: mappedProjects,
      experiences: mappedExperiences,
      certifications
    });

  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
