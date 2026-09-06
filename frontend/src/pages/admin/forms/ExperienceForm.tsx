import React, { useState } from "react";
import { experiencesApi, type AdminExperience, type AdminTechnology } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Plus, Trash2 } from "lucide-react";

interface Props {
  experience: AdminExperience | null;
  technologies: AdminTechnology[];
  onSave: (exp: AdminExperience) => void;
  onClose: () => void;
}

const ExperienceForm: React.FC<Props> = ({ experience, technologies, onSave, onClose }) => {
  const [role, setRole] = useState(experience?.role || "");
  const [company, setCompany] = useState(experience?.company || "");
  const [periodStart, setPeriodStart] = useState(experience?.periodStart || "");
  const [periodEnd, setPeriodEnd] = useState(experience?.periodEnd || "");
  const [description, setDescription] = useState(experience?.description || "");
  const [achievements, setAchievements] = useState<string[]>(experience?.achievements?.length ? experience.achievements : [""]);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(experience?.skills.map((s) => s.id) || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true);
    const payload = { role, company, periodStart, periodEnd, description, achievements: achievements.filter((a) => a.trim()), technologyIds: selectedTechIds };
    try {
      if (experience) {
        const r = await experiencesApi.update(experience.id, payload);
        onSave(r.experience as AdminExperience);
      } else {
        const r = await experiencesApi.create(payload);
        onSave(r.experience as AdminExperience);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const toggleTech = (id: string) => setSelectedTechIds((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold">{experience ? "Edit Experience" : "Add Experience"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Role / Position *" required value={role} onChange={setRole} placeholder="Full Stack Developer" />
            <Field label="Company / Organization *" required value={company} onChange={setCompany} placeholder="Company Name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Field label="Period Start" value={periodStart} onChange={setPeriodStart} placeholder="e.g. 2024 (or leave blank)" />
              <p className="text-[11px] text-muted-foreground mt-1">Starting year (e.g. 2024) or single year</p>
            </div>
            <div>
              <Field label="Period End" value={periodEnd} onChange={setPeriodEnd} placeholder="e.g. 2025 or Present (or leave blank)" />
              <p className="text-[11px] text-muted-foreground mt-1">End year, 'Present', or leave blank if single date</p>
            </div>
          </div>
          <FieldArea label="Description" value={description} onChange={setDescription} placeholder="Role summary..." />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Achievements</label>
              <button type="button" onClick={() => setAchievements((p) => [...p, ""])} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
            </div>
            {achievements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <Input value={a} onChange={(e) => { const n = [...achievements]; n[i] = e.target.value; setAchievements(n); }} placeholder={`Achievement ${i + 1}`} className="flex-1 bg-background" />
                <button type="button" onClick={() => setAchievements((p) => p.filter((_, j) => j !== i))} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Technologies / Skills</label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-background rounded-lg border border-border">
              {technologies.map((t) => (
                <button key={t.id} type="button" onClick={() => toggleTech(t.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${selectedTechIds.includes(t.id) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-muted-foreground border-border hover:border-primary/50"}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : experience ? "Update" : "Create"}
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

const FieldArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-background" />
  </div>
);

export default ExperienceForm;
