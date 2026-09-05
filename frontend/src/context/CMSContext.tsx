import React, { createContext, useContext, useState, useEffect } from "react";

import houseRental from "@/assets/houserntal.jpg";
import ethioIntern from "@/assets/Ethiointern.jpg";
import portfolio from "@/assets/portifolio.jpg";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  problemStatement?: string;
  solution?: string;
  features?: string[];
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
  category?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface HeroData {
  name: string;
  badgeText: string;
  subtitle: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImage?: string;
}

export interface AboutData {
  paragraphs: string[];
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export type ThemePreset = "cyan" | "emerald" | "violet" | "amber" | "blue";

export interface ThemeConfig {
  colorTheme: ThemePreset;
}

interface CMSContextType {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (v: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;

  projects: Project[];
  experiences: ExperienceItem[];
  certifications: CertificationItem[];
  hero: HeroData;
  about: AboutData;
  contact: ContactData;
  emailjs: EmailJSConfig;
  theme: ThemeConfig;
  isLoading: boolean;

  // Theme (local only)
  setThemeColor: (colorTheme: ThemePreset) => void;

  // Refresh from DB (called after admin CMS changes)
  refreshData: () => Promise<void>;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "house-rental",
    title: "Ethiopian House Rental System (INSA Summer Camp Project)",
    description: "A full-stack property rental platform with property listings, search, filtering, role-based authentication, and owner/renter communication features.",
    longDescription: "Developed during the INSA Summer Camp, this full-stack property rental platform connects house owners and renters across Ethiopian cities with verified property listings and secure communication.",
    problemStatement: "In Ethiopia, finding rental housing is traditionally disorganized, manual, and dominated by unverified middlemen charging hefty broker fees. Renters face fraudulent listings, lack of transparent pricing, and difficulty contacting legitimate property owners directly.",
    solution: "Engineered an end-to-end full-stack web application leveraging Laravel RESTful APIs and a dynamic React frontend. Designed a role-based access control system for renters, owners, and admins, complete with advanced property filtering by location/price, verified owner dashboards, and direct inquiries.",
    features: [
      "Property listing, interactive search, multi-criteria filtering, and favorites",
      "Role-based access control (RBAC) for owners, renters/buyers, and system administrators",
      "RESTful API endpoints secured by Laravel Sanctum with custom MySQL relational database architecture",
      "Real-time owner and renter communication workflows with inquiry notifications"
    ],
    tech: ["Laravel", "React", "MySQL", "Tailwind CSS", "Sanctum", "REST API"],
    github: "https://github.com/shanbelkibre/house_rental_system",
    demo: "https://house-rental-system-ten.vercel.app/",
    image: houseRental,
    category: "Full-Stack Web App",
    featured: true,
  },
  {
    id: "ethio-internship",
    title: "Ethio Internship Platform (DBU Hackathon 3rd Place Winner)",
    description: "A hackathon-winning internship platform connecting students, companies, and universities for internship opportunities.",
    longDescription: "Engineered during the 2017 E.C. Debre Birhan University Hackathon (awarded 3rd Place Winner). Built under tight hackathon deadlines to bridge the gap between academic institutions and industry.",
    problemStatement: "University students across Ethiopia struggle to discover verified internship vacancies, submit applications, and receive timely status updates. Concurrently, companies lack a streamlined, localized channel to recruit and evaluate university candidates.",
    solution: "Created a centralized 3-way platform connecting students, hiring companies, and university coordinators. Implemented applicant tracking dashboards, verified company job postings, fast client-side state persistence, and responsive UI for both mobile and desktop access.",
    features: [
      "3-Way dedicated portal for students, partner companies, and university admins",
      "Internship posting, real-time application submission, and status tracking pipeline",
      "Smart search and multi-tag filtering across tech, business, and engineering opportunities",
      "Local storage synchronization & progressive responsive mobile-first UI"
    ],
    tech: ["HTML5", "CSS3", "JavaScript (ES6)", "LocalStorage API", "Tailwind CSS"],
    github: "https://github.com/shambelkibr/EthioInterShip_platform_DBU_Hackton",
    demo: "https://ethio-inter-ship-platform.vercel.app/",
    image: ethioIntern,
    category: "Web Platform",
    featured: true,
  },

];

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  { id: "exp-1", role: "Full Stack Developer", company: "Ethiopian House Rental System (INSA Summer Camp Project)", period: "2025 - 2026", description: "Developed a full-stack property rental platform.", achievements: ["Built property rental platform with listing, search, filtering, authentication.", "Implemented role-based access for property owners, renters, and administrators.", "Designed RESTful APIs, database architecture, and responsive frontend."], skills: ["Laravel", "React", "MySQL", "REST APIs", "Tailwind CSS"] },
  { id: "exp-2", role: "Full Stack Developer", company: "Debre Birhan Town E-Commerce Platform (Internship Project)", period: "2025", description: "Built an e-commerce platform.", achievements: ["Built e-commerce platform with product management, shopping cart, orders.", "Developed responsive interfaces and backend APIs."], skills: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"] },
  { id: "exp-3", role: "Full Stack Developer", company: "Debre Birhan University Clearance Management System", period: "2024 - 2025", description: "Developed digital clearance workflow.", achievements: ["Developed digital clearance workflow for students and departments.", "Implemented role-based approval, tracking, and dashboards."], skills: ["PHP", "MySQL", "JavaScript", "HTML5/CSS3", "Bootstrap"] },
  { id: "exp-4", role: "Full Stack Developer", company: "Ethio Internship Platform (DBU Hackathon 3rd Winner)", period: "2024 - 2025", description: "Built internship platform.", achievements: ["Built platform connecting students, universities, and companies.", "Implemented profiles, postings, applications, search/filtering."], skills: ["JavaScript ES6", "HTML5", "CSS3", "LocalStorage API"] },
];

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  { id: "cert-1", title: "Cyber Security Student – GTST, Round 14", issuer: "Global Talent Security Training (GTST)", year: "2025" },
  { id: "cert-2", title: "INSA Talent Summer Camp Student – 5th Round, 2018 E.C.", issuer: "Information Network Security Administration (INSA)", year: "2025 - 2026" },
  { id: "cert-3", title: "DBU Hackathon, 2017 E.C. – 3rd Place, Innovation and Creativity", issuer: "Debre Birhan University", year: "2024 - 2025" },
];

