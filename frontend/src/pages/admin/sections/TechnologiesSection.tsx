import React, { useEffect, useState } from "react";
import { technologiesApi, type AdminTechnology } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

const TechnologiesSection: React.FC = () => {
  const [techs, setTechs] = useState<AdminTechnology[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await technologiesApi.getAll(); setTechs(r.technologies); } catch { /**/ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const r = await technologiesApi.create(newName.trim());
      setTechs((prev) => [...prev, r.technology].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(""); setAdding(false);
    } catch { alert("Failed to add technology"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const r = await technologiesApi.update(id, editName.trim());
      setTechs((prev) => prev.map((t) => (t.id === id ? r.technology : t)));
      setEditId(null);
    } catch { alert("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, usageCount: number) => {
    if (usageCount > 0 && !confirm(`This technology is used in ${usageCount} project(s)/experience(s). Delete anyway?`)) return;
    else if (usageCount === 0 && !confirm("Delete this technology?")) return;
    setDeleting(id);
    try { await technologiesApi.delete(id); setTechs((prev) => prev.filter((t) => t.id !== id)); }
    catch { alert("Failed to delete"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Technologies</h2>
          <p className="text-sm text-muted-foreground mt-1">{techs.length} technolog{techs.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Button onClick={() => setAdding(true)} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Technology
        </Button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 bg-card border border-primary/30 p-3 rounded-xl">
          <Input autoFocus placeholder="Technology name..." value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewName(""); } }}
            className="flex-1" />
          <Button size="sm" onClick={handleAdd} disabled={saving || !newName.trim()} className="gap-1">
            <Check className="w-4 h-4" /> Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(""); }}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {techs.map((tech) => (
            <div key={tech.id} className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all flex items-center justify-between gap-2">
              {editId === tech.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(tech.id); if (e.key === "Escape") setEditId(null); }}
                    className="h-7 text-sm" />
                  <Button size="sm" onClick={() => handleUpdate(tech.id)} disabled={saving} className="h-7 px-2"><Check className="w-3 h-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="h-7 px-2"><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate">{tech.name}</span>
                    {tech._count && (tech._count.projects + tech._count.experiences) > 0 && (
                      <Badge variant="outline" className="text-[10px] flex-shrink-0">{tech._count.projects + tech._count.experiences} uses</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => { setEditId(tech.id); setEditName(tech.name); }} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" disabled={deleting === tech.id} onClick={() => handleDelete(tech.id, (tech._count?.projects ?? 0) + (tech._count?.experiences ?? 0))} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnologiesSection;
