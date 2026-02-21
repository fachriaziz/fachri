import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { buttonVariants } from "../../ui/button-variants";
import { cn } from "@/lib/utils";
import { FadeIn } from "../../ui/motion-primitives";
import { ContributionGraph } from "./contribution-graph";
import { Card, CardContent } from "../../ui/card";
import { H3 } from "../../ui/typography";

async function getGithubData() {
  try {
    const res = await fetch("https://api.github.com/users/fachriaziz", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getContributionData() {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/fachriaziz?y=last",
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.contributions;
  } catch {
    return null;
  }
}

export async function GithubStats() {
  const [user, contributions] = await Promise.all([
    getGithubData(),
    getContributionData(),
  ]);

  if (!user) {
    return (
      <section className="py-20 max-w-5xl mx-auto px-6 border-t border-subtle">
        <FadeIn>
          <Card className="rounded-2xl border-subtle bg-surface overflow-hidden border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                <Github size={32} className="text-muted-foreground/50" />
              </div>
              <H3 className="text-xl font-bold mb-2">GitHub Stats Unavailable</H3>
              <p className="text-muted-foreground mt-2 max-w-md text-sm">
                The GitHub API might be rate-limited at the moment. Please visit my profile directly to see my latest work and contributions.
              </p>
              <Link
                href="https://github.com/fachriaziz"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "mt-8 gap-2")}
              >
                <Github size={18} />
                Visit GitHub Profile
              </Link>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="py-20 max-w-5xl mx-auto px-6 border-t border-subtle">
      <FadeIn>
        <Card className="rounded-2xl border-subtle bg-surface overflow-hidden">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 md:p-10 border-b border-subtle/30">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left: Avatar + Title */}
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-subtle shrink-0">
                    <Image
                      src={user.avatar_url}
                      alt={user.name || "Fachri Aziz"}
                      fill
                      sizes="56px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <H3 className="text-base font-bold m-0 leading-tight">
                      Explore the Code
                    </H3>
                    <p className="m-0 mt-1 text-sm text-muted-foreground leading-tight">
                      Check out my open source contributions
                    </p>
                  </div>
                </div>

                {/* Right: Stats + Button */}
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-6 flex-1 md:flex-initial">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-2xl font-bold font-mono text-foreground">
                        {user.public_repos}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Repos
                      </span>
                    </div>
                    <div className="h-10 w-px bg-border/10" />
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-2xl font-bold font-mono text-foreground">
                        {user.followers}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        Followers
                      </span>
                    </div>
                  </div>

                  <Link
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
                  >
                    <Github size={16} className="mr-2" />
                    Visit GitHub
                  </Link>
                </div>
              </div>
            </div>

            {/* Contribution Graph */}
            {contributions && (
              <div className="p-8 md:p-10 bg-muted/30">
                <ContributionGraph data={contributions} />
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </section>
  );
}
