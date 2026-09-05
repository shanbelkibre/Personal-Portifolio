import { useCMS } from "@/context/CMSContext";

const About = () => {
  const { about } = useCMS();

  return (
    <section id="about" className="bg-secondary/30 pb-20 py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-center">
          <span className="text-primary uppercase">ABOUT </span><span className="text-gradient uppercase">ME</span>
        </h2>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          {about.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
