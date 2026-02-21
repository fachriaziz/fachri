import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { getTechIcon } from "../../ui/icons";
import { StaggerContainer, StaggerItem } from "../../ui/motion-primitives";
import { TechStack } from "../../ui/tech-stack";
import { getFeaturedProjects } from "../../../data/projects";

export function FeaturedProjects() {
  const projects = getFeaturedProjects();

  return (
    <section className="py-20 max-w-5xl mx-auto px-6 border-t border-subtle">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-semibold text-foreground">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all projects <ArrowUpRight size={14} />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <StaggerItem key={project.slug} className="h-full">
            <Link href={`/projects/${project.slug}`} className="block h-full">
              <Card className="group flex flex-col h-full transition-all duration-300 hover:bg-secondary/50 hover:-translate-y-1">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="transition-colors flex items-center justify-between w-full">
                      {project.title}
                      <ArrowUpRight
                        size={20}
                        className="text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-2 pb-6 grow">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto">
                  <TechStack
                    skills={project.tech.map((t) => ({
                      name: t,
                      icon: getTechIcon(t) || undefined,
                    }))}
                  />
                </CardFooter>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
