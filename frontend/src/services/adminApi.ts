// Centralized Admin API service
// All requests automatically include the JWT token from localStorage

const BASE_URL = "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin";
    throw new Error("Unauthorized");
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Request failed");
  return data as T;
}

// AUTH
export const authApi = {
  login: (username: string, password: string) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((r) => r.json()),

  logout: () => authFetch("/auth/logout", { method: "POST" }),
  me: () => authFetch<{ user: { id: string; username: string; createdAt: string } }>("/auth/me"),
};

// PROJECTS
export interface AdminProject {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  category: { id: string; name: string } | null;
  features: string[];
  technologies: { id: string; name: string }[];
}

export const projectsApi = {
  getAll: () => authFetch<{ success: boolean; projects: AdminProject[] }>("/admin/projects"),
  create: (data: Partial<AdminProject> & { technologyIds?: string[]; categoryId?: string }) =>
    authFetch<{ success: boolean; project: AdminProject }>("/admin/projects", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminProject> & { technologyIds?: string[]; categoryId?: string }) =>
    authFetch<{ success: boolean; project: AdminProject }>(`/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => authFetch<{ success: boolean }>(`/admin/projects/${id}`, { method: "DELETE" }),
};

// EXPERIENCES
export interface AdminExperience {
  id: string;
  role: string;
  company: string;
  periodStart: string;
  periodEnd: string;
  description: string;
  achievements: string[];
  skills: { id: string; name: string }[];
}

export const experiencesApi = {
  getAll: () => authFetch<{ success: boolean; experiences: AdminExperience[] }>("/admin/experiences"),
  create: (data: Partial<AdminExperience> & { technologyIds?: string[] }) =>
    authFetch<{ success: boolean; experience: AdminExperience }>("/admin/experiences", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AdminExperience> & { technologyIds?: string[] }) =>
    authFetch<{ success: boolean; experience: AdminExperience }>(`/admin/experiences/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => authFetch<{ success: boolean }>(`/admin/experiences/${id}`, { method: "DELETE" }),
};

// CERTIFICATIONS
export interface AdminCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  createdAt?: string;
}

export const certificationsApi = {
  getAll: () => authFetch<{ success: boolean; certifications: AdminCertification[] }>("/admin/certifications"),
  create: (data: Omit<AdminCertification, "id" | "createdAt">) =>
    authFetch<{ success: boolean; certification: AdminCertification }>("/admin/certifications", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Omit<AdminCertification, "id" | "createdAt">) =>
    authFetch<{ success: boolean; certification: AdminCertification }>(`/admin/certifications/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => authFetch<{ success: boolean }>(`/admin/certifications/${id}`, { method: "DELETE" }),
};

// TECHNOLOGIES
export interface AdminTechnology {
  id: string;
  name: string;
  _count?: { projects: number; experiences: number };
}

export const technologiesApi = {
  getAll: () => authFetch<{ success: boolean; technologies: AdminTechnology[] }>("/admin/technologies"),
  create: (name: string) =>
    authFetch<{ success: boolean; technology: AdminTechnology }>("/admin/technologies", { method: "POST", body: JSON.stringify({ name }) }),
  update: (id: string, name: string) =>
    authFetch<{ success: boolean; technology: AdminTechnology }>(`/admin/technologies/${id}`, { method: "PUT", body: JSON.stringify({ name }) }),
  delete: (id: string) => authFetch<{ success: boolean }>(`/admin/technologies/${id}`, { method: "DELETE" }),
};

// CATEGORIES
export interface AdminCategory {
  id: string;
  name: string;
  _count?: { projects: number };
}

export const categoriesApi = {
  getAll: () => authFetch<{ success: boolean; categories: AdminCategory[] }>("/admin/categories"),
  create: (name: string) =>
    authFetch<{ success: boolean; category: AdminCategory }>("/admin/categories", { method: "POST", body: JSON.stringify({ name }) }),
  update: (id: string, name: string) =>
    authFetch<{ success: boolean; category: AdminCategory }>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify({ name }) }),
  delete: (id: string) => authFetch<{ success: boolean }>(`/admin/categories/${id}`, { method: "DELETE" }),
};

// SITE CONFIG
export interface SiteConfigData {
  id: string;
  heroName: string | null;
  heroBadge: string | null;
  heroSubtitle: string | null;
  heroBio: string | null;
  heroGithub: string | null;
  heroLinkedin: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactLocation: string | null;
  themeColor: string | null;
  paragraphs: { id: string; content: string; orderIndex: number }[];
}

export const siteConfigApi = {
  get: () => authFetch<{ success: boolean; config: SiteConfigData | null }>("/admin/site-config"),
  update: (data: {
    hero?: Record<string, string>;
    contact?: Record<string, string>;
    theme?: { colorTheme: string };
    about?: { paragraphs: string[] };
  }) => authFetch<{ success: boolean; config: SiteConfigData }>("/admin/site-config", { method: "PUT", body: JSON.stringify(data) }),
};
