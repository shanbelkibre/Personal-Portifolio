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

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [hero, setHero] = useState<HeroData>({} as HeroData);
  const [about, setAbout] = useState<AboutData>({ paragraphs: [] });
  const [contact, setContact] = useState<ContactData>({} as ContactData);
  const [emailjs, setEmailJSState] = useState<EmailJSConfig>(DEFAULT_EMAILJS);
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);

  // Fetch data from Backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/portfolio");
        if (!response.ok) throw new Error("Failed to fetch portfolio data");
        const data = await response.json();

        if (data.projects) {
          // Fallback images since they aren't stored as files in DB yet
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

  // The below functions update local state for the CMS Drawer.
  // In the future, these should be updated to send PUT/POST/DELETE requests to the backend API.
  const addProject = (project: Omit<Project, "id">) => {
    const newProj: Project = { ...project, id: "proj-" + Date.now() };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addExperience = (exp: Omit<ExperienceItem, "id">) => {
    const newExp: ExperienceItem = { ...exp, id: "exp-" + Date.now() };
    setExperiences((prev) => [newExp, ...prev]);
  };

  const updateExperience = (id: string, updated: Partial<ExperienceItem>) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const updateHero = (data: Partial<HeroData>) => {
    setHero((prev) => ({ ...prev, ...data }));
  };

  const updateAbout = (data: Partial<AboutData>) => {
    setAbout((prev) => ({ ...prev, ...data }));
  };

  const updateContact = (data: Partial<ContactData>) => {
    setContact((prev) => ({ ...prev, ...data }));
  };

  const updateEmailJS = (data: Partial<EmailJSConfig>) => {
    setEmailJSState((prev) => ({ ...prev, ...data }));
  };

  const setThemeColor = (colorTheme: ThemePreset) => {
    setThemeState({ colorTheme });
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


