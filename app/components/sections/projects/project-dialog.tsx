"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/app/data/projects";
import { TechStack } from "@/app/components/ui/tech-stack";
import { getTechIcon } from "@/app/components/ui/icons";

export interface ProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overview */}
          {project.overview && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Overview
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.overview}
              </p>
            </div>
          )}

          {/* Technical Challenge */}
          {project.technicalChallenge && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Technical Challenge
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.technicalChallenge}
              </p>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Tech Stack
            </h3>
            <TechStack
              skills={project.tech.map((t) => ({
                name: t,
                icon: getTechIcon(t) || undefined,
              }))}
            />
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-4 border-t">
            {project.demo && (
              <Button asChild variant="default">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </span>
                </a>
              </Button>
            )}
            {project.repo && (
              <Button asChild variant="outline">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span className="flex items-center gap-2">
                    <Github size={16} />
                    <span>View Code</span>
                  </span>
                </a>
              </Button>
            )}
            {project.link && !project.demo && !project.repo && (
              <Button asChild variant="default">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    <span>View Project</span>
                  </span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
