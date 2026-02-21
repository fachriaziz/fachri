"use client";

import { cn } from "@/lib/utils";
import { CopyIconButtonDarkContainer } from "./copy-button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language = "tsx",
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#1e1e1e] dark text-foreground",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {language}
        </span>
        <CopyIconButtonDarkContainer value={children} />
      </div>

      {/* Code */}
      <div className="relative overflow-x-auto text-sm">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "rgba(128, 128, 128, 0.4)",
            textAlign: "right",
          }}
          wrapLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
