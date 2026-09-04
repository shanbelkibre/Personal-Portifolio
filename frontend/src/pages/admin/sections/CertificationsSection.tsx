import React, { useEffect, useState } from "react";
import { certificationsApi, type AdminCertification } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import CertificationForm from "../forms/CertificationForm";

const CertificationsSection: React.FC = () => {
  const [certs, setCerts] = useState<AdminCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCertification | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await certificationsApi.getAll();
      setCerts(res.certifications);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    setDeleting(id);
    try { await certificationsApi.delete(id); setCerts((prev) => prev.filter((c) => c.id !== id)); }
    catch { alert("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const handleSave = (cert: AdminCertification) => {
    if (editItem) setCerts((prev) => prev.map((c) => (c.id === cert.id ? cert : c)));
    else setCerts((prev) => [cert, ...prev]);
    setFormOpen(false); setEditItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Certifications</h2>
          <p className="text-sm text-muted-foreground mt-1">{certs.length} certification{certs.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Certification
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>
      ) : certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <p>No certifications added yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((cert) => (
            <div key={cert.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                    <span className="text-xs text-primary font-medium">{cert.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => { setEditItem(cert); setFormOpen(true); }} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" disabled={deleting === cert.id} onClick={() => handleDelete(cert.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <CertificationForm certification={editItem} onSave={handleSave} onClose={() => { setFormOpen(false); setEditItem(null); }} />
      )}
    </div>
  );
};

export default CertificationsSection;
