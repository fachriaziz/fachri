"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  isError?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  isError,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-12 rounded-xl border-2 border-dashed border-border",
        className,
      )}
    >
      {icon && (
        <div 
          className={cn(
            isError 
              ? "w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive shrink-0" 
              : "w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-muted-foreground shrink-0"
          )}
        >
          {icon}
        </div>
      )}
      <h3 className={cn("text-lg font-semibold mb-2", isError ? "text-destructive" : "text-foreground")}>{title}</h3>
      {description && (
        <p className={cn("text-sm max-w-sm mb-6", isError ? "text-destructive/80" : "text-muted-foreground")}>
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm" variant={isError ? "destructive" : "default"}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
