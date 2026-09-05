import { Github, Linkedin, Download } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import profilePdf from "@/assets/profile.pdf";
import { useCMS } from "@/context/CMSContext";

const Hero = () => {
  const { hero } = useCMS();

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden pb-20"
      style={{
        minHeight: "100vh",
        paddingTop: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="container max-w-6xl mx-auto px-6 py-8 md:py-12">
        {/* On mobile screens: Image is order-1 (ABOVE), Text is order-2 (BELOW) */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Profile Image Container — ALWAYS order-1 on mobile & desktop */}
          <div
            className="order-1 w-full max-w-sm lg:w-5/12 flex justify-center"
            style={{ animation: "hero-fade-in 0.7s ease-out both" }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(1.15)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)",
                  filter: "blur(48px)",
                  transform: "scale(1.3)",
                }}
              />
              <img
                src={hero.profileImage || profileImg}
                alt={hero.name}
                className="relative w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 rounded-full object-cover border-4 border-primary/40 shadow-2xl"
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
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-secondary/60 rounded-full border border-primary/25 shadow-md"
              style={{ animation: "hero-fade-in 0.5s ease-out both" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {hero.badgeText}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.1s both" }}
            >
              Hi, I'm{" "}
              <span className="text-gradient">{hero.name}</span>
            </h1>

            <p
              className="text-lg sm:text-2xl font-bold text-primary/90 mb-4"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.2s both" }}
            >
              {hero.subtitle}
            </p>

            <p
              className="text-sm sm:text-base md:text-lg text-foreground/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.3s both" }}
            >
              {hero.bio}
            </p>

            <div
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.4s both" }}
            >
              {/* CTA Buttons — same hover style as social icons */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border text-foreground font-semibold text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                Get in Touch
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border text-foreground font-semibold text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                View Projects
              </a>

              <a
                href={profilePdf}
                target="_blank"
                rel="noopener noreferrer"
                title="View / Download Resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border text-foreground font-semibold text-sm hover:bg-primary/20 hover:text-primary hover:border-primary/50 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 shadow-sm"
              >
                <Download className="w-4 h-4" />
                View Resume
              </a>
            </div>

            <div
              className="flex gap-4 justify-center lg:justify-start"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.5s both" }}
            >
              {hero.githubUrl && (
                <a
                  href={hero.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="p-3 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200 hover:scale-110 hover:shadow-lg shadow-sm border border-border"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}

              {hero.linkedinUrl && (
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-3 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-200 hover:scale-110 hover:shadow-lg shadow-sm border border-border"
                >
                  <Linkedin className="w-5 h-5" />
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 group"
      >
        {/* Mouse body */}
        <div className="w-6 h-10 rounded-full border-2 border-primary/60 group-hover:border-primary transition-colors duration-300 flex items-start justify-center pt-1.5">
          {/* Scroll wheel dot */}
          <div
            className="w-1 h-2 bg-primary/80 rounded-full"
            style={{
              animation: "mouse-scroll 1.6s ease-in-out infinite",
            }}
          />
        </div>
        {/* Label */}
        <span className="text-[10px] font-medium text-muted-foreground/70 group-hover:text-primary tracking-widest uppercase transition-colors duration-300">
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
          50% { transform: translateY(-14px); }
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
