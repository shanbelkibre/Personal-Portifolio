import { useCMS } from "@/context/CMSContext";
import {
  Code2,
  Server,
  Database,
  ShieldCheck,
  Sparkles,
  Users,
  GraduationCap,
  MapPin,
  Briefcase,
} from "lucide-react";

const WHAT_I_BRING = [
  { icon: Code2, label: "Frontend Architecture", desc: "React, Next.js, Tailwind CSS" },
  { icon: Server, label: "Backend Engineering", desc: "Node.js, Express, NestJS, Laravel" },
  { icon: Database, label: "Database Design", desc: "PostgreSQL, MySQL, MongoDB" },
  { icon: ShieldCheck, label: "Security & Pentesting", desc: "Vulnerability Assessment & Defense" },
  { icon: Sparkles, label: "Clean Code", desc: "Maintainable & Scalable Solutions" },
  { icon: Users, label: "Team Player", desc: "Agile, Git & Effective Communication" },
];

const INTERESTS = [
  "Full Stack Web Development & Progressive Web Apps",
  "Cybersecurity, Threat Analysis & Penetration Testing",
  "Scalable Database Architecture & RESTful API Design",
  "Hackathons & Competitive Engineering",
  "Open Source Contributions & Modern Cloud Workflows",
];

const About = () => {
  const { about } = useCMS();

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Learn more about my journey, skills, and goals as a software engineer and cybersecurity enthusiast.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Card: My Story & Personal Info */}
          <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-primary/40 transition-colors duration-300">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                My Story
              </h3>

              {/* Dynamic Paragraphs from CMS */}
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                {about.paragraphs && about.paragraphs.length > 0 ? (
                  about.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-foreground/85">
                      {p}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-foreground/85">
                      I'm <strong className="text-foreground">Shanbel Kibre</strong>, a Software Engineer & Full-Stack Developer with hands-on expertise in <strong className="text-foreground">cybersecurity and penetration testing</strong>.
                    </p>
                    <p className="text-foreground/85">
                      My main focus is engineering scalable, resilient, and user-centric web applications using modern stacks such as <strong className="text-foreground">React, Next.js, Node.js, Express, NestJS, Restful API, MySQL, and PostgreSQL</strong>.
                    </p>
                    <p className="text-foreground/85">
                      Recognized as <strong className="text-foreground">3rd Place Winner</strong> in the DBU Hackathon and a participant in the <strong className="text-foreground">INSA Talent Summer Camp</strong>.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Metadata Info Grid with Hover Effects */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 cursor-default group">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-medium">Education</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">BSc Software Engineering (DBU)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 cursor-default group">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-medium">Location</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">Addis Ababa & Debre Birhan, ET</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 cursor-default group">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-medium">Specialization</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">Full-Stack & Security</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 cursor-default group">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-medium">Status</span>
                  <span className="font-semibold text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm">Available for Opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Interests, Goals & What I Bring */}
          <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-primary/40 transition-colors duration-300">
            <div>
              {/* Interests & Goals */}
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-5">
                Interests & Goals
              </h3>

              <ul className="space-y-3 mb-8">
                {INTERESTS.map((interest, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-foreground/85 hover:text-primary hover:translate-x-1 transition-all duration-200 cursor-default group"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-125 transition-transform duration-200 shadow-sm" />
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>

              {/* What I Bring Sub-section */}
              <div className="pt-5 border-t border-border/60">
                <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  What I Bring
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WHAT_I_BRING.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60 hover:bg-secondary/80 hover:border-primary/50 hover:scale-[1.03] hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-default group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

