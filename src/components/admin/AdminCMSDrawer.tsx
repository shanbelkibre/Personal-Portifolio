import React, { useState } from "react";
import { useCMS, Project, ExperienceItem, ThemePreset } from "@/context/CMSContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  User,
  Palette,
  Shield,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Check,
  LogOut,
  Sparkles,
  RefreshCw,
  X,
  FileText,
  Mail,
  Briefcase,
  Key,
} from "lucide-react";

export const AdminCMSDrawer: React.FC = () => {
  const {
    isAdminLoggedIn,
    isCMSDrawerOpen,
    setIsCMSDrawerOpen,
    logout,
    projects,
    experiences,
    hero,
    about,
    contact,
    emailjs,
    theme,
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
    updatePasskey,
    resetToDefaults,
    exportBackup,
    importBackup,
  } = useCMS();

  // Projects edit state
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [projForm, setProjForm] = useState<Partial<Project>>({
    title: "",
    description: "",
    longDescription: "",
    tech: [],
    github: "",
    demo: "",
    image: "",
    category: "Full-Stack Web App",
    features: [""],
  });
  const [techInput, setTechInput] = useState("");

  // Experience edit state
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expForm, setExpForm] = useState<Partial<ExperienceItem>>({
    role: "",
    company: "",
    period: "",
    description: "",
    achievements: [""],
    skills: [],
  });
  const [expSkillsInput, setExpSkillsInput] = useState("");

  const [newPassInput, setNewPassInput] = useState("");
  const [passMessage, setPassMessage] = useState("");

  if (!isAdminLoggedIn) return null;

  // Project handlers
  const handleEditProjClick = (proj: Project) => {
    setEditingProjId(proj.id);
    setIsAddingProj(false);
    setProjForm(proj);
    setTechInput(proj.tech.join(", "));
  };

  const handleStartAddProj = () => {
    setEditingProjId(null);
    setIsAddingProj(true);
    setProjForm({
      title: "",
      description: "",
      longDescription: "",
      tech: ["React", "TypeScript", "Tailwind CSS"],
      github: "https://github.com/shanbelkibre/",
      demo: "https://",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      category: "Full-Stack Web App",
      features: ["Custom feature 1", "Custom feature 2"],
    });
    setTechInput("React, TypeScript, Tailwind CSS");
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = techInput.split(",").map((t) => t.trim()).filter(Boolean);

    const projectPayload = {
      title: projForm.title || "Untitled Project",
      description: projForm.description || "",
      longDescription: projForm.longDescription || projForm.description,
      tech: techArray.length > 0 ? techArray : ["Web"],
      github: projForm.github || "",
      demo: projForm.demo || "",
      image: projForm.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      category: projForm.category || "Full-Stack Web App",
      features: (projForm.features || []).filter((f) => f.trim() !== ""),
    };

    if (isAddingProj) {
      addProject(projectPayload);
      setIsAddingProj(false);
    } else if (editingProjId) {
      updateProject(editingProjId, projectPayload);
      setEditingProjId(null);
    }
  };

  // Experience handlers
  const handleEditExpClick = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setIsAddingExp(false);
    setExpForm(exp);
    setExpSkillsInput(exp.skills.join(", "));
  };

  const handleStartAddExp = () => {
    setEditingExpId(null);
    setIsAddingExp(true);
    setExpForm({
      role: "Full Stack Developer",
      company: "Company / Project Name",
      period: "2025 - 2026",
      description: "Short role summary...",
      achievements: ["Key achievement 1", "Key achievement 2"],
      skills: ["React", "Node.js"],
    });
    setExpSkillsInput("React, Node.js");
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = expSkillsInput.split(",").map((s) => s.trim()).filter(Boolean);

    const expPayload = {
      role: expForm.role || "Developer",
      company: expForm.company || "Organization",
      period: expForm.period || "2025",
      description: expForm.description || "",
      achievements: (expForm.achievements || []).filter((a) => a.trim() !== ""),
      skills: skillsArray,
    };

    if (isAddingExp) {
      addExperience(expPayload);
      setIsAddingExp(false);
    } else if (editingExpId) {
      updateExperience(editingExpId, expPayload);
      setEditingExpId(null);
    }
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassInput.trim().length < 4) {
      setPassMessage("Passcode must be at least 4 characters.");
      return;
    }
    await updatePasskey(newPassInput.trim());
    setNewPassInput("");
    setPassMessage("Admin passcode encrypted with SHA-256 and saved!");
    setTimeout(() => setPassMessage(""), 4000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importBackup(content);
        if (ok) alert("Portfolio data backup restored successfully!");
        else alert("Failed to import file. Please check JSON format.");
      }
    };
    reader.readAsText(file);
  };

  const THEME_PRESETS: { id: ThemePreset; name: string; gradient: string }[] = [
    {
      id: "cyan",
      name: "Electric Cyan (Default)",
      gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    },
    {
      id: "emerald",
      name: "Emerald Teal",
      gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    },
    {
      id: "violet",
      name: "Royal Violet",
      gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    },
    {
      id: "amber",
      name: "Sunset Amber",
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    },
    {
      id: "blue",
      name: "Deep Sapphire Blue",
      gradient: "linear-gradient(135deg, #2563eb, #7c3aed)",
    },
  ];

  return (
    <>
      {/* Floating Admin Bar */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-card/90 border border-primary/40 p-2 pl-4 rounded-full shadow-2xl backdrop-blur-md animate-fade-in">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground">Admin CMS Active</span>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCMSDrawerOpen(true)}
          className="gap-1.5 h-8 text-xs bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Open CMS Panel
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={logout}
          title="Logout Admin"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Main CMS Modal */}
      <Dialog open={isCMSDrawerOpen} onOpenChange={setIsCMSDrawerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl backdrop-blur-2xl p-6">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="w-6 h-6 text-primary" />
                Portfolio Content Management System
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Manage projects, work experience timeline, site copy, EmailJS keys, theme accents, and backups.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary font-mono text-xs">
                SHA-256 Encrypted
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid grid-cols-5 bg-muted/60 p-1 rounded-xl mb-6">
              <TabsTrigger value="projects" className="gap-1.5 text-xs font-medium">
                <FolderKanban className="w-3.5 h-3.5" />
                Projects ({projects.length})
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-1.5 text-xs font-medium">
                <Briefcase className="w-3.5 h-3.5" />
                Experience ({experiences.length})
              </TabsTrigger>
              <TabsTrigger value="site" className="gap-1.5 text-xs font-medium">
                <User className="w-3.5 h-3.5" />
                Site Copy
              </TabsTrigger>
              <TabsTrigger value="theme" className="gap-1.5 text-xs font-medium">
                <Palette className="w-3.5 h-3.5" />
                Themes
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 text-xs font-medium">
                <Shield className="w-3.5 h-3.5" />
                EmailJS & Security
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PROJECTS MANAGER */}
            <TabsContent value="projects" className="space-y-6">
              {!isAddingProj && !editingProjId ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Manage Portfolio Projects</h3>
                    <Button onClick={handleStartAddProj} size="sm" className="gap-1.5 shadow">
                      <Plus className="w-4 h-4" />
                      Add New Project
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-16 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-foreground text-sm md:text-base">
                              {proj.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                              {proj.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {proj.tech.map((t) => (
                                <span key={t} className="px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary font-medium">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProjClick(proj)}
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Edit className="w-3.5 h-3.5 text-primary" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteProject(proj.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit/Add Project Form */
                <form onSubmit={handleSaveProject} className="space-y-4 bg-secondary/20 p-5 rounded-2xl border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      {isAddingProj ? "Add New Project" : "Edit Project Details"}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setIsAddingProj(false);
                        setEditingProjId(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Project Title</label>
                      <Input
                        value={projForm.title || ""}
                        onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                        placeholder="e.g. E-Commerce Platform"
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Category</label>
                      <Input
                        value={projForm.category || ""}
                        onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                        placeholder="e.g. Full-Stack Web App"
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Short Summary Description</label>
                    <Textarea
                      rows={2}
                      value={projForm.description || ""}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      placeholder="Brief overview shown on portfolio cards..."
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Long Detailed Description (For Detail View Modal)</label>
                    <Textarea
                      rows={3}
                      value={projForm.longDescription || ""}
                      onChange={(e) => setProjForm({ ...projForm, longDescription: e.target.value })}
                      placeholder="In-depth technical architecture breakdown..."
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Tech Stack Tags (Comma separated)</label>
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="React, TypeScript, Node.js, Tailwind CSS"
                      className="bg-card"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">GitHub Repo Link</label>
                      <Input
                        value={projForm.github || ""}
                        onChange={(e) => setProjForm({ ...projForm, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Live Demo Link</label>
                      <Input
                        value={projForm.demo || ""}
                        onChange={(e) => setProjForm({ ...projForm, demo: e.target.value })}
                        placeholder="https://..."
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
                      <Input
                        value={projForm.image || ""}
                        onChange={(e) => setProjForm({ ...projForm, image: e.target.value })}
                        placeholder="Image path or URL"
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingProj(false);
                        setEditingProjId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="gap-2">
                      <Check className="w-4 h-4" />
                      Save Project
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            {/* TAB 2: EXPERIENCE MANAGER */}
            <TabsContent value="experience" className="space-y-6">
              {!isAddingExp && !editingExpId ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Manage Work History & Experience</h3>
                    <Button onClick={handleStartAddExp} size="sm" className="gap-1.5 shadow">
                      <Plus className="w-4 h-4" />
                      Add Work Experience
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground text-sm md:text-base">
                              {exp.role}
                            </h4>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-semibold">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-primary/80">{exp.company}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {exp.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditExpClick(exp)}
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Edit className="w-3.5 h-3.5 text-primary" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteExperience(exp.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit/Add Experience Form */
                <form onSubmit={handleSaveExperience} className="space-y-4 bg-secondary/20 p-5 rounded-2xl border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {isAddingExp ? "Add Work Experience" : "Edit Work Experience"}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setIsAddingExp(false);
                        setEditingExpId(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Role / Position</label>
                      <Input
                        value={expForm.role || ""}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        placeholder="e.g. Full Stack Developer"
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Company / Organization</label>
                      <Input
                        value={expForm.company || ""}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        placeholder="e.g. Debre Birhan University"
                        required
                        className="bg-card"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Timeline Period</label>
                      <Input
                        value={expForm.period || ""}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        placeholder="e.g. 2025 - 2026"
                        required
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Role Description</label>
                    <Textarea
                      rows={2}
                      value={expForm.description || ""}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      placeholder="Brief role summary..."
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Key Skill Tags (Comma separated)</label>
                    <Input
                      value={expSkillsInput}
                      onChange={(e) => setExpSkillsInput(e.target.value)}
                      placeholder="React, Laravel, MySQL, REST APIs"
                      className="bg-card"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingExp(false);
                        setEditingExpId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="gap-2">
                      <Check className="w-4 h-4" />
                      Save Work Experience
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            {/* TAB 3: SITE CONTENT MANAGER */}
            <TabsContent value="site" className="space-y-6">
              <div className="space-y-4 bg-secondary/20 p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-base text-primary">Hero Section Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Your Name</label>
                    <Input
                      value={hero.name}
                      onChange={(e) => updateHero({ name: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Badge Text</label>
                    <Input
                      value={hero.badgeText}
                      onChange={(e) => updateHero({ badgeText: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Headline Subtitle</label>
                  <Input
                    value={hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Hero Short Bio</label>
                  <Textarea
                    rows={2}
                    value={hero.bio}
                    onChange={(e) => updateHero({ bio: e.target.value })}
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 bg-secondary/20 p-5 rounded-2xl border border-border">
                <h3 className="font-bold text-base text-primary">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                    <Input
                      value={contact.email}
                      onChange={(e) => updateContact({ email: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateContact({ phone: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Location</label>
                    <Input
                      value={contact.location}
                      onChange={(e) => updateContact({ location: e.target.value })}
                      className="bg-card"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: THEME COLOR PRESETS */}
            <TabsContent value="theme" className="space-y-6">
              <div className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-4">
                <div>
                  <h3 className="font-bold text-base">Select Accent Color Preset</h3>
                  <p className="text-xs text-muted-foreground">
                    Instantly changes primary accents, glow gradients, buttons, and badges across the entire site.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = theme.colorTheme === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setThemeColor(preset.id)}
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-all text-left ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/40"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div
                          className="w-full h-10 rounded-lg shadow-sm"
                          style={{ background: preset.gradient }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{preset.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: EMAILJS & SECURITY */}
            <TabsContent value="settings" className="space-y-6">
              {/* EmailJS Integration Configuration */}
              <div className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base">EmailJS Contact Form (.env Integration)</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Values loaded directly from your root <code className="px-1 py-0.5 bg-muted rounded font-mono text-primary">.env</code> environment variables (<code className="px-1 py-0.5 bg-muted rounded font-mono text-primary">VITE_EMAILJS_SERVICE_ID</code>).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">EmailJS Service ID</label>
                    <Input
                      value={emailjs.serviceId}
                      onChange={(e) => updateEmailJS({ serviceId: e.target.value })}
                      placeholder="e.g. service_xxxxxx"
                      className="bg-card font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">EmailJS Template ID</label>
                    <Input
                      value={emailjs.templateId}
                      onChange={(e) => updateEmailJS({ templateId: e.target.value })}
                      placeholder="e.g. template_xxxxxx"
                      className="bg-card font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">EmailJS Public Key</label>
                    <Input
                      value={emailjs.publicKey}
                      onChange={(e) => updateEmailJS({ publicKey: e.target.value })}
                      placeholder="e.g. user_public_key..."
                      className="bg-card font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Passcode update with SHA-256 */}
              <form onSubmit={handlePassChange} className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base">Change Admin Passcode (SHA-256 Encrypted)</h3>
                </div>
                {passMessage && (
                  <p className="text-xs font-semibold text-emerald-400">{passMessage}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="password"
                    placeholder="New admin passcode..."
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="bg-card flex-grow"
                  />
                  <Button type="submit" className="gap-2">
                    Update & Encrypt
                  </Button>
                </div>
              </form>

              {/* Data Backup & Restore */}
              <div className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-4">
                <h3 className="font-bold text-base">Backup & Restore Portfolio Data</h3>
                <p className="text-xs text-muted-foreground">
                  Export all your projects, work history, custom copy, and theme settings as a single JSON file.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button onClick={exportBackup} variant="outline" className="gap-2 bg-card">
                    <Download className="w-4 h-4 text-primary" />
                    Export Backup (JSON)
                  </Button>

                  <label className="cursor-pointer">
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
                      <Upload className="w-4 h-4 text-primary" />
                      Import Backup (JSON)
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="bg-destructive/10 p-5 rounded-2xl border border-destructive/30 space-y-3">
                <h3 className="font-bold text-base text-destructive">Reset All Data to Defaults</h3>
                <p className="text-xs text-muted-foreground">
                  Clears local storage and restores original portfolio projects and initial settings.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all portfolio data? This will clear local changes.")) {
                      resetToDefaults();
                    }
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to Factory Defaults
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCMSDrawer;