const DEFAULT_HERO: HeroData = {
  name: "Shanbel Kibre",
  badgeText: "Available for freelance & full-stack roles",
  subtitle: "Software Engineer & Full-Stack Developer",
  bio: "Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing. Skilled at building robust, scalable applications while identifying and resolving security vulnerabilities to safeguard systems.",
  githubUrl: "https://github.com/shanbelkibre",
  linkedinUrl: "https://www.linkedin.com/in/shanbel-kibre/",
};

const DEFAULT_ABOUT: AboutData = {
  paragraphs: [
    "I am a Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing. Skilled at building robust, scalable applications while identifying and resolving security vulnerabilities to safeguard systems.",
    "Fascinated by learning new technologies and passionate about solving complex problems through innovative, practical solutions. I specialize in React, Next.js, Node.js, Express, NestJS, Laravel, MongoDB, MySQL, and PostgreSQL.",
    "Pursuing a Bachelor of Science in Software Engineering (Harmonized Modular Curriculum) at Debre Birhan University. Recognized as 3rd Place Winner in DBU Hackathon and participant in INSA Talent Summer Camp.",
  ],
};


const DEFAULT_CONTACT: ContactData = {
  email: "Shambel5110@gmail.com",
  phone: "094 6340 709 / +251 962 585 655",
  location: "Addis Ababa & Debre Birhan, Ethiopia",
};

const DEFAULT_EMAILJS: EmailJSConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_portfolio",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_contact",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "user_public_key_placeholder",
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => !!localStorage.getItem("admin_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCES);
  const [certifications, setCertifications] = useState<CertificationItem[]>(DEFAULT_CERTIFICATIONS);
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [emailjs] = useState<EmailJSConfig>(DEFAULT_EMAILJS);
  const [theme, setThemeState] = useState<ThemeConfig>({ colorTheme: "cyan" });

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/portfolio");
      if (!response.ok) throw new Error("Failed to fetch portfolio data");
      const data = await response.json();

      // Only replace the built-in defaults when the API actually returns content.
      // An empty DB table must NOT wipe out the fallback content already on screen.
      const hasItems = (arr: unknown): arr is unknown[] => Array.isArray(arr) && arr.length > 0;

      if (hasItems(data.projects)) {
        const assetMap = [houseRental, ethioIntern, portfolio];
        const mapped = data.projects.map((p: Record<string, unknown>, i: number) => {
          const def = DEFAULT_PROJECTS.find((dp) => dp.id === p.id || dp.title === p.title) || DEFAULT_PROJECTS[i] || {} as Partial<Project>;
          return {
            ...def,
            ...p,
            problemStatement: (p.problemStatement as string) || def.problemStatement || undefined,
            solution: (p.solution as string) || def.solution || undefined,
            longDescription: (p.longDescription as string) || def.longDescription || undefined,
            image: (p.image as string | null) || assetMap[i] || def.image || undefined,
            tech: Array.isArray(p.tech) && p.tech.length > 0 ? p.tech : (def.tech || []),
            features: Array.isArray(p.features) && p.features.length > 0 ? p.features : (def.features || []),
            github: (p.github as string) || (p.githubUrl as string) || def.github || undefined,
            demo: (p.demo as string) || (p.demoUrl as string) || def.demo || undefined,
          };
        });
        setProjects(mapped);
      }
      if (hasItems(data.experiences)) setExperiences(data.experiences);
      if (hasItems(data.certifications)) setCertifications(data.certifications);
      if (data.hero) setHero((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(data.hero).filter(([, v]) => v != null && v !== "")) }));
      if (hasItems(data.about?.paragraphs)) setAbout({ paragraphs: data.about.paragraphs });
      if (data.contact) setContact((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(data.contact).filter(([, v]) => v != null && v !== "")) }));
      if (data.theme?.colorTheme) setThemeState({ colorTheme: data.theme.colorTheme });
    } catch {
      // Keep fallback data silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme-preset", theme.colorTheme);
  }, [theme.colorTheme]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_username", data.user?.username || username);
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    setIsAdminLoggedIn(false);
  };

  const setThemeColor = (colorTheme: ThemePreset) => {
    setThemeState({ colorTheme });
  };

  return (
    <CMSContext.Provider value={{
      isAdminLoggedIn, setIsAdminLoggedIn,
      login, logout,
      projects, experiences, certifications,
      hero, about, contact, emailjs, theme,
      isLoading,
      setThemeColor,
      refreshData: fetchData,
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error("useCMS must be used within a CMSProvider");
  return context;
};
