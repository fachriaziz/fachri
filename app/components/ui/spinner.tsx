"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
    xl: "w-12 h-12 border-[3px]",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin border-foreground/30 border-t-foreground",
        sizeStyles[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SpinnerOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-xl">
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground font-medium">
          {message}
        </p>
      )}
    </div>
  );
}
