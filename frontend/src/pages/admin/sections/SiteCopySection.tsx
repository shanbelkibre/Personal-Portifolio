import React, { useEffect, useState } from "react";
import { siteConfigApi, type SiteConfigData } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

const SiteCopySection: React.FC = () => {
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local form state
  const [heroName, setHeroName] = useState("");
  const [heroBadge, setHeroBadge] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroBio, setHeroBio] = useState("");
  const [heroGithub, setHeroGithub] = useState("");
  const [heroLinkedin, setHeroLinkedin] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([""]);

  useEffect(() => {
    siteConfigApi.get().then((r) => {
      const c = r.config;
      setConfig(c);
      if (c) {
        setHeroName(c.heroName || "");
        setHeroBadge(c.heroBadge || "");
        setHeroSubtitle(c.heroSubtitle || "");
        setHeroBio(c.heroBio || "");
        setHeroGithub(c.heroGithub || "");
        setHeroLinkedin(c.heroLinkedin || "");
        setContactEmail(c.contactEmail || "");
        setContactPhone(c.contactPhone || "");
        setContactLocation(c.contactLocation || "");
        setParagraphs(c.paragraphs.length > 0 ? c.paragraphs.map((p) => p.content) : [""]);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteConfigApi.update({
        hero: { name: heroName, badgeText: heroBadge, subtitle: heroSubtitle, bio: heroBio, githubUrl: heroGithub, linkedinUrl: heroLinkedin },
        contact: { email: contactEmail, phone: contactPhone, location: contactLocation },
        about: { paragraphs: paragraphs.filter((p) => p.trim() !== "") },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-muted-foreground">Loading site config...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Site Copy</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit hero, about, and contact information</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-md">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "✓ Saved!" : <><Save className="w-4 h-4" />Save Changes</>}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-base text-primary">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Your Name" value={heroName} onChange={setHeroName} placeholder="Shanbel Kibre" />
          <Field label="Badge Text" value={heroBadge} onChange={setHeroBadge} placeholder="Available for roles..." />
        </div>
        <Field label="Subtitle" value={heroSubtitle} onChange={setHeroSubtitle} placeholder="Software Engineer & Full-Stack Developer" />
        <FieldArea label="Bio" value={heroBio} onChange={setHeroBio} placeholder="Short bio..." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="GitHub URL" value={heroGithub} onChange={setHeroGithub} placeholder="https://github.com/..." />
          <Field label="LinkedIn URL" value={heroLinkedin} onChange={setHeroLinkedin} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-base text-primary">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Email" value={contactEmail} onChange={setContactEmail} placeholder="email@example.com" />
          <Field label="Phone" value={contactPhone} onChange={setContactPhone} placeholder="+1 234 567 890" />
          <Field label="Location" value={contactLocation} onChange={setContactLocation} placeholder="City, Country" />
        </div>
      </div>

      {/* About Paragraphs */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-primary">About Paragraphs</h3>
          <Button size="sm" variant="outline" onClick={() => setParagraphs((prev) => [...prev, ""])} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Paragraph
          </Button>
        </div>
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                rows={3}
                value={p}
                onChange={(e) => { const next = [...paragraphs]; next[i] = e.target.value; setParagraphs(next); }}
                placeholder={`Paragraph ${i + 1}...`}
                className="flex-1 bg-background"
              />
              <Button size="sm" variant="ghost" onClick={() => setParagraphs((prev) => prev.filter((_, j) => j !== i))} className="h-auto self-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-background" />
  </div>
);

const FieldArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
    <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-background" />
  </div>
);

export default SiteCopySection;
