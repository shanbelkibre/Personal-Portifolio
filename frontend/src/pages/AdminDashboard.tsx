import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCMS } from "@/context/CMSContext";
import { authApi } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban, Briefcase, Award, FileText,
  Cpu, Tag, LogOut, User, Menu, X, ChevronDown,
  LayoutDashboard,
} from "lucide-react";

// Section imports
import ProjectsSection from "./admin/sections/ProjectsSection";
import ExperienceSection from "./admin/sections/ExperienceSection";
import CertificationsSection from "./admin/sections/CertificationsSection";
import SiteCopySection from "./admin/sections/SiteCopySection";
import TechnologiesSection from "./admin/sections/TechnologiesSection";
import CategoriesSection from "./admin/sections/CategoriesSection";

type Section = "projects" | "experience" | "certifications" | "site-copy" | "technologies" | "categories";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; group: string }[] = [
  { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" />, group: "content" },
  { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" />, group: "content" },
  { id: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" />, group: "content" },
  { id: "site-copy", label: "Site Copy", icon: <FileText className="w-4 h-4" />, group: "content" },
  { id: "technologies", label: "Technologies", icon: <Cpu className="w-4 h-4" />, group: "meta" },
  { id: "categories", label: "Categories", icon: <Tag className="w-4 h-4" />, group: "meta" },
];

const AdminDashboard: React.FC = () => {
  const { logout, refreshData } = useCMS();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("projects");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string>(() => localStorage.getItem("admin_username") || "Admin");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    authApi.me().then((d) => setUsername(d.user.username)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate("/admin");
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    refreshData();
  };

  const renderSection = () => {
    switch (activeSection) {
      case "projects": return <ProjectsSection />;
      case "experience": return <ExperienceSection />;
      case "certifications": return <CertificationsSection />;
      case "site-copy": return <SiteCopySection />;
      case "technologies": return <TechnologiesSection />;
      case "categories": return <CategoriesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-none">Portfolio CMS</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Admin Dashboard</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-all text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="hidden sm:block font-medium text-foreground">{username}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">Logged in as</p>
                    <p className="text-sm font-bold text-foreground">{username}</p>
                    <Badge variant="outline" className="text-[10px] mt-1 text-primary border-primary/40">Admin</Badge>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb / section title */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutDashboard className="w-4 h-4" />
          <span>/</span>
          <span className="text-foreground font-medium capitalize">{activeSection.replace("-", " ")}</span>
        </div>

        {/* Section content */}
        {renderSection()}
      </main>

      {/* Click-outside to close profile */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;
