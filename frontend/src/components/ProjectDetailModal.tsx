import React from "react";
import { useNavigate } from "react-router-dom";
import { Project, useCMS } from "@/context/CMSContext";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  CheckCircle2,
  Sparkles,
  Edit,
  Layers,
  AlertCircle,
  Lightbulb,
  Code2,
  BookOpen,
} from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { isAdminLoggedIn } = useCMS();
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[88vh] bg-card border-border shadow-2xl backdrop-blur-2xl p-0 overflow-y-auto rounded-2xl flex flex-col">
        {/* Modal Header Frame */}
        <div className="p-4 sm:p-6 pb-2">
          {/* Framed Image Container with Full Visibility */}
          <div className="relative w-full rounded-xl bg-white dark:bg-neutral-900 border border-border/70 p-2 sm:p-3 shadow-sm flex items-center justify-center overflow-hidden min-h-[180px] max-h-[220px]">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[200px] max-w-full w-auto h-auto object-contain rounded-lg"
              />
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                <Code2 className="w-10 h-10 stroke-1" />
              </div>
            )}
          </div>

          {/* Project Title */}
          <div className="pt-4 pb-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-4 sm:p-6 pt-1 space-y-5">
          {/* Tech Stack Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground/75 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-primary" />
              Technologies & Stack Architecture
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-primary/10 text-primary border border-primary/25 rounded-lg text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="bg-amber-500/10 dark:bg-amber-950/25 border border-amber-500/30 rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              The Problem & Challenge
            </div>
            <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
              {project.problemStatement ||
                `In this domain, users encountered significant hurdles with fragmented workflows, lack of transparent verified data, and inefficient communication channels between stakeholders.`}
            </p>
          </div>

          {/* Solution & Implementation Card */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/25 rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Lightbulb className="w-4 h-4 flex-shrink-0" />
              How It Was Solved (Technical Architecture & Solution)
            </div>
            <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
              {project.solution ||
                `Architected a modular full-stack solution featuring role-based workflows, dynamic filtering, secure API endpoints, and responsive user interfaces to streamline operations seamlessly.`}
            </p>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-2 bg-secondary/20 p-4 sm:p-5 rounded-xl border border-border">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <BookOpen className="w-4 h-4 text-primary" />
              Detailed Project Overview
            </div>
            <p className="text-foreground/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Features Bullet List */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3 bg-secondary/30 dark:bg-secondary/20 p-4 sm:p-5 rounded-xl border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Key Capabilities & Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 leading-normal">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-3">
              {project.demo && (
                <Button asChild size="default" className="gap-2 shadow-md">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Open Live Demo
                  </a>
                </Button>
              )}

              {project.github && (
                <Button asChild size="default" variant="secondary" className="gap-2 shadow-sm">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View GitHub Code
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
                  navigate("/admin");
                }}
                className="gap-1.5 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit in Admin CMS
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
