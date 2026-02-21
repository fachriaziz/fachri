import { Hero } from "./components/sections/home/hero";
import { GithubStats } from "./components/sections/home/github-stats";
import { FeaturedProjects } from "./components/sections/home/featured-projects";
import { ToolsPreview } from "./components/sections/home/tools-preview";
import {
  PersonStructuredData,
  WebsiteStructuredData,
} from "./components/seo/structured-data";

export default function Home() {
  return (
    <>
      <PersonStructuredData />
      <WebsiteStructuredData />
      <Hero />
      <GithubStats />
      <FeaturedProjects />
      <ToolsPreview />
    </>
  );
}
