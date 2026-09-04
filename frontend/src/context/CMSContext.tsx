import React, { createContext, useContext, useState, useEffect } from "react";

import houseRental from "@/assets/houserntal.jpg";
import ethioIntern from "@/assets/Ethiointern.jpg";
import portfolio from "@/assets/portifolio.jpg";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
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
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isCMSDrawerOpen: boolean;
  setIsCMSDrawerOpen: (open: boolean) => void;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  updatePasskey: (newPass: string) => Promise<void>;

  projects: Project[];
  experiences: ExperienceItem[];
  certifications: CertificationItem[];
  hero: HeroData;
  about: AboutData;
  contact: ContactData;
  emailjs: EmailJSConfig;
  theme: ThemeConfig;
  isLoading: boolean;

  // Stubs for Admin operations
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addExperience: (exp: Omit<ExperienceItem, "id">) => void;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  updateHero: (data: Partial<HeroData>) => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateContact: (data: Partial<ContactData>) => void;
  updateEmailJS: (data: Partial<EmailJSConfig>) => void;
  setThemeColor: (colorTheme: ThemePreset) => void;
  resetToDefaults: () => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => boolean;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "house-rental",
    title: "Ethiopian House Rental System (INSA Summer Camp Project)",
    description:
      "A full-stack property rental platform with property listings, search, filtering, role-based authentication, and owner/renter communication features.",
    longDescription:
      "Developed during the INSA Summer Camp, this full-stack property rental platform connects house owners and renters. It features role-based access for owners, renters/buyers, and administrators, along with robust RESTful APIs, database architecture, and responsive frontend interfaces.",
    features: [
      "Property listing, search, filtering, and favorites",
      "Role-based access for owners, renters/buyers, and administrators",
      "RESTful APIs and custom database architecture",
      "Real-time owner and renter communication workflows",
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
    description:
      "A hackathon-winning internship platform connecting students, companies, and universities for internship opportunities.",
    longDescription:
      "Engineered during the 2017 E.C. Debre Birhan University Hackathon (3rd Place Winner), Ethio Internship solves the internship gap in Ethiopian higher education with profile management, internship posting, applications, and tracking.",
    features: [
      "3-Way portal for students, partner companies, and university admins",
      "Internship posting, application submissions, and status tracking",
      "Smart search and filtering across internship opportunities",
      "Local storage sync & progressive web capabilities",
    ],
    tech: ["HTML5", "CSS3", "JavaScript (ES6)", "LocalStorage API", "Tailwind CSS"],
    github: "https://github.com/shambelkibr/EthioInterShip_platform_DBU_Hackton",
    demo: "https://ethio-inter-ship-platform.vercel.app/",
    image: ethioIntern,
    category: "Web Platform",
    featured: true,
  },
  {
    id: "react-portfolio",
    title: "Modern Full-Stack & Cybersecurity Portfolio",
    description:
      "A sleek, responsive personal portfolio showcasing modern web engineering, customizable color tokens, project deep dives, and keyboard-activated admin CMS.",
    longDescription:
      "Designed to represent top-tier freelance standards. Includes dynamic glassmorphism design tokens, full client-side CMS capability with secret keyboard triggers, and responsive interactive cards.",
    features: [
      "Dynamic color theme preset switching (Cyan, Emerald, Violet, Amber, Blue)",
      "Keyboard shortcut Ctrl+Shift+A for Admin CMS suite",
      "Modal-based project deep dive with rich media showcase",
      "Client-side LocalStorage data persistence with JSON export/import",
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
    github: "https://github.com/shambelkibr/my-Portfolio-by-React",
    demo: "https://shanbelkibremyportfolio.vercel.app/",
    image: portfolio,
    category: "Frontend UI",
    featured: true,
  },
];

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Full Stack Developer",
    company: "Ethiopian House Rental System (INSA Summer Camp Project)",
    period: "2025 - 2026",
    description:
      "Developed a full-stack property rental platform connecting house owners and renters in Debre Birhan town.",
    achievements: [
      "Developed a property rental platform with property listing, search, filtering, authentication, and communication features.",
      "Implemented role-based access for property owners, renters/buyers, and administrators.",
      "Designed RESTful APIs, database architecture, and responsive frontend interfaces.",
    ],
    skills: ["Laravel", "React", "MySQL", "REST APIs", "Tailwind CSS"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "Debre Birhan Town E-Commerce Platform (Internship Project)",
    period: "2025",
    description:
      "Built an e-commerce platform supporting product management, search, shopping cart, orders, and authentication.",
    achievements: [
      "Built an e-commerce platform supporting product management, search, shopping cart, orders, authentication, and administration.",
      "Developed responsive interfaces and backend APIs for managing users, products, categories, and orders.",
    ],
    skills: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
  },
  {
    id: "exp-3",
    role: "Full Stack Developer",
    company: "Debre Birhan University Clearance Management System (2nd Year Final Project)",
    period: "2024 - 2025",
    description:
      "Developed a digital clearance workflow connecting students, university departments, and administrators.",
    achievements: [
      "Developed a digital clearance workflow connecting students, university departments, and administrators.",
      "Implemented role-based approval, clearance tracking, dashboards, and status management to reduce manual processes.",
    ],
    skills: ["PHP", "MySQL", "JavaScript", "HTML5/CSS3", "Bootstrap"],
  },
  {
    id: "exp-4",
    role: "Full Stack Developer",
    company: "Ethio Internship Platform (DBU Hackathon 3rd Winner)",
    period: "2024 - 2025",
    description:
      "Built a platform connecting university students, universities, and companies for internship opportunities.",
    achievements: [
      "Built a platform connecting university students, universities, and companies for internship opportunities.",
      "Implemented profiles, internship postings, applications, search/filtering, and application tracking.",
    ],
    skills: ["JavaScript ES6", "HTML5", "CSS3", "LocalStorage API"],
  },
];

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-1",
    title: "Cyber Security Student – GTST, Round 14",
    issuer: "Global Talent Security Training (GTST)",
    year: "2025",
  },
  {
    id: "cert-2",
    title: "INSA Talent Summer Camp Student – 5th Round, 2018 E.C.",
    issuer: "Information Network Security Administration (INSA)",
    year: "2025 - 2026",
  },
  {
    id: "cert-3",
    title: "DBU Hackathon, 2017 E.C. – 3rd Place, Innovation and Creativity",
    issuer: "Debre Birhan University",
    year: "2024 - 2025",
  },
];

