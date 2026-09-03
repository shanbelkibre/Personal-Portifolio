import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    // 1. Fetch site_config and about paragraphs
    const configResult = await pool.query('SELECT * FROM site_config LIMIT 1');
    const siteConfig = configResult.rows[0];

    let aboutData = { paragraphs: [] as string[] };
    let hero = null;
    let contact = null;
    let theme = null;

    if (siteConfig) {
      const paragraphsResult = await pool.query('SELECT content FROM about_paragraphs WHERE config_id = $1 ORDER BY order_index ASC', [siteConfig.id]);
      aboutData.paragraphs = paragraphsResult.rows.map((row: any) => row.content);

      hero = {
        name: siteConfig.hero_name,
        badgeText: siteConfig.hero_badge,
        subtitle: siteConfig.hero_subtitle,
        bio: siteConfig.hero_bio,
        githubUrl: siteConfig.hero_github,
        linkedinUrl: siteConfig.hero_linkedin,
        profileImage: siteConfig.hero_image,
      };

      contact = {
        email: siteConfig.contact_email,
        phone: siteConfig.contact_phone,
        location: siteConfig.contact_location,
      };

      theme = {
        colorTheme: siteConfig.theme_color,
      };
    }

    // 2. Fetch Projects (simplified for now without full mapping to technologies due to 3NF complexity)
    // To do it properly we would JOIN project_features, project_technologies, etc.
    const projectsResult = await pool.query('SELECT p.*, c.name as category_name FROM projects p LEFT JOIN categories c ON p.category_id = c.id');
    const projects = projectsResult.rows;

    // 3. Fetch Experiences
    const expResult = await pool.query('SELECT e.*, c.name as company_name FROM experiences e LEFT JOIN companies c ON e.company_id = c.id');
    const experiences = expResult.rows;

    // 4. Fetch Certifications
    const certResult = await pool.query('SELECT * FROM certifications');
    const certifications = certResult.rows;

    // We send back a nested JSON structure similar to what the frontend expects
    res.json({
      hero,
      about: aboutData,
      contact,
      theme,
      projects,
      experiences,
      certifications
    });

  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
