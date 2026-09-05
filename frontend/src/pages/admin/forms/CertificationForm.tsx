import React, { useState } from "react";
import { certificationsApi, type AdminCertification } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";

interface Props {
  certification: AdminCertification | null;
  onSave: (cert: AdminCertification) => void;
  onClose: () => void;
}

const CertificationForm: React.FC<Props> = ({ certification, onSave, onClose }) => {
  const [title, setTitle] = useState(certification?.title || "");
  const [issuer, setIssuer] = useState(certification?.issuer || "");
  const [year, setYear] = useState(certification?.year || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      if (certification) {
        const r = await certificationsApi.update(certification.id, { title, issuer, year });
        onSave(r.certification);
      } else {
        const r = await certificationsApi.create({ title, issuer, year });
        onSave(r.certification);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{certification ? "Edit Certification" : "Add Certification"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title *</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Certification title..." className="bg-background" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Issuer *</label>
            <Input required value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Issuing organization..." className="bg-background" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year *</label>
            <Input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" className="bg-background" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : certification ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationForm;