const DEFAULT_HERO: HeroData = {
  name: "Shanbel Kibre",
  badgeText: "Available for freelance & full-stack roles",
  subtitle: "Software Engineer & Full-Stack Developer",
  bio: "Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing. Skilled at building robust, scalable applications while identifying and resolving security vulnerabilities.",
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

const DEFAULT_THEME: ThemeConfig = {
  colorTheme: "cyan",
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("admin_token");
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isCMSDrawerOpen, setIsCMSDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data states initialized with fast default fallbacks
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCES);
  const [certifications, setCertifications] = useState<CertificationItem[]>(DEFAULT_CERTIFICATIONS);
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [emailjs, setEmailJSState] = useState<EmailJSConfig>(DEFAULT_EMAILJS);
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/portfolio");
      if (!response.ok) throw new Error("Failed to fetch portfolio data");
      const data = await response.json();

      if (data.projects) {
        const mappedProjects = data.projects.map((p: any, index: number) => ({
          ...p,
          image: index === 0 ? houseRental : (index === 1 ? ethioIntern : portfolio)
        }));
        setProjects(mappedProjects);
      }
      if (data.experiences) setExperiences(data.experiences);
      if (data.certifications) setCertifications(data.certifications);
      if (data.hero) setHero(data.hero);
      if (data.about) setAbout(data.about);
      if (data.contact) setContact(data.contact);
      if (data.theme && data.theme.colorTheme) {
        setThemeState(data.theme);
      }
    } catch (error) {
      console.error("Error fetching from backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data from Backend API on mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme-preset", theme.colorTheme);
  }, [theme.colorTheme]);

  const login = async (password: string): Promise<boolean> => {
    try {
      // In the new auth page, we pass username. Hardcoding for backwards compatibility with the old modal if still used.
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "shanboman", password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("admin_token", data.token);
        setIsAdminLoggedIn(true);
        setIsAdminLoginOpen(false);
        setIsCMSDrawerOpen(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAdminLoggedIn(false);
    setIsCMSDrawerOpen(false);
  };

  const updatePasskey = async (newPass: string) => {
    // Moved to backend later
    console.warn("updatePasskey is disabled while migrating to backend");
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("admin_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as any),
    };
    return fetch(`http://localhost:5000${url}`, { ...options, headers });
  };

  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const res = await authFetch("/api/admin/projects", { method: "POST", body: JSON.stringify(project) });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    try {
      const res = await authFetch(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(updated) });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const addExperience = async (exp: Omit<ExperienceItem, "id">) => {
    try {
      const res = await authFetch("/api/admin/experiences", { method: "POST", body: JSON.stringify(exp) });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const updateExperience = async (id: string, updated: Partial<ExperienceItem>) => {
    try {
      const res = await authFetch(`/api/admin/experiences/${id}`, { method: "PUT", body: JSON.stringify(updated) });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const deleteExperience = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const updateSiteConfigApi = async (payload: any) => {
    try {
      const res = await authFetch("/api/admin/site-config", { method: "PUT", body: JSON.stringify(payload) });
      if (res.ok) await fetchData();
    } catch (e) { console.error(e); }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    await updateSiteConfigApi({ hero: data });
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    await updateSiteConfigApi({ about: data });
  };

  const updateContact = async (data: Partial<ContactData>) => {
    await updateSiteConfigApi({ contact: data });
  };

  const updateEmailJS = (data: Partial<EmailJSConfig>) => {
    // Currently emailjs config is not stored in site config in DB in this implementation
    // We just update local state for now
    setEmailJSState((prev) => ({ ...prev, ...data }));
  };

  const setThemeColor = async (colorTheme: ThemePreset) => {
    setThemeState({ colorTheme });
    await updateSiteConfigApi({ theme: { colorTheme } });
  };

  const resetToDefaults = () => {
    console.warn("resetToDefaults is disabled while migrating to backend");
  };

  const exportBackup = () => {
    console.warn("exportBackup is disabled while migrating to backend");
  };

  const importBackup = (jsonString: string): boolean => {
    console.warn("importBackup is disabled while migrating to backend");
    return false;
  };

  return (
    <CMSContext.Provider
      value={{
        isAdminLoggedIn,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isCMSDrawerOpen,
        setIsCMSDrawerOpen,
        login,
        logout,
        updatePasskey,
        projects,
        experiences,
        certifications,
        hero,
        about,
        contact,
        emailjs,
        theme,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        updateHero,
        updateAbout,
        updateContact,
        updateEmailJS,
        setThemeColor,
        resetToDefaults,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};


