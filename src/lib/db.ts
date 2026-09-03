/**
 * Database & API Adapter Layer for Portfolio CMS
 * Supports local client storage and ready for Supabase / REST API backend integration.
 */

import { Project, ExperienceItem, CertificationItem, HeroData, AboutData, ContactData, EmailJSConfig, ThemeConfig } from "@/context/CMSContext";

export interface DatabaseProvider {
  fetchProjects: () => Promise<Project[] | null>;
  saveProjects: (projects: Project[]) => Promise<boolean>;
  fetchExperiences: () => Promise<ExperienceItem[] | null>;
  saveExperiences: (experiences: ExperienceItem[]) => Promise<boolean>;
}

// REST / Database Endpoint Config (If user connects external DB like Supabase/Express)
const API_BASE_URL = import.meta.env.VITE_DATABASE_API_URL || null;

export const portfolioDB = {
  async isBackendConnected(): Promise<boolean> {
    if (!API_BASE_URL) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  },

  async loadProjects(fallback: Project[]): Promise<Project[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/projects`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (e) {
        console.warn("Backend DB offline, loading local storage cache:", e);
      }
    }
    const saved = localStorage.getItem("sk_cms_projects_v2");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return fallback;
  },

  async saveProjects(projects: Project[]): Promise<boolean> {
    localStorage.setItem("sk_cms_projects_v2", JSON.stringify(projects));
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects }),
        });
      } catch (e) {
        console.error("Failed to sync to backend DB:", e);
      }
    }
    return true;
  },
};
