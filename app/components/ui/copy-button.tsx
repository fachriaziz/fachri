"use client";

import { useState } from "react";
import { ToolIcons } from "@/app/components/ui/tool-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  iconOnly?: boolean;
  onCopy?: () => void;
}

export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
  variant = "ghost",
  className,
  iconOnly = false,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (iconOnly) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={variant}
              onClick={handleCopy}
              disabled={!value}
              className={cn(
                "h-7 w-7 transition-all flex items-center justify-center",
                copied
                  ? "text-green-600 dark:text-green-400 bg-green-500/10 hover:bg-green-500/15"
                  : "text-muted-foreground hover:text-foreground",
                className,
              )}
            >
              {copied ? (
                <ToolIcons.Check size={14} />
              ) : (
                <ToolIcons.Copy size={14} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      disabled={!value}
      className={cn(
        "gap-1.5 transition-all",
        !copied && "text-muted-foreground hover:text-foreground",
        copied &&
          "text-green-600 dark:text-green-400 bg-green-500/10 hover:bg-green-500/15",
        className,
      )}
    >
      {copied ? <ToolIcons.Check size={12} /> : <ToolIcons.Copy size={12} />}
      {copied ? "Copied" : label}
    </Button>
  );
}

// Pre-configured variants for consistent usage
export function CopyIconButton({
  value,
  className,
  onCopy,
}: {
  value: string;
  className?: string;
  onCopy?: () => void;
}) {
  return (
    <CopyButton value={value} iconOnly className={className} onCopy={onCopy} />
  );
}

export function CopyIconButtonGhost({
  value,
  className,
  onCopy,
}: {
  value: string;
  className?: string;
  onCopy?: () => void;
}) {
  return (
    <CopyButton
      value={value}
      iconOnly
      variant="ghost"
      className={className}
      onCopy={onCopy}
    />
  );
}

export function CopyButtonWithLabel({
  value,
  label,
  className,
  onCopy,
}: {
  value: string;
  label?: string;
  className?: string;
  onCopy?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <CopyButton
              value={value}
              label={label}
              className={className}
              onCopy={onCopy}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CopyIconButtonDarkContainer({
  value,
  className,
  onCopy,
}: {
  value: string;
  className?: string;
  onCopy?: () => void;
}) {
  return (
    <CopyButton
      value={value}
      iconOnly
      variant="ghost"
      className={cn(
        "text-zinc-400 hover:text-zinc-300 hover:bg-white/10",
        className
      )}
      onCopy={onCopy}
    />
  );
}
