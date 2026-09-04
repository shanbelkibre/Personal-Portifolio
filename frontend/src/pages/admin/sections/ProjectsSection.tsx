import React, { useEffect, useState } from "react";
import { projectsApi, categoriesApi, technologiesApi, type AdminProject, type AdminCategory, type AdminTechnology } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Search, ExternalLink, Github } from "lucide-react";
import ProjectForm from "../forms/ProjectForm";

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [technologies, setTechnologies] = useState<AdminTechnology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<AdminProject | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, tRes] = await Promise.all([projectsApi.getAll(), categoriesApi.getAll(), technologiesApi.getAll()]);
      setProjects(pRes.projects);
      setCategories(cRes.categories);
      setTechnologies(tRes.technologies);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category?.id === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(id);
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = (project: AdminProject) => {
    if (editProject) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects((prev) => [project, ...prev]);
    }
    setFormOpen(false);
    setEditProject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio</p>
        </div>
        <Button onClick={() => { setEditProject(null); setFormOpen(true); }} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <p className="text-lg font-medium">No projects found</p>
          <p className="text-sm">Try adjusting your search or add a new project.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:border-primary/30 transition-all group">
              <div className="flex flex-col sm:flex-row gap-4">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="w-full sm:w-24 h-20 object-cover rounded-lg border border-border flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base leading-tight">{project.title}</h3>
                    {project.featured && <Badge className="text-[10px] gap-1 bg-amber-500/20 text-amber-400 border-amber-500/30"><Star className="w-2.5 h-2.5" /> Featured</Badge>}
                    {project.category && <Badge variant="outline" className="text-[10px] text-primary border-primary/30">{project.category.name}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span key={t.id} className="px-1.5 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded font-medium">{t.name}</span>
                    ))}
                    {project.technologies.length > 5 && <span className="px-1.5 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded">+{project.technologies.length - 5} more</span>}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                  {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><ExternalLink className="w-4 h-4" /></a>}
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Github className="w-4 h-4" /></a>}
                  <Button size="sm" variant="outline" onClick={() => { setEditProject(project); setFormOpen(true); }} className="gap-1.5 h-8 text-xs">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" disabled={deleting === project.id} onClick={() => handleDelete(project.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <ProjectForm
          project={editProject}
          categories={categories}
          technologies={technologies}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditProject(null); }}
        />
      )}
    </div>
  );
};

export default ProjectsSection;
