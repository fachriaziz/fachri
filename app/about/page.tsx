import { Metadata } from "next";
import Image from "next/image";
import {
  Download,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  GraduationCap,
  Grip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../components/ui/button-variants";
import { Container } from "../components/layout/container";
import { Section } from "../components/layout/section";
import {
  stackCategories,
  experience,
  education,
  socialLinks,
} from "../data/about";
import { H1, H2, Lead, P } from "../components/ui/typography";
import { Badge } from "../components/ui/badge";
import { TechStack } from "../components/ui/tech-stack";

export const metadata: Metadata = {
  title: "About",
  description: "Backend & Security Engineer with a focus on scalable systems.",
};

/** Reusable section label — used 3× in the sidebar. */
function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-foreground font-semibold text-xl tracking-tight mb-8 pb-4 border-b border-border-subtle/50">
      <Icon size={20} className="text-foreground/80" aria-hidden="true" />
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <Section className="py-20 md:py-32">
      <Container>
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border border-border-subtle">
                <Image
                  src="https://avatars.githubusercontent.com/u/101358960?v=4"
                  alt="Fachri Aziz"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <H1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  About Me<span className="text-muted-foreground">.</span>
                </H1>
                <Lead className="text-xl md:text-2xl leading-relaxed max-w-2xl font-light">
                  Backend focused software engineer exploring AI systems with
                  security aware design.
                </Lead>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-secondary/30 border-border-subtle/50 px-3 py-1 rounded-full font-medium gap-2"
                >
                  <MapPin
                    size={14}
                    className="text-foreground/70"
                    aria-hidden="true"
                  />
                  Jakarta, Indonesia
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-secondary/30 border-border-subtle/50 px-3 py-1 rounded-full font-medium gap-2"
                >
                  <Clock
                    size={14}
                    className="text-foreground/70"
                    aria-hidden="true"
                  />
                  UTC+7 (WIB)
                </Badge>
              </div>

              {/* CTA buttons — use <a> + buttonVariants to avoid Slot single-child constraint */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 border-none transition-transform hover:scale-105 active:scale-95 gap-2 font-semibold",
                  )}
                >
                  <Download size={18} aria-hidden="true" /> Resume
                </a>
                <a
                  href="mailto:fachri.aziz@outlook.com"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full border-border-subtle hover:bg-secondary/40 hover:text-foreground transition-all text-muted-foreground gap-2 bg-transparent",
                  )}
                >
                  <Mail size={18} aria-hidden="true" /> Contact Me
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside
            className="md:col-span-4 space-y-16"
            aria-label="Sidebar information"
          >
            {/* Technical Arsenal */}
            <section aria-label="Technical Arsenal">
              <SectionLabel icon={Grip}>Technical Arsenal</SectionLabel>
              <div className="space-y-7">
                {stackCategories.map((category) => (
                  <div key={category.title} className="space-y-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 px-1">
                      {category.title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <TechStack skills={category.skills} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Connect */}
            <section aria-label="Connect">
              <SectionLabel icon={Mail}>Connect</SectionLabel>
              <div className="grid grid-cols-1 gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-secondary/30 group/link transition-all duration-300"
                      aria-label={`${link.name} — ${link.username}`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon
                          className="w-6 h-6 shrink-0 text-foreground/90 transition-all duration-300 group-hover/link:scale-110 group-hover/link:text-foreground"
                          aria-hidden="true"
                        />
                        <div>
                          <span className="font-bold text-sm text-foreground block leading-tight mb-1 transition-colors group-hover/link:text-foreground">
                            {link.name}
                          </span>
                          <span className="text-xs text-muted-foreground/60 font-mono transition-colors group-hover/link:text-muted-foreground/90">
                            {link.username}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="text-foreground/50 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 group-hover/link:text-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </section>

            {/* Education */}
            <section aria-label="Education">
              <SectionLabel icon={GraduationCap}>Education</SectionLabel>
              <div className="space-y-10 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border-subtle/60">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Dot */}
                    <div className="absolute left-0 top-1.5 w-[19px] h-[19px] rounded-full bg-background border border-border-subtle flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/80" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-bold text-sm md:text-base text-foreground leading-tight">
                        {edu.degree}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground/70">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-foreground/60 font-mono italic">
                          {edu.period}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* ── Main Content ─────────────────────────────────── */}
          <main
            className="md:col-span-8 space-y-16"
            aria-label="Bio and experience"
          >
            <section
              className="prose prose-lg prose-zinc dark:prose-invert max-w-none"
              aria-label="Bio"
            >
              <P className="leading-relaxed">
                My interest in software engineering comes from understanding how
                systems behave under failure and constraints.
              </P>
              <P className="leading-relaxed">
                That perspective naturally led me toward backend engineering,
                where reliability, data flow, and system design matter. Today, I
                focus on building solid backend foundations, exploring AI as
                part of system workflows, and applying security aware thinking
                when designing APIs and services.
              </P>
            </section>

            <section className="space-y-12" aria-label="Work experience">
              <H2 className="text-xl font-semibold text-foreground pb-4 border-b border-border-subtle/50">
                Experience
              </H2>

              <div className="relative border-l border-border-subtle/50 ml-3 md:ml-4 space-y-10">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 md:pl-10 group">
                    {/* Timeline dot */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border border-muted-foreground bg-background group-hover:border-foreground group-hover:scale-125 transition-all duration-300 z-10"
                    />

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono text-muted-foreground/70 mb-1 block group-hover:text-foreground/80 transition-colors">
                        {exp.period}
                      </span>
                      <h3 className="text-lg font-bold text-foreground leading-none tracking-tight">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-medium text-foreground/80">
                        {exp.company}
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm mt-2 max-w-2xl">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </Container>
    </Section>
  );
}
