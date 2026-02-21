import Link from "next/link";

import { buttonVariants } from "./components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Status */}
        <div className="space-y-4">
          <svg
            className="w-16 h-16 mx-auto text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              Page not found
            </h1>
            <p className="text-muted-foreground text-sm">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full",
            )}
          >
            Back to home
          </Link>
          <Link
            href="/projects"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
          >
            View projects
          </Link>
        </div>
      </div>
    </div>
  );
}
