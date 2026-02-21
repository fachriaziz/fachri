export function PersonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Fachri Aziz",
    url: "https://fachriaziz.my.id",
    jobTitle: "Backend, AI & Security Engineer",
    description:
      "Backend, AI & Security Engineer specializing in scalable systems, machine learning, and cybersecurity.",
    sameAs: [
      "https://github.com/fachriaziz", // Update with your actual links
      "https://linkedin.com/in/fachriaziz",
    ],
    knowsAbout: [
      "Backend Development",
      "Artificial Intelligence",
      "Cybersecurity",
      "Machine Learning",
      "Web Development",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fachri Aziz Portfolio",
    url: "https://fachriaziz.my.id",
    description:
      "Backend, AI & Security Engineer portfolio showcasing projects, tools, and technical expertise.",
    author: {
      "@type": "Person",
      name: "Fachri Aziz",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function SoftwareApplicationStructuredData({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web Browser",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
