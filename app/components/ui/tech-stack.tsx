import { memo } from "react";
import { cn } from "@/lib/utils";

interface TechItem {
  name: string;
  icon?: React.ElementType;
}

interface TechStackProps {
  skills: TechItem[];
  className?: string;
}

export const TechStack = memo(function TechStack({
  skills,
  className,
}: TechStackProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {skills.map((tech) => (
        <div
          key={tech.name}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-default bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 group/skill"
        >
          {tech.icon && (
            <tech.icon className="w-[18px] h-[18px] shrink-0 text-foreground/70 group-hover/skill:text-foreground transition-colors" />
          )}
          <span className="text-[13px] font-medium text-foreground/80 group-hover/skill:text-foreground transition-colors">
            {tech.name}
          </span>
        </div>
      ))}
    </div>
  );
});
