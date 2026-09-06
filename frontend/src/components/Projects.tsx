import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useCMS, Project } from "@/context/CMSContext";
import ProjectDetailModal from "@/components/ProjectDetailModal";

const Projects = () => {
  const { projects } = useCMS();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20">
      <style>{`
        /* ── Card container ── */
        .project-card {
          transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.4s ease,
            border-color 0.3s ease,
            opacity 0.3s ease;
          will-change: transform;
          position: relative;
        }

        /* Lift + glow shadow + border highlight on hover */
        .project-card:hover {
          transform: translateY(-12px) scale(1.015);
          box-shadow:
            0 0 0 1.5px hsl(var(--primary) / 0.5),
            0 20px 60px hsl(var(--primary) / 0.22),
            0 8px 24px rgba(0,0,0,0.35);
          border-color: hsl(var(--primary) / 0.5);
        }

        /* Dim siblings when one card is hovered */
        .projects-grid:hover .project-card:not(:hover) {
          opacity: 0.72;
          transform: translateY(0) scale(0.98);
        }

        /* ── Shimmer sweep on hover ── */
        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            hsl(var(--primary) / 0.08) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          z-index: 1;
          pointer-events: none;
          border-radius: inherit;
        }
        .project-card:hover::before {
          transform: translateX(100%);
        }

        /* ── Image zooms in smoothly ── */
        .image-zoom {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .project-card:hover .image-zoom {
          transform: scale(1.05);
        }

        /* ── Title color shift on hover ── */
        .project-title-text {
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .project-card:hover .project-title-text {
          color: hsl(var(--primary));
          transform: translateX(2px);
        }

        /* ── Card body description color shift ── */
        .project-card .project-desc {
          transition: color 0.3s ease;
        }
        .project-card:hover .project-desc {
          color: hsl(var(--foreground));
        }

        /* ── Tech badge glow on hover ── */
        .project-card .tech-badge {
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .project-card:hover .tech-badge {
          background: hsl(var(--primary) / 0.22);
          color: hsl(var(--primary));
          transform: translateY(-1px);
        }

        /* ── Entrance animation ── */
        @keyframes card-fade-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate {
          animation: card-fade-in 0.55s ease-out both;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 reveal-up">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-primary uppercase">FEATURED </span><span className="text-gradient uppercase">PROJECTS</span>
          </h2>
          <p className="text-sm text-foreground/70 mt-3 max-w-2xl mx-auto">
            Click any project card to view full technical architecture and feature breakdown.
          </p>
        </div>

        <div className="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const sideClass = index % 2 === 0 ? "reveal-left" : "reveal-right";
            return (
              <Card
                key={project.id || project.title}
                className={`project-card ${sideClass} flex flex-col border-border overflow-hidden p-0 cursor-pointer group`}
                style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                onClick={() => setSelectedProject(project)}
              >
              {/* Image Frame with Margin and White Padding (Full image visible, not cropped) */}
              <div className="p-3.5 sm:p-4 pb-0">
                <div
                  className="relative w-full rounded-xl bg-white dark:bg-card border border-border/60 p-2 sm:p-3 shadow-sm flex items-center justify-center overflow-hidden"
                  style={{ height: "220px" }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="image-zoom max-h-full max-w-full w-full h-full object-contain rounded-lg"
                  />

                  {/* Category tag */}
                  {project.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-background/90 text-primary border border-primary/30 backdrop-blur-md shadow-sm">
                      {project.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow bg-card">
                <h3 className="project-title-text text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                  {project.title}
                </h3>
                <p className="project-desc text-foreground/75 mb-6 flex-grow text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="tech-badge px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 text-xs font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      View Details
                    </Button>

                    {project.demo && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                        asChild
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Demo
                        </a>
                      </Button>
                    )}

                    {project.github && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        asChild
                        title="GitHub Code"
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
