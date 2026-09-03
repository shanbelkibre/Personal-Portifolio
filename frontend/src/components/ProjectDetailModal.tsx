import React from "react";
import { Project, useCMS } from "@/context/CMSContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, CheckCircle2, Sparkles, Edit, Layers } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { isAdminLoggedIn, setIsCMSDrawerOpen } = useCMS();

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl backdrop-blur-2xl p-0 overflow-hidden">
        {/* Cover Image Header with Gradient Overlay */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden bg-black/40">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />

          {project.category && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-md backdrop-blur-md">
              {project.category}
            </span>
          )}

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Tech stack badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Technologies & Architecture
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Project Overview</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Features Bullet List */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3 bg-secondary/30 p-5 rounded-xl border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Key Capabilities & Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-foreground/90">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions & Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-3">
              {project.github && (
                <Button asChild size="default" variant="secondary" className="gap-2 shadow-sm">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                </Button>
              )}

              {project.demo && (
                <Button asChild size="default" className="gap-2 shadow-md">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo Preview
                  </a>
                </Button>
              )}
            </div>

            {isAdminLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  setIsCMSDrawerOpen(true);
                  if (onEdit) onEdit(project);
                }}
                className="gap-1.5 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit in CMS
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
