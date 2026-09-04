import React, { useEffect, useState } from "react";
import { categoriesApi, type AdminCategory } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";

const CategoriesSection: React.FC = () => {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await categoriesApi.getAll(); setCats(r.categories); } catch { /**/ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const r = await categoriesApi.create(newName.trim());
      setCats((prev) => [...prev, r.category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName(""); setAdding(false);
    } catch { alert("Failed to add category"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const r = await categoriesApi.update(id, editName.trim());
      setCats((prev) => prev.map((c) => (c.id === id ? r.category : c)));
      setEditId(null);
    } catch { alert("Failed to update"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, count: number) => {
    const msg = count > 0 ? `This category is used by ${count} project(s). Projects will become uncategorized. Delete?` : "Delete this category?";
    if (!confirm(msg)) return;
    setDeleting(id);
    try { await categoriesApi.delete(id); setCats((prev) => prev.filter((c) => c.id !== id)); }
    catch { alert("Failed to delete"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">{cats.length} categor{cats.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Button onClick={() => setAdding(true)} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {adding && (
        <div className="flex items-center gap-2 bg-card border border-primary/30 p-3 rounded-xl">
          <Input autoFocus placeholder="Category name..." value={newName} onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewName(""); } }}
            className="flex-1" />
          <Button size="sm" onClick={handleAdd} disabled={saving || !newName.trim()} className="gap-1"><Check className="w-4 h-4" />Save</Button>
          <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(""); }}><X className="w-4 h-4" /></Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cats.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-all flex items-center justify-between gap-2">
              {editId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(cat.id); if (e.key === "Escape") setEditId(null); }}
                    className="h-7 text-sm" />
                  <Button size="sm" onClick={() => handleUpdate(cat.id)} disabled={saving} className="h-7 px-2"><Check className="w-3 h-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)} className="h-7 px-2"><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{cat.name}</span>
                    {cat._count && cat._count.projects > 0 && <Badge variant="outline" className="text-[10px]">{cat._count.projects} project{cat._count.projects !== 1 ? "s" : ""}</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="h-7 w-7 text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></Button>
                    <Button size="sm" variant="ghost" disabled={deleting === cat.id} onClick={() => handleDelete(cat.id, cat._count?.projects ?? 0)} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
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

export default CategoriesSection;
