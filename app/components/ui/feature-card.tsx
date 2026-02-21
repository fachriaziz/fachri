import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { buttonVariants } from "@/app/components/ui/button-variants";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  links?: {
    demo?: string;
    repo?: string;
    demoLabel?: string;
  };
  className?: string;
}

export const FeatureCard = memo(function FeatureCard({
  title,
  description,
  tags,
  image,
  links,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden flex flex-col h-full transition-all duration-300 hover:bg-secondary/50 hover:-translate-y-1",
        className,
      )}
    >
      {image && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-muted/60">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          {links?.demo && (
            <div className="text-muted-foreground transition-colors p-1 -mr-2 -mt-1.5">
              <ArrowUpRight className="h-5 w-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          )}
        </div>
        <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-end">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-2.5 py-1 bg-secondary/30 border-border/50 text-sm text-foreground/80 hover:bg-secondary/50 font-normal transition-colors cursor-default"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {links && (links.demo || links.repo) && (
        <CardFooter className="p-6 pt-0 gap-3 mt-auto">
          {links.repo && (
            <Link
              href={links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full font-medium",
              )}
            >
              <Github className="mr-2 h-4 w-4" /> Code
            </Link>
          )}
          {links.demo && (
            <Link
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full font-medium",
              )}
            >
              <Globe className="mr-2 h-4 w-4" />{" "}
              {links.demoLabel || "Live Demo"}
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
});
