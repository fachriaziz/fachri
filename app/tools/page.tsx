import { Metadata } from "next";
import { ToolList } from "../components/sections/tools/tool-list";

export const metadata: Metadata = {
  title: "Tools",
  description: "Developer tools to boost your productivity.",
};

import { Container } from "../components/layout/container";
import { Section } from "../components/layout/section";
import { PageHeader } from "../components/ui/page-header";

export default function ToolsPage() {
  return (
    <Section className="py-20 md:py-32">
      <Container>
        <PageHeader
          title="Tools."
          description="Developer tools to boost your productivity. Production-ready and battle-tested."
        />
        <ToolList />
      </Container>
    </Section>
  );
}
