export interface Tool {
  slug: string;
  title: string;
  type:
    | "AI"
    | "Performance"
    | "Security"
    | "UI/UX"
    | "Infrastructure"
    | "Other";
  description: string;
  content?: string; // For Detail page
  link?: string; // For external/featured links if needed
  isFeatured?: boolean;
  isHidden?: boolean;
}

export const tools: Tool[] = [
  {
    slug: "password-entropy",
    title: "Password Entropy",
    type: "Security",
    description:
      "Calculate password strength and estimated crack time using information theory.",
    isFeatured: true,
  },
  {
    slug: "jwt-debugger",
    title: "JWT Debugger",
    type: "Security",
    description:
      "Multi-purpose tool to Encode, Decode, and Verify JSON Web Tokens (JWT).",
    isFeatured: true,
  },
  {
    slug: "chmod-calculator",
    title: "Chmod Calculator",
    type: "Infrastructure",
    description:
      "Visual Unix permission generator (chmod) for servers and scripts. Calculate octal and symbolic modes.",
    isFeatured: true,
  },
  {
    slug: "hash-encode",
    title: "Hash & Encode",
    type: "Security",
    description:
      "Generate secure hashes (SHA-256, SHA-512) and encode/decode text (Base64, URL).",
    isFeatured: true,
  },
  {
    slug: "totp-authenticator",
    title: "TOTP Authenticator",
    type: "Security",
    description:
      "Generate, verify, and debug Time-based One-Time Passwords (TOTP) with QR code support.",
    isFeatured: true,
  },
  {
    slug: "ui-showcase",
    title: "UI Component Showcase",
    type: "UI/UX",
    description:
      "Interactive playground for testing and viewing reusable UI components.",
    isHidden: true,
  },

];

export function getAllTools() {
  return tools;
}

export function getFeaturedTools() {
  return tools.filter((t) => t.isFeatured);
}

export function getToolBySlug(slug: string) {
  return tools.find((t) => t.slug === slug);
}
