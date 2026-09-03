import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Prisma...');

  // Upsert the Admin user
  const passwordHash = await bcrypt.hash('Sha2030P@#', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'shanboman' },
    update: {},
    create: {
      username: 'shanboman',
      passwordHash: passwordHash,
    },
  });


  // Upsert Site Config
  let siteConfig = await prisma.siteConfig.findFirst();
  if (!siteConfig) {
    siteConfig = await prisma.siteConfig.create({
      data: {
        heroName: 'Shanbel Kibre',
        heroBadge: 'Available for freelance & full-stack roles',
        heroSubtitle: 'Software Engineer & Full-Stack Developer',
        heroBio: 'Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing...',
        heroGithub: 'https://github.com/shanbelkibre',
        heroLinkedin: 'https://www.linkedin.com/in/shanbel-kibre/',
        contactEmail: 'Shambel5110@gmail.com',
        contactPhone: '094 6340 709 / +251 962 585 655',
        contactLocation: 'Addis Ababa & Debre Birhan, Ethiopia',
        themeColor: 'cyan',
        paragraphs: {
          create: [
            { content: 'I am a Software Engineer and Full-Stack Developer...', orderIndex: 0 },
            { content: 'Fascinated by learning new technologies...', orderIndex: 1 },
            { content: 'Pursuing a Bachelor of Science in Software Engineering...', orderIndex: 2 }
          ]
        }
      }
    });

  }

  // Create basic categories
  const webAppCategory = await prisma.category.upsert({
    where: { name: 'Full-Stack Web App' },
    update: {},
    create: { name: 'Full-Stack Web App' },
  });

  const uiCategory = await prisma.category.upsert({
    where: { name: 'Frontend UI' },
    update: {},
    create: { name: 'Frontend UI' },
  });

  // Create technologies
  const reactTech = await prisma.technology.upsert({ where: { name: 'React' }, update: {}, create: { name: 'React' } });
  const tailwindTech = await prisma.technology.upsert({ where: { name: 'Tailwind CSS' }, update: {}, create: { name: 'Tailwind CSS' } });

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      title: 'Ethiopian House Rental System',
      description: 'A full-stack property rental platform.',
      githubUrl: 'https://github.com/shanbelkibre/house_rental_system',
      featured: true,
      categoryId: webAppCategory.id,
      features: {
        create: [
          { description: 'Property listing, search, filtering', orderIndex: 0 }
        ]
      },
      technologies: {
        create: [
          { technologyId: reactTech.id },
          { technologyId: tailwindTech.id }
        ]
      }
    }
  });


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
