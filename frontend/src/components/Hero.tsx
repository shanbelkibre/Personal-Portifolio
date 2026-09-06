import { Github, Linkedin, Download } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import profilePdf from "@/assets/profile.pdf";
import { useCMS } from "@/context/CMSContext";

const Hero = () => {
  const { hero } = useCMS();

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden flex items-center justify-center pt-16 md:pt-16 pb-12 min-h-screen"
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30 dark:opacity-100"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none opacity-30 dark:opacity-100"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container max-w-6xl mx-auto px-6 py-0">
        {/* On mobile screens: Image is order-1 (ABOVE), Text is order-2 (BELOW) */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
          {/* Profile Image Container — ALWAYS order-1 on mobile & desktop */}
          <div
            className="order-1 w-full max-w-md lg:w-5/12 flex justify-center"
            style={{ animation: "hero-fade-in 0.7s ease-out both" }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full opacity-50 dark:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(1.12)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full opacity-40 dark:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)",
                  filter: "blur(48px)",
                  transform: "scale(1.25)",
                }}
              />
              <img
                src={hero.profileImage || profileImg}
                alt={hero.name}
                className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[350px] lg:h-[350px] xl:w-[380px] xl:h-[380px] aspect-square rounded-full object-cover object-top border-4 border-primary/40 shadow-2xl"
                style={{
                  boxShadow:
                    "0 8px 32px hsl(var(--primary) / 0.3), 0 24px 64px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--primary) / 0.1)",
                  animation: "float 6s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Hero Content Text Container — order-2 on mobile & desktop */}
          <div className="order-2 w-full lg:w-7/12 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 bg-secondary/80 dark:bg-secondary/60 rounded-full border border-border/80 dark:border-primary/25 shadow-sm"
              style={{ animation: "hero-fade-in 0.5s ease-out both" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {hero.badgeText}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 tracking-tight text-foreground"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.1s both" }}
            >
              Hi, I'm{" "}
              <span className="text-gradient">{hero.name}</span>
            </h1>

            <p
              className="text-base sm:text-xl lg:text-2xl font-bold text-primary dark:text-primary mb-3"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.2s both" }}
            >
              {hero.subtitle}
            </p>

            <p
              className="text-sm sm:text-base text-foreground/80 mb-5 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.3s both" }}
            >
              {hero.bio}
            </p>

            <div
              className="flex flex-wrap gap-2.5 sm:gap-3 justify-center lg:justify-start mb-5"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.4s both" }}
            >
              {/* CTA Buttons — same hover style as social icons */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                Get in Touch
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                View Projects
              </a>

              <a
                href={profilePdf}
                target="_blank"
                rel="noopener noreferrer"
                title="View / Download Resume"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                View Resume
              </a>
            </div>

            <div
              className="flex gap-3 justify-center lg:justify-start"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.5s both" }}
            >
              {hero.githubUrl && (
                <a
                  href={hero.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="p-2.5 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200 hover:scale-110 hover:shadow-lg shadow-sm border border-border"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {hero.linkedinUrl && (
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-2.5 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200 hover:scale-110 hover:shadow-lg shadow-sm border border-border"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mouse scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll down"
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group"
      >
        {/* Mouse body */}
        <div className="w-5 h-8 rounded-full border-2 border-primary/60 group-hover:border-primary transition-colors duration-300 flex items-start justify-center pt-1">
          {/* Scroll wheel dot */}
          <div
            className="w-1 h-1.5 bg-primary/80 rounded-full"
            style={{
              animation: "mouse-scroll 1.6s ease-in-out infinite",
            }}
          />
        </div>
        {/* Label */}
        <span className="text-[9px] font-medium text-muted-foreground/70 group-hover:text-primary tracking-widest uppercase transition-colors duration-300">
          Scroll
        </span>
      </a>

      <style>{`
        @keyframes mouse-scroll {
          0%   { transform: translateY(0);    opacity: 1; }
          60%  { transform: translateY(10px); opacity: 0; }
          61%  { transform: translateY(-4px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
