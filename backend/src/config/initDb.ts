import { pool } from './db';

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Enable pgcrypto for UUID generation if not enabled
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    console.log('Creating technologies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS technologies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    console.log('Creating companies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    console.log('Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        github_url VARCHAR(255),
        demo_url VARCHAR(255),
        image_url VARCHAR(255),
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating project_features table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_features (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        order_index INT DEFAULT 0
      );
    `);

    console.log('Creating project_technologies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_technologies (
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, technology_id)
      );
    `);

    console.log('Creating experiences table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role VARCHAR(255) NOT NULL,
        company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
        period_start VARCHAR(50) NOT NULL,
        period_end VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating experience_achievements table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS experience_achievements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        order_index INT DEFAULT 0
      );
    `);

    console.log('Creating experience_skills table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS experience_skills (
        experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
        technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
        PRIMARY KEY (experience_id, technology_id)
      );
    `);

    console.log('Creating certifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        year VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating site_config table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        hero_name VARCHAR(255),
        hero_badge VARCHAR(255),
        hero_subtitle VARCHAR(255),
        hero_bio TEXT,
        hero_github VARCHAR(255),
        hero_linkedin VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(255),
        contact_location VARCHAR(255),
        theme_color VARCHAR(50)
      );
    `);

    console.log('Creating about_paragraphs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS about_paragraphs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        config_id UUID REFERENCES site_config(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        order_index INT DEFAULT 0
      );
    `);

    await client.query('COMMIT');
    console.log('Database initialization completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

if (require.main === module) {
  initDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default initDb;
