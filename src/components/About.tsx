import { useCMS } from "@/context/CMSContext";

const About = () => {
  const { about } = useCMS();

  return (
    <section id="about" className="bg-secondary/30 pb-20 py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          About <span className="text-gradient">Me</span>
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
