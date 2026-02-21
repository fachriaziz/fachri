import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "../../ui/motion-primitives";
import { getFeaturedTools } from "../../../data/tools";
import { FeatureCard } from "../../ui/feature-card";

export function ToolsPreview() {
  const tools = getFeaturedTools();

  return (
    <section className="py-20 max-w-5xl mx-auto px-6 border-t border-subtle">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Tools</h2>
        </div>
        <Link
          href="/tools"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all tools <ArrowUpRight size={14} />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <StaggerItem key={tool.slug} className="h-full">
            <FeatureCard
              title={tool.title}
              description={tool.description}
              tags={[tool.type]}
              className="h-full"
              links={{ demo: `/tools/${tool.slug}`, demoLabel: "Open Tool" }}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
