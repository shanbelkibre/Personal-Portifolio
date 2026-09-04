import React, { useEffect, useState } from "react";
import { experiencesApi, technologiesApi, type AdminExperience, type AdminTechnology } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Building2 } from "lucide-react";
import ExperienceForm from "../forms/ExperienceForm";

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [technologies, setTechnologies] = useState<AdminTechnology[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminExperience | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, tRes] = await Promise.all([experiencesApi.getAll(), technologiesApi.getAll()]);
      setExperiences(eRes.experiences);
      setTechnologies(tRes.technologies);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    setDeleting(id);
    try {
      await experiencesApi.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch { alert("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const handleSave = (exp: AdminExperience) => {
    if (editItem) setExperiences((prev) => prev.map((e) => (e.id === exp.id ? exp : e)));
    else setExperiences((prev) => [exp, ...prev]);
    setFormOpen(false); setEditItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">{experiences.length} experience item{experiences.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
          <p className="text-lg font-medium">No experience added yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base">{exp.role}</h3>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30 gap-1">
                      <Calendar className="w-2.5 h-2.5" />{exp.periodStart} – {exp.periodEnd}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-primary/80 flex items-center gap-1 mb-2">
                    <Building2 className="w-3.5 h-3.5" />{exp.company}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.skills.slice(0, 6).map((s) => (
                      <span key={s.id} className="px-1.5 py-0.5 text-[10px] bg-secondary text-secondary-foreground rounded">{s.name}</span>
                    ))}
                    {exp.skills.length > 6 && <span className="px-1.5 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded">+{exp.skills.length - 6}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditItem(exp); setFormOpen(true); }} className="gap-1.5 h-8 text-xs">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" disabled={deleting === exp.id} onClick={() => handleDelete(exp.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ExperienceForm experience={editItem} technologies={technologies} onSave={handleSave} onClose={() => { setFormOpen(false); setEditItem(null); }} />
      )}
    </div>
  );
};

export default ExperienceSection;
