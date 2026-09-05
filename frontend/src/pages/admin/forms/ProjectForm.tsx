import React, { useState, useEffect } from "react";
import { projectsApi, type AdminProject, type AdminCategory, type AdminTechnology } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Plus, Trash2 } from "lucide-react";

interface Props {
  project: AdminProject | null;
  categories: AdminCategory[];
  technologies: AdminTechnology[];
  onSave: (project: AdminProject) => void;
  onClose: () => void;
}

const ProjectForm: React.FC<Props> = ({ project, categories, technologies, onSave, onClose }) => {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [longDescription, setLongDescription] = useState(project?.longDescription || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || "");
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || "");
  const [categoryId, setCategoryId] = useState(project?.category?.id || "");
  const [featured, setFeatured] = useState(project?.featured || false);
  const [features, setFeatures] = useState<string[]>(project?.features?.length ? project.features : [""]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(project?.technologies.map((t) => t.id) || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true);
    const payload = { title, description, longDescription, githubUrl, demoUrl, imageUrl, categoryId: categoryId || undefined, featured, features: features.filter((f) => f.trim()), technologyIds: selectedTechIds };
    try {
      if (project) {
        const r = await projectsApi.update(project.id, payload);
        onSave(r.project as AdminProject);
      } else {
        const r = await projectsApi.create(payload);
        onSave(r.project as AdminProject);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const toggleTech = (id: string) => {
    setSelectedTechIds((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold">{project ? "Edit Project" : "Add New Project"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>}

          <Field label="Title *" required value={title} onChange={setTitle} placeholder="Project title" />
          <FieldArea label="Short Description *" required value={description} onChange={setDescription} placeholder="Brief description..." />
          <FieldArea label="Long Description" value={longDescription} onChange={setLongDescription} placeholder="Detailed description..." rows={4} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub URL" value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/..." />
            <Field label="Demo URL" value={demoUrl} onChange={setDemoUrl} placeholder="https://..." />
          </div>
          <Field label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-primary" />
              <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">Featured project</label>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Features</label>
              <button type="button" onClick={() => setFeatures((prev) => [...prev, ""])} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
            </div>
            {features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input value={f} onChange={(e) => { const next = [...features]; next[i] = e.target.value; setFeatures(next); }} placeholder={`Feature ${i + 1}`} className="flex-1 bg-background" />
                <button type="button" onClick={() => setFeatures((prev) => prev.filter((_, j) => j !== i))} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Technologies</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-background rounded-lg border border-border">
              {technologies.map((t) => (
                <button key={t.id} type="button" onClick={() => toggleTech(t.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${selectedTechIds.includes(t.id) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/50"}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }> = ({ label, value, onChange, placeholder, required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    <Input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-background" />
  </div>
);

const FieldArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; required?: boolean }> = ({ label, value, onChange, placeholder, rows = 2, required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    <Textarea required={required} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-background" />
  </div>
);

export default ProjectForm;
