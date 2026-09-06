import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  useScrollReveal();

  return (
    <>
      <Helmet>
        {/* Google Verification */}
        <meta name="google-site-verification" content="b420e871e9bf9d66" />

        {/* Basic SEO */}
        <title>Shanbel Kibre | Software Engineer & Full-Stack Developer</title>

        <meta
          name="description"
          content="Shanbel Kibre is a Software Engineer and Full-Stack Developer from Debre Birhan, Ethiopia. Specialized in React, TypeScript, Tailwind CSS, Node.js, and Cybersecurity."
        />

        <meta
          name="keywords"
          content="Shanbel Kibre, Shambel Kibre, Software Engineer, Full-Stack Developer, Cybersecurity, Penetration Testing, React Developer, TypeScript, Node.js, Ethiopia Developer, Debre Birhan University, MERN Stack, Freelancer Ethiopia"
        />

        <meta name="author" content="Shanbel Kibre" />
        <link rel="canonical" href="https://shanbelkibredev.vercel.app/" />

        {/* Open Graph (LinkedIn, WhatsApp, Facebook) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shanbelkibredev.vercel.app/" />
        <meta
          property="og:title"
          content="Shanbel Kibre | Software Engineer & Full-Stack Developer"
        />
        <meta
          property="og:description"
          content="Software Engineer & Full-Stack Developer specializing in React, TypeScript, Node.js, and Cybersecurity. Explore my work history and projects."
        />
        <meta property="og:image" content="https://shanbelkibredev.vercel.app/preview.png" />
        <meta property="og:site_name" content="Shanbel Kibre Portfolio" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://shanbelkibredev.vercel.app/" />
        <meta
          name="twitter:title"
          content="Shanbel Kibre | Software Engineer & Full-Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Software Engineer & Full-Stack Developer specializing in React, TypeScript, Node.js, and Cybersecurity."
        />
        <meta name="twitter:image" content="https://shanbelkibredev.vercel.app/preview.png" />

        {/* Profile Links */}
        <link rel="me" href="https://www.linkedin.com/in/shanbel-kibre/" />
        <link rel="me" href="https://github.com/shanbelkibre" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Shanbel Kibre",
            "url": "https://shanbelkibredev.vercel.app/",
            "image": "https://shanbelkibredev.vercel.app/preview.png",
            "jobTitle": "Software Engineer & Full-Stack Developer",
            "description":
              "Software Engineer and Full-Stack Developer with hands-on expertise in cybersecurity and penetration testing.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Addis Ababa",
              "addressRegion": "Addis Ababa",
              "addressCountry": "ET",
            },
            "sameAs": [
              "https://www.linkedin.com/in/shanbel-kibre/",
              "https://github.com/shanbelkibre",
            ],
          })}
        </script>
      </Helmet>

      <div
        className="min-h-screen text-foreground selection:bg-primary/20 selection:text-primary"
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--background) / var(--bg-overlay, 0.94)), hsl(var(--background) / var(--bg-overlay, 0.96))), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />

        <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2026 Shanbel Kibre. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Index;