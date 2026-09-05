import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye, Edit, Plus } from "lucide-react";
import { useCMS, Project } from "@/context/CMSContext";
import ProjectDetailModal from "@/components/ProjectDetailModal";

const Projects = () => {
  const { projects, isAdminLoggedIn, setIsCMSDrawerOpen } = useCMS();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <style>{`
        .project-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 80px hsl(var(--primary) / 0.25);
        }
        .project-image-overlay {
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.75) 100%
          );
          transition: background 0.4s ease;
        }
        .project-card:hover .project-image-overlay {
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.4) 0%,
            rgba(0,0,0,0.85) 100%
          );
        }
        .project-title-overlay {
          transform: translateY(0px);
          transition: transform 0.4s ease;
        }
        .project-card:hover .project-title-overlay {
          transform: translateY(-2px);
        }
        .project-hover-info {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          position: absolute;
          bottom: 48px;
          left: 0;
          right: 0;
          padding: 0 1rem;
        }
        .project-card:hover .project-hover-info {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes card-fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate {
          animation: card-fade-in 0.5s ease-out both;
        }
        .image-zoom {
          transition: transform 0.6s ease;
        }
        .project-card:hover .image-zoom {
          transform: scale(1.08);
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center sm:text-left w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-primary uppercase">FEATURED </span><span className="text-gradient uppercase">PROJECTS</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Click any project card to view full technical architecture and feature breakdown.
            </p>
          </div>

          {isAdminLoggedIn && (
            <Button
              onClick={() => setIsCMSDrawerOpen(true)}
              className="gap-2 shrink-0 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Project (CMS)
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={project.id || project.title}
              className="project-card card-animate flex flex-col border-border overflow-hidden p-0 cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image section */}
              <div
                className="relative w-full flex-shrink-0 overflow-hidden"
                style={{ height: "240px" }}
              >
                {/* Background Image */}
                <div
                  className="image-zoom absolute inset-0"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Gradient overlay */}
                <div className="project-image-overlay absolute inset-0" />

                {/* Tech tags on hover */}
                <div className="project-hover-info">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-xs font-semibold text-white backdrop-blur-sm"
                        style={{ background: "hsl(var(--primary) / 0.85)" }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category tag */}
                {project.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-background/80 text-primary border border-primary/30 backdrop-blur-md">
                    {project.category}
                  </span>
                )}

                {/* Card Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3
                    className="project-title-overlay text-white font-black leading-tight"
                    style={{
                      fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                      textShadow:
                        "0 2px 16px rgba(0,0,0,1), 0 1px 4px rgba(0,0,0,1)",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-grow bg-card">
                <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
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
          ))}
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
