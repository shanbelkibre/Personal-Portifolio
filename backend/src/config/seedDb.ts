import { pool } from './db';

const seedDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Seed Site Config
    console.log('Seeding site_config...');
    const siteConfigRes = await client.query(`
      INSERT INTO site_config (hero_name, hero_badge, hero_subtitle, hero_bio, hero_github, hero_linkedin, contact_email, contact_phone, contact_location, theme_color)
      VALUES (
        'Shanbel Kibre',
        'Available for freelance & full-stack roles',
        'Software Engineer & Full-Stack Developer',
        'Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity...',
        'https://github.com/shanbelkibre',
        'https://www.linkedin.com/in/shanbel-kibre/',
        'Shambel5110@gmail.com',
        '094 6340 709 / +251 962 585 655',
        'Addis Ababa & Debre Birhan, Ethiopia',
        'cyan'
      )
      RETURNING id;
    `);
    
    const configId = siteConfigRes.rows[0].id;

    // Seed About Paragraphs
    console.log('Seeding about_paragraphs...');
    const paragraphs = [
      "I am a Software Engineer and Full-Stack Developer...",
      "Fascinated by learning new technologies...",
      "Pursuing a Bachelor of Science in Software Engineering..."
    ];
    for (let i = 0; i < paragraphs.length; i++) {
      await client.query(
        'INSERT INTO about_paragraphs (config_id, content, order_index) VALUES ($1, $2, $3)',
        [configId, paragraphs[i], i]
      );
    }

    // Seed admin
    // Note: Use register endpoint or manual insert with bcrypt hash. Here we insert a default hash for 'admin123'
    console.log('Seeding default admin...');
    const defaultHash = '$2b$10$wT5gQW/QYJbX9/kQ8bJjQuQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ'; // Dummy hash, should be replaced via register endpoint
    await client.query(`
      INSERT INTO users (username, password_hash)
      VALUES ('admin', $1) ON CONFLICT DO NOTHING;
    `, [defaultHash]);

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default seedDb;
