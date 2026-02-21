import { TechIcons } from "../components/ui/icons";

export const stackCategories = [
  {
    title: "Core & Languages",
    skills: [
      { name: "Go", icon: TechIcons.Go },
      { name: "Python", icon: TechIcons.Python },
      { name: "TypeScript", icon: TechIcons.TypeScript },
      { name: "Node.js", icon: TechIcons.NodeJS },
    ],
  },
  {
    title: "Infrastructure",
    skills: [
      { name: "Kafka", icon: TechIcons.Kafka },
      { name: "Docker", icon: TechIcons.Docker },
      { name: "Redis", icon: TechIcons.Redis },
    ],
  },
  {
    title: "Data & AI",
    skills: [
      { name: "PostgreSQL", icon: TechIcons.PostgreSQL },
      { name: "TensorFlow", icon: TechIcons.TensorFlow },
      { name: "FastAPI", icon: TechIcons.FastAPI },
    ],
  },
];

export const experience = [
  {
    role: "Backend Engineer",
    company: "Tech Solutions Inc.",
    period: "2023 - Present",
    description:
      "Leading the migration to a microservices architecture using Go and gRPC. Improved system throughput by 300% and reduced latency by 40%.",
  },
  {
    role: "Software Engineer",
    company: "DataFlow Systems",
    period: "2021 - 2023",
    description:
      "Developed high-performance data pipelines processing TBs of daily telemetry. Implemented real-time anomaly detection using Python and Kafka.",
  },
  {
    role: "Full Stack Developer",
    company: "Creative Studio",
    period: "2019 - 2021",
    description:
      "Built and maintained client-facing web applications using Next.js and Node.js. Integrated secure payment gateways and authentication systems.",
  },
];

export const education = [
  {
    degree: "Informatics",
    institution: "Gunadarma University",
    period: "2023 - Present",
  },
];

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/fachriaziz",
    username: "github.com/fachriaziz",
    icon: TechIcons.GitHub,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/fachriaziz",
    username: "linkedin.com/in/fachriaziz",
    icon: TechIcons.LinkedIn,
  },
];
