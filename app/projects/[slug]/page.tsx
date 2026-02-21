import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { buttonVariants } from "../../components/ui/button-variants";
import { cn } from "@/app/lib/utils";
import { getTechIcon } from "../../components/ui/icons";
import { getProjectBySlug } from "../../data/projects";
import { Metadata } from "next";
import { H1, Lead } from "../../components/ui/typography";
import { TechStack } from "../../components/ui/tech-stack";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectDetailPage(props: { params: Params }) {
  const params = await props.params;
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="max-w-5xl mx-auto px-6 py-20 md:py-32">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        Back to Projects
      </Link>

      <header className="mb-16 max-w-4xl">
        <H1 className="mb-6">
          {project.title}
          <span className="text-muted-foreground">.</span>
        </H1>
        <Lead className="mb-8 max-w-3xl leading-relaxed">
          {project.description}
        </Lead>

        <div className="mb-10">
          <TechStack
            skills={project.tech.map((t) => ({
              name: t,
              icon: getTechIcon(t) || undefined,
            }))}
          />
        </div>

        <div className="flex items-center gap-4">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-accent text-white hover:bg-accent/90 border-none h-12 px-8 font-medium transition-all hover:scale-105 active:scale-95 gap-2",
              )}
            >
              Live Demo <ExternalLink size={16} />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full h-12 px-8 font-medium border-zinc-200 dark:border-zinc-800 hover:bg-secondary/5 transition-all hover:scale-105 active:scale-95 gap-2",
              )}
            >
              View Code <Github size={16} />
            </a>
          )}
        </div>
      </header>

      <div className="mt-20 space-y-20">
        <section className="border-t border-subtle pt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Overview
          </h2>
          <div className="prose prose-lg prose-zinc dark:prose-invert max-w-3xl text-muted-foreground">
            <p>{project.overview}</p>
          </div>
        </section>

        <section className="border-t border-subtle pt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Technical Challenge
          </h2>
          <div className="prose prose-lg prose-zinc dark:prose-invert max-w-3xl text-muted-foreground">
            <p>{project.technicalChallenge}</p>
          </div>
        </section>
      </div>
    </article>
  );
}
