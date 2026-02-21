"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ToolsErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tools section error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center bg-card rounded-lg border shadow-sm">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          An error occurred inside the tools section. The application has caught this safely to prevent a full page crash.
        </p>
      </div>
      <Button onClick={() => reset()} variant="secondary" className="gap-2 mt-4">
        <RotateCcw className="w-4 h-4" />
        Try again
      </Button>
    </div>
  );
}
