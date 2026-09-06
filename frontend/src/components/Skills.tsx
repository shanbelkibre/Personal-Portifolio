import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiGit,
  SiGithub,
  SiCplusplus,
  SiPython,
  SiPhp,
  SiFigma
} from "react-icons/si";
import { IconType } from "react-icons";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
  proficiency: string;
}

const skills: Skill[] = [
  { name: "React", icon: SiReact, color: "#61dafb", proficiency: "Expert" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000", proficiency: "Advanced" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06b6d4", proficiency: "Advanced" },
  { name: "HTML5", icon: SiHtml5, color: "#e34f26", proficiency: "Expert" },
  { name: "CSS3", icon: SiCss, color: "#1572b6", proficiency: "Expert" },
  { name: "JavaScript/ES6+", icon: SiJavascript, color: "#f7df1e", proficiency: "Expert" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6", proficiency: "Advanced" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", proficiency: "Advanced" },
  { name: "Express.js", icon: SiExpress, color: "#000000", proficiency: "Advanced" },
  { name: "MySQL", icon: SiMysql, color: "#4479a1", proficiency: "Advanced" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", proficiency: "Intermediate" },
  { name: "MongoDB", icon: SiMongodb, color: "#47a248", proficiency: "Intermediate" },
  { name: "Git", icon: SiGit, color: "#f05032", proficiency: "Expert" },
  { name: "GitHub", icon: SiGithub, color: "#181717", proficiency: "Expert" },
  { name: "Python", icon: SiPython, color: "#3776ab", proficiency: "Intermediate" },
  { name: "PHP", icon: SiPhp, color: "#777bb4", proficiency: "Intermediate" },
  { name: "C++", icon: SiCplusplus, color: "#00599c", proficiency: "Intermediate" },
  { name: "Figma", icon: SiFigma, color: "#f24e1e", proficiency: "Intermediate" },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      <style>{`
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .skill-card {
          animation: pop-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .skill-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
        /* Fix icon colors in dark mode for black icons */
        .dark .icon-black {
          color: #ffffff !important;
        }
      `}</style>

      <div className="container max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-16 text-center tracking-tight reveal-up">
          <span className="text-primary uppercase">TECHNICAL TOOLKIT</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            // Next.js, Express, GitHub are black by default. Invert them in dark mode.
            const isBlackIcon = ["#000000", "#181717"].includes(skill.color);
            const sideClass = index % 2 === 0 ? "reveal-left" : "reveal-right";

            return (
              <div
                key={skill.name}
                className={`skill-card ${sideClass} flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-300 cursor-default group`}
                style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
              >
                <Icon
                  className={`w-12 h-12 md:w-14 md:h-14 mb-4 group-hover:scale-110 transition-transform duration-300 ${isBlackIcon ? 'icon-black' : ''}`}
                  style={{ color: skill.color }}
                />
                <h3 className="text-sm md:text-base font-bold text-foreground text-center mb-1 group-hover:text-primary transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {skill.proficiency}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;

