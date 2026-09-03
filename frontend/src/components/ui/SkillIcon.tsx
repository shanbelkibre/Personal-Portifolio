import { type ComponentType, type SVGProps } from "react";

interface SkillIconProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  color?: string;
  index?: number;
}

const SkillIcon = ({ icon: Icon, label, color, index = 0 }: SkillIconProps) => {
  return (
    <div
      role="img"
      aria-label={`${label} skill`}
      tabIndex={0}
      className="flex items-center gap-2 bg-secondary/80 rounded-lg px-3 py-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
      style={{
        animation: "skill-pop 0.5s ease-out both",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      <Icon
        className="w-4 h-4 flex-shrink-0"
        style={{ color: color ?? "hsl(var(--primary))" }}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">
        {label}
      </span>
      <style>{`
        @keyframes skill-pop {
          from { opacity: 0; transform: scale(0.82) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="skill-pop"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SkillIcon;
