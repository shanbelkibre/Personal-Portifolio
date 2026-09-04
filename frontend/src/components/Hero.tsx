import { Github, Linkedin, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile.jpg";
import profilePdf from "@/assets/profile.pdf";
import { useCMS } from "@/context/CMSContext";

const Hero = () => {
  const { hero, isAdminLoggedIn, setIsCMSDrawerOpen } = useCMS();

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden pb-20"
      style={{
        minHeight: "100vh",
        paddingTop: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(to bottom, hsl(var(--background) / 0.88), hsl(var(--background) / 0.97)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
              className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.3s both" }}
            >
              {hero.bio}
            </p>

            <div
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
              style={{ animation: "hero-fade-in 0.6s ease-out 0.4s both" }}
            >
              <Button
                asChild
                size="lg"
                className="gap-2 shadow-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <a href="#contact">Get in Touch</a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <a href="#projects">View Projects</a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-primary/40 hover:bg-primary/10 shadow-sm"
                title="View / Download Resume"
              >
                <a href={profilePdf} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 text-primary" />
                  View Resume
                </a>
              </Button>

              {isAdminLoggedIn && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsCMSDrawerOpen(true)}
                  className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4" />
                  Edit Hero (CMS)
                </Button>
              )}
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

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-primary/60 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </div>

      <style>{`
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
