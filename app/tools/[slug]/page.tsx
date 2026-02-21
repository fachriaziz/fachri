import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Wrench } from "lucide-react";
import { getToolBySlug } from "../../data/tools";
import { Metadata } from "next";
import { Section } from "../../components/layout/section";
import { Container } from "../../components/layout/container";
import { H1, H3, Lead, P } from "../../components/ui/typography";
import { Spinner } from "../../components/ui/spinner";

// Dynamic imports with loading states for better performance
const PasswordEntropy = dynamic(
  () =>
    import("@/app/components/tools/password-entropy").then((mod) => ({
      default: mod.PasswordEntropy,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

const JwtDebugger = dynamic(
  () =>
    import("@/app/components/tools/jwt-debugger").then((mod) => ({
      default: mod.JwtDebugger,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

const ChmodCalculator = dynamic(
  () =>
    import("@/app/components/tools/chmod-calculator").then((mod) => ({
      default: mod.ChmodCalculator,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

const HashEncode = dynamic(
  () =>
    import("@/app/components/tools/hash-encode").then((mod) => ({
      default: mod.HashEncode,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

const TOTPAuthenticator = dynamic(
  () =>
    import("@/app/components/tools/totp-authenticator").then((mod) => ({
      default: mod.TOTPAuthenticator,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

const UIShowcase = dynamic(
  () =>
    import("@/app/components/tools/ui-showcase").then((mod) => ({
      default: mod.UIShowcase,
    })),
  {
    loading: () => (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    ),
  },
);

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: [
      tool.title,
      tool.type,
      "developer tools",
      "online tools",
      "free tools",
    ],
    openGraph: {
      title: `${tool.title} | Developer Tools`,
      description: tool.description,
      type: "website",
      url: `https://fachriaziz.my.id/tools/${tool.slug}`,
    },

    alternates: {
      canonical: `https://fachriaziz.my.id/tools/${tool.slug}`,
    },
  };
}

const TOOLS: Record<string, React.ComponentType> = {
  "password-entropy": PasswordEntropy,
  "jwt-debugger": JwtDebugger,
  "chmod-calculator": ChmodCalculator,
  "hash-encode": HashEncode,
  "totp-authenticator": TOTPAuthenticator,
  "ui-showcase": UIShowcase,
};

export default async function ToolDetailPage(props: { params: Params }) {
  const params = await props.params;
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const ToolComponent = TOOLS[tool.slug];

  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-32">
      <div className="mx-auto w-full max-w-5xl px-6 mb-8">
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />{" "}
            Back to Tools
          </Link>
          <span className="font-mono text-sm text-muted-foreground">
            tools / {tool.slug}
          </span>
        </div>
      </div>

      <Section className="flex-1 pt-0 pb-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <H1 className="text-3xl md:text-4xl">{tool.title}</H1>
            <Lead>{tool.description}</Lead>
          </div>

          <div className="w-full">
            {ToolComponent ? (
              <ToolComponent />
            ) : (
              <div className="p-12 text-center border dashed border-subtle rounded-xl bg-surface/50">
                <Wrench
                  className="mx-auto mb-4 text-muted-foreground"
                  size={48}
                />
                <H3 className="text-lg font-medium m-0">Work in Progress</H3>
                <P className="m-0">This tool is still being developed.</P>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
