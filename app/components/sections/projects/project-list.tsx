"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { EmptyState } from "@/app/components/ui/empty-state";
import { Pagination } from "@/app/components/ui/pagination";
import { ProjectDialog } from "./project-dialog";
import { getAllProjects, Project } from "@/app/data/projects";
import { getTechIcon } from "@/app/components/ui/icons";
import { TechStack } from "@/app/components/ui/tech-stack";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@/app/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export interface ProjectListProps {
  projects?: Project[];
  itemsPerPage?: number;
}

export function ProjectList({
  projects: initialProjects,
  itemsPerPage = 9,
}: ProjectListProps = {}) {
  const router = useRouter();
  const allProjects = initialProjects || getAllProjects();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return allProjects;

    return allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [allProjects, searchQuery]);

  // Paginate projects
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleProjectSelect = (project: Project) => {
    setSearchOpen(false);
    router.push(`/projects/${project.slug}`);
  };

  return (
    <div className="space-y-8">
      {/* Search Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search projects...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <VisuallyHidden>
          <DialogTitle>Search Projects</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          placeholder="Search projects by name, description, or tech..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {filteredProjects.map((project) => (
              <CommandItem
                key={project.slug}
                value={project.title}
                onSelect={() => handleProjectSelect(project)}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{project.title}</span>
                    {project.isFeatured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {project.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Project Cards */}
      {paginatedProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="block h-full"
              >
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
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Search className="h-16 w-16" />}
          title="No projects found"
          description={
            searchQuery
              ? `No projects match "${searchQuery}". Try different keywords.`
              : "No projects available."
          }
          action={
            searchQuery
              ? {
                  label: "Clear Search",
                  onClick: () => setSearchQuery(""),
                }
              : undefined
          }
        />
      )}

      {/* Project Details Dialog */}
      <ProjectDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
    </div>
  );
}
