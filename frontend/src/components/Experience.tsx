import React from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Award, Calendar, CheckCircle2, ShieldAlert } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export const Experience: React.FC = () => {
  const { experiences, certifications } = useCMS();

  return (
    <section id="experience" className="py-20 bg-background relative">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="text-primary uppercase">WORK HISTORY & </span><span className="text-gradient uppercase">EXPERIENCE</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Practical full-stack development, software engineering, and cybersecurity experience (2024 – 2026).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Experience Timeline Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-primary">PROFESSIONAL WORK HISTORY</h3>
                <p className="text-xs text-muted-foreground">Full-Stack Development Projects & Roles</p>
              </div>
            </div>

            <div className="relative border-l-2 border-primary/30 ml-4 pl-6 md:pl-8 space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline node icon */}
                  <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <Card className="p-6 bg-card border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.role}
                        </h4>
                        <p className="text-sm font-semibold text-primary/90">{exp.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground/80 border border-border shrink-0 self-start sm:self-center">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Key Achievements Bullet points */}
                    <div className="space-y-2 mb-4 bg-secondary/30 p-4 rounded-lg border border-border/50">
                      {exp.achievements.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-foreground/90">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Education Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Education</h3>
              </div>

              <Card className="p-6 bg-card border-border shadow-md">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Degree Program
                </span>
                <h4 className="text-base font-bold text-foreground mt-1">
                  B.Sc. in Software Engineering
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curriculum: Harmonized Modular
                </p>
                <p className="text-sm font-medium text-foreground/80 mt-2">
                  Debre Birhan University
                </p>
              </Card>
            </div>

            {/* Certifications Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Certifications & Awards</h3>
              </div>

              <div className="space-y-3">
                {certifications.map((cert) => (
                  <Card
                    key={cert.id}
                    className="p-4 bg-card border-border hover:border-primary/40 transition-all flex items-start gap-3 shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-foreground leading-snug">
                        {cert.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
