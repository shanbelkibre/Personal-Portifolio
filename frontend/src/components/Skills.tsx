import { Card } from "@/components/ui/card";
import {
  Code2,
  Server,
  Database,
  GitBranch,
  ClipboardList,
  Layers,
} from "lucide-react";

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiGithub,
  SiJira,
  SiCplusplus, // ADD THIS
  // ADD THIS
  SiPython, // ADD THIS
  SiPhp, // ADD THIS
} from "react-icons/si";
import { IconType } from "react-icons";
import { type ComponentType, type SVGProps } from "react";

interface Skill {
  label: string;
  icon: IconType;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { label: "HTML5", icon: SiHtml5, color: "#e34f26" },
      { label: "CSS3", icon: SiCss, color: "#264de4" },
      { label: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { label: "React", icon: SiReact, color: "#61dafb" },
      { label: "Tailwind CSS", icon: SiTailwindcss, color: "#06b6d4" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { label: "Node.js", icon: SiNodedotjs, color: "#8cc84b" },
      { label: "Express.js", icon: SiExpress, color: "#ffffff" },
    ],
  },
  {
    title: "Programming Languages",
    icon: Code2,
    skills: [
      { label: "C++", icon: SiCplusplus, color: "#00599c" },

      { label: "Python", icon: SiPython, color: "#3776ab" },
      { label: "PHP", icon: SiPhp, color: "#777bb4" },
      { label: "DSA", icon: SiJavascript, color: "#f7df1e" },
    ],
  },

  {
    title: "Database",
    icon: Database,
    skills: [
      { label: "MySQL", icon: SiMysql, color: "#00618a" },
      { label: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
      { label: "MongoDB", icon: SiMongodb, color: "#47a248" },
    ],
  },
  {
    title: "Version Control",
    icon: GitBranch,
    skills: [
      { label: "Git", icon: SiGit, color: "#f05032" },
      { label: "GitHub", icon: SiGithub, color: "#ffffff" },
    ],
  },
  {
    title: "Project Management",
    icon: ClipboardList,
    skills: [
      { label: "Jira", icon: SiJira, color: "#0052cc" },
      { label: "Kanban", icon: SiJira, color: "#0052cc" },
      { label: "Scrum", icon: SiJira, color: "#6554c0" },
    ],
  },
  {
    title: "Design Tools",
    icon: Layers,
    skills: [
      { label: "Enterprise Arch.", icon: SiJira, color: "#f0a500" },
      { label: "StarUML", icon: SiJira, color: "#9c27b0" },
      { label: "Visual Paradigm", icon: SiJira, color: "#1565c0" },
    ],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <style>{`
        @keyframes skill-pop {
          from { opacity: 0; transform: scale(0.82) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .skill-chip {
          animation: skill-pop 0.5s ease-out both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .skill-chip:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        @media (prefers-reduced-motion: reduce) {
          .skill-chip { animation: none !important; }
        }
      `}</style>

      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Technical <span className="text-gradient">Skills</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            const skillOffset = skillCategories
              .slice(0, catIndex)
              .reduce((acc, c) => acc + c.skills.length, 0);

            return (
              <Card
                key={category.title}
                className="p-8 bg-card border-border card-glow hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${catIndex * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 rounded-full bg-primary/10 shadow-sm">
                    <CategoryIcon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-2xl font-bold">{category.title}</h3>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {category.skills.map((skill, skillIndex) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={skill.label}
                          role="img"
                          aria-label={skill.label}
                          tabIndex={0}
                          className="skill-chip flex items-center gap-2 bg-secondary/80 rounded-lg px-3 py-2 shadow-md cursor-default focus:outline-none focus:ring-2 focus:ring-primary/50"
                          style={{
                            animationDelay: `${(skillOffset + skillIndex) * 0.07}s`,
                          }}
                        >
                          <Icon
                            style={{
                              color: skill.color,
                              width: "1.2rem",
                              height: "1.2rem",
                              flexShrink: 0,
                            }}
                          />
                          <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
                            {skill.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
