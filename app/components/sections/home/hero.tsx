import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { H1, Lead, P } from "../../ui/typography";

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaButtons: Array<{
    label: string;
    href: string;
    variant: "default" | "outline";
  }>;
}

export function Hero({
  title = "Fachri Aziz",
  subtitle = "Software Engineer",
  description = "Focused on Backend systems, AI exploration, and Security aware architecture.",
  ctaButtons = [
    { label: "View Projects", href: "/projects", variant: "default" },
    { label: "About Me", href: "/about", variant: "outline" },
  ],
}: Partial<HeroSectionProps> = {}) {
  return (
    <section className="relative flex flex-col justify-center min-h-[100dvh] md:min-h-[90dvh] pt-16 flex-grow max-w-5xl mx-auto px-6">
      <div className="space-y-8 text-center mt-[-8dvh] md:mt-0">
        <div className="space-y-4">
          <H1 className="text-[15vw] leading-[1.1] sm:text-7xl md:text-8xl font-black tracking-tighter">
            {title}
            <span className="text-muted-foreground">.</span>
          </H1>
          <Lead className="text-2xl md:text-3xl font-medium tracking-tight">
            {subtitle}
          </Lead>
        </div>

        <P className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {description}
        </P>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
          {ctaButtons.map((button, index) => (
            <Link key={index} href={button.href} className="w-full sm:w-auto">
              <Button
                variant={button.variant}
                size="lg"
                className={cn(
                  "w-full sm:w-auto rounded-full px-6 py-6 sm:px-8 text-sm sm:text-base font-semibold transition-all hover:scale-105 active:scale-95",
                  button.variant === "default" &&
                    "gap-2 bg-foreground text-background hover:bg-foreground/90 border-none",
                  button.variant === "outline" &&
                    "text-muted-foreground border-border hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                {button.label}
                {button.variant === "default" && <ArrowRight size={16} />}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
