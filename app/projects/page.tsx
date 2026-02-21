import { Metadata } from "next";
import { ProjectList } from "../components/sections/projects/project-list";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected extensive projects and case studies.",
};

import { Container } from "../components/layout/container";
import { Section } from "../components/layout/section";
import { PageHeader } from "../components/ui/page-header";

export default function ProjectsPage() {
  return (
    <Section className="py-20 md:py-32">
      <Container>
        <PageHeader
          title="Projects."
          description="A selection of work demonstrating product thinking, system architecture, and attention to detail."
        />
        <ProjectList />
      </Container>
    </Section>
  );
}
