"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { Button } from "@/app/components/ui/button";
import { EmptyState } from "@/app/components/ui/empty-state";
import { FeatureCard } from "@/app/components/ui/feature-card";
import { getAllTools, Tool } from "@/app/data/tools";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@/app/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export interface ToolListProps {
  tools?: Tool[];
}

export function ToolList({ tools: initialTools }: ToolListProps = {}) {
  const router = useRouter();
  const allTools = (initialTools || getAllTools()).filter((t) => !t.isHidden);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter tools based on search query
  const filteredTools = allTools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToolSelect = (tool: Tool) => {
    setSearchOpen(false);
    router.push(`/tools/${tool.slug}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search tools...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <VisuallyHidden>
          <DialogTitle>Search Tools</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          placeholder="Search tools by name or category..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No tools found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {filteredTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={tool.title}
                onSelect={() => handleToolSelect(tool)}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tool.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {tool.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Tool Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <FeatureCard
              key={tool.slug}
              title={tool.title}
              description={tool.description}
              tags={[tool.type]}
              className="h-full"
              links={{ demo: `/tools/${tool.slug}`, demoLabel: "Open Tool" }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="h-16 w-16" />}
          title="No tools found"
          description={`No tools match "${searchQuery}". Try different keywords.`}
          action={{
            label: "Clear Search",
            onClick: () => setSearchQuery(""),
          }}
        />
      )}
    </div>
  );
}
