import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import { NavbarWrapper } from "./components/layout/navbar-wrapper";
import { Footer } from "./components/layout/footer";
import { WebVitals } from "./components/seo/web-vitals";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fachriaziz.my.id"),
  title: {
    default: "Fachri Aziz | Backend, AI & Security Engineer",
    template: "%s | Fachri Aziz",
  },
  description:
    "Backend, AI & Security Engineer specializing in scalable systems, machine learning, and cybersecurity. Explore my projects, tools, and technical blog.",
  keywords: [
    "Fachri Aziz",
    "Backend Engineer",
    "AI Engineer",
    "Security Engineer",
    "Full Stack Developer",
    "Machine Learning",
    "Cybersecurity",
    "Web Development",
    "Software Engineer",
    "Portfolio",
  ],
  authors: [{ name: "Fachri Aziz", url: "https://fachriaziz.my.id" }],
  creator: "Fachri Aziz",
  publisher: "Fachri Aziz",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Fachri Aziz | Backend, AI & Security Engineer",
    description:
      "Backend, AI & Security Engineer specializing in scalable systems, machine learning, and cybersecurity.",
    url: "https://fachriaziz.my.id",
    siteName: "Fachri Aziz Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fachri Aziz - Backend, AI & Security Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  icons: {
    icon: [
      { url: "/FAZ_LIGHT.svg", media: "(prefers-color-scheme: light)" },
      { url: "/FAZ_DARK.svg", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/FAZ_DARK.svg",
    apple: "/FAZ_DARK.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://fachriaziz.my.id",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${googleSansFlex.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WebVitals />
          <NavbarWrapper />
          <div className="flex min-h-dvh flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
