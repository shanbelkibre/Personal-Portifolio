import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Prisma...');

  // Upsert the Admin user
  const passwordHash = await bcrypt.hash('Sha2030P@#', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'shanboman' },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      username: 'shanboman',
      passwordHash: passwordHash,
    },
  });

  // Clear existing SiteConfig and paragraphs to apply the new text
  await prisma.aboutParagraph.deleteMany({});
  await prisma.siteConfig.deleteMany({});

  const siteConfig = await prisma.siteConfig.create({
    data: {
      heroName: 'Shanbel Kibre',
      heroBadge: 'Available for freelance & full-stack roles',
      heroSubtitle: 'Software Engineer & Full-Stack Developer',
      heroBio: 'Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing. Skilled at building robust, scalable applications while identifying and resolving security vulnerabilities.',
      heroGithub: 'https://github.com/shanbelkibre',
      heroLinkedin: 'https://www.linkedin.com/in/shanbel-kibre/',
      contactEmail: 'Shambel5110@gmail.com',
      contactPhone: '094 6340 709 / +251 962 585 655',
      contactLocation: 'Addis Ababa & Debre Birhan, Ethiopia',
      themeColor: 'cyan',
      paragraphs: {
        create: [
          { content: 'I am a Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing. Skilled at building robust, scalable applications while identifying and resolving security vulnerabilities to safeguard systems.', orderIndex: 0 },
          { content: 'Fascinated by learning new technologies and passionate about solving complex problems through innovative, practical solutions. I specialize in React, Next.js, Node.js, Express, NestJS, Laravel, MongoDB, MySQL, and PostgreSQL.', orderIndex: 1 },
          { content: 'Pursuing a Bachelor of Science in Software Engineering (Harmonized Modular Curriculum) at Debre Birhan University. Recognized as 3rd Place Winner in DBU Hackathon and participant in INSA Talent Summer Camp.', orderIndex: 2 }
        ]
      }
    }
  });

  // Basic categories
  const webAppCategory = await prisma.category.upsert({ where: { name: 'Full-Stack Web App' }, update: {}, create: { name: 'Full-Stack Web App' } });
  const webPlatformCategory = await prisma.category.upsert({ where: { name: 'Web Platform' }, update: {}, create: { name: 'Web Platform' } });
  const uiCategory = await prisma.category.upsert({ where: { name: 'Frontend UI' }, update: {}, create: { name: 'Frontend UI' } });

  // Technologies
  const techNames = ["Laravel", "React", "MySQL", "Tailwind CSS", "Sanctum", "REST API", "HTML5", "CSS3", "JavaScript (ES6)", "LocalStorage API", "TypeScript", "Vite", "shadcn/ui", "Framer Motion", "Node.js", "Express.js", "MongoDB", "PHP", "Bootstrap"];
  const techs: Record<string, any> = {};
  for (const name of techNames) {
    techs[name] = await prisma.technology.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Clear existing projects/experiences/certifications for clean seed (Optional, but good for resetting to static defaults)
  await prisma.project.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.certification.deleteMany({});

  // ------------------------------------
  // PROJECTS
  // ------------------------------------
  await prisma.project.create({
    data: {
      title: 'Ethiopian House Rental System (INSA Summer Camp Project)',
      description: 'A full-stack property rental platform with property listings, search, filtering, role-based authentication, and owner/renter communication features.',
      longDescription: 'Developed during the INSA Summer Camp, this full-stack property rental platform connects house owners and renters. It features role-based access for owners, renters/buyers, and administrators, along with robust RESTful APIs, database architecture, and responsive frontend interfaces.',
      githubUrl: 'https://github.com/shanbelkibre/house_rental_system',
      demoUrl: 'https://house-rental-system-ten.vercel.app/',
      featured: true,
      categoryId: webAppCategory.id,
      features: {
        create: [
          { description: 'Property listing, search, filtering, and favorites', orderIndex: 0 },
          { description: 'Role-based access for owners, renters/buyers, and administrators', orderIndex: 1 },
          { description: 'RESTful APIs and custom database architecture', orderIndex: 2 },
          { description: 'Real-time owner and renter communication workflows', orderIndex: 3 }
        ]
      },
      technologies: {
        create: [
          { technologyId: techs["Laravel"].id },
          { technologyId: techs["React"].id },
          { technologyId: techs["MySQL"].id },
          { technologyId: techs["Tailwind CSS"].id },
          { technologyId: techs["Sanctum"].id },
          { technologyId: techs["REST API"].id }
        ]
      }
    }
  });

  await prisma.project.create({
    data: {
      title: 'Ethio Internship Platform (DBU Hackathon 3rd Place Winner)',
      description: 'A hackathon-winning internship platform connecting students, companies, and universities for internship opportunities.',
      longDescription: 'Engineered during the 2017 E.C. Debre Birhan University Hackathon (3rd Place Winner), Ethio Internship solves the internship gap in Ethiopian higher education with profile management, internship posting, applications, and tracking.',
      githubUrl: 'https://github.com/shambelkibr/EthioInterShip_platform_DBU_Hackton',
      demoUrl: 'https://ethio-inter-ship-platform.vercel.app/',
      featured: true,
      categoryId: webPlatformCategory.id,
      features: {
        create: [
          { description: '3-Way portal for students, partner companies, and university admins', orderIndex: 0 },
          { description: 'Internship posting, application submissions, and status tracking', orderIndex: 1 },
          { description: 'Smart search and filtering across internship opportunities', orderIndex: 2 },
          { description: 'Local storage sync & progressive web capabilities', orderIndex: 3 }
        ]
      },
      technologies: {
        create: [
          { technologyId: techs["HTML5"].id },
          { technologyId: techs["CSS3"].id },
          { technologyId: techs["JavaScript (ES6)"].id },
          { technologyId: techs["LocalStorage API"].id },
          { technologyId: techs["Tailwind CSS"].id }
        ]
      }
    }
  });


  // ------------------------------------
  // EXPERIENCES (Chronological: 2024 -> 2026)
  // ------------------------------------
  const compClearance = await prisma.company.upsert({ where: { name: 'Debre Birhan University Clearance Management System (2nd Year Final Project)' }, update: {}, create: { name: 'Debre Birhan University Clearance Management System (2nd Year Final Project)' } });
  const compHack = await prisma.company.upsert({ where: { name: 'Ethio Internship Platform (DBU Hackathon 3rd Winner)' }, update: {}, create: { name: 'Ethio Internship Platform (DBU Hackathon 3rd Winner)' } });
  const compEcc = await prisma.company.upsert({ where: { name: 'Debre Birhan Town E-Commerce Platform (Internship Project)' }, update: {}, create: { name: 'Debre Birhan Town E-Commerce Platform (Internship Project)' } });
  const compInsa = await prisma.company.upsert({ where: { name: 'Ethiopian House Rental System (INSA Summer Camp Project)' }, update: {}, create: { name: 'Ethiopian House Rental System (INSA Summer Camp Project)' } });

  await prisma.experience.create({
    data: {
      role: 'Full Stack Developer',
      companyId: compClearance.id,
      periodStart: '2024',
      periodEnd: '2025',
      description: 'Developed a digital clearance workflow connecting students, university departments, and administrators.',
      achievements: {
        create: [
          { description: 'Developed a digital clearance workflow connecting students, university departments, and administrators.', orderIndex: 0 },
          { description: 'Implemented role-based approval, clearance tracking, dashboards, and status management to reduce manual processes.', orderIndex: 1 }
        ]
      },
      skills: {
        create: [
          { technologyId: techs["PHP"].id },
          { technologyId: techs["MySQL"].id },
          { technologyId: techs["JavaScript (ES6)"].id },
          { technologyId: techs["HTML5"].id },
          { technologyId: techs["Bootstrap"].id }
        ]
      }
    }
  });

  await prisma.experience.create({
    data: {
      role: 'Full Stack Developer',
      companyId: compHack.id,
      periodStart: '2024',
      periodEnd: '2025',
      description: 'Built a platform connecting university students, universities, and companies for internship opportunities.',
      achievements: {
        create: [
          { description: 'Built a platform connecting university students, universities, and companies for internship opportunities.', orderIndex: 0 },
          { description: 'Implemented profiles, internship postings, applications, search/filtering, and application tracking.', orderIndex: 1 }
        ]
      },
      skills: {
        create: [
          { technologyId: techs["JavaScript (ES6)"].id },
          { technologyId: techs["HTML5"].id },
          { technologyId: techs["CSS3"].id },
          { technologyId: techs["LocalStorage API"].id }
        ]
      }
    }
  });

  await prisma.experience.create({
    data: {
      role: 'Full Stack Developer',
      companyId: compEcc.id,
      periodStart: '2025',
      periodEnd: '2025',
      description: 'Built an e-commerce platform supporting product management, search, shopping cart, orders, and authentication.',
      achievements: {
        create: [
          { description: 'Built an e-commerce platform supporting product management, search, shopping cart, orders, authentication, and administration.', orderIndex: 0 },
          { description: 'Developed responsive interfaces and backend APIs for managing users, products, categories, and orders.', orderIndex: 1 }
        ]
      },
      skills: {
        create: [
          { technologyId: techs["React"].id },
          { technologyId: techs["Node.js"].id },
          { technologyId: techs["Express.js"].id },
          { technologyId: techs["MongoDB"].id },
          { technologyId: techs["REST API"].id }
        ]
      }
    }
  });

  await prisma.experience.create({
    data: {
      role: 'Full Stack Developer',
      companyId: compInsa.id,
      periodStart: '2025',
      periodEnd: '2026',
      description: 'Developed a full-stack property rental platform connecting house owners and renters in Debre Birhan town.',
      achievements: {
        create: [
          { description: 'Developed a property rental platform with property listing, search, filtering, authentication, and communication features.', orderIndex: 0 },
          { description: 'Implemented role-based access for property owners, renters/buyers, and administrators.', orderIndex: 1 },
          { description: 'Designed RESTful APIs, database architecture, and responsive frontend interfaces.', orderIndex: 2 }
        ]
      },
      skills: {
        create: [
          { technologyId: techs["Laravel"].id },
          { technologyId: techs["React"].id },
          { technologyId: techs["MySQL"].id },
          { technologyId: techs["REST API"].id },
          { technologyId: techs["Tailwind CSS"].id }
        ]
      }
    }
  });

  // ------------------------------------
  // CERTIFICATIONS
  // ------------------------------------
  await prisma.certification.createMany({
    data: [
      { title: 'Cyber Security Student – GTST, Round 14', issuer: 'Global Talent Security Training (GTST)', year: '2025' },
      { title: 'INSA Talent Summer Camp Student – 5th Round (Addis Ababa Science and Technology University)', issuer: 'Information Network Security Administration (INSA) & AASTU', year: '2025 - 2026' },
      { title: 'DBU Hackathon, 2017 E.C. – 3rd Place, Innovation and Creativity', issuer: 'Debre Birhan University', year: '2024 - 2025' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
