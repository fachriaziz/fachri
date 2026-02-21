export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  overview: string;
  technicalChallenge: string;
  link?: string; // For Featured Projects
  demo?: string; // Optional
  repo?: string; // Optional
  isFeatured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "distributed-event-bus",
    title: "Distributed Event Bus",
    description:
      "A high-throughput, fault-tolerant event streaming platform built with Go and Kafka, ensuring 'at-least-once' delivery at scale.",
    tech: ["Go", "Kafka", "Docker", "gRPC"],
    link: "#",
    isFeatured: true,
    repo: "https://github.com/fachriaziz/event-bus",
    overview:
      "Designed to resolve the 'at-least-once' delivery guarantee challenge in distributed microservices. This system decouples critical services by providing a persistent, sharded message queue capable of withstanding network partitions and node failures without data loss.",
    technicalChallenge:
      "Ensuring strict message ordering per-entity during high-concurrency rebalancing was the primary bottleneck. I implemented a consistent hashing strategy for partition assignment and custom consumer group logic in Go to guarantee processing order while maximizing parallel throughput.",
  },
  {
    slug: "zero-trust-auth",
    title: "Zero-Trust Auth System",
    description:
      "Enterprise-grade identity provider featuring MPC-based MFA, adaptive rate limiting, and real-time session revocation.",
    tech: ["Node.js", "TypeScript", "Redis", "OIDC"],
    link: "#",
    isFeatured: true,
    repo: "https://github.com/fachriaziz/zero-trust",
    overview:
      "A security-first Identity Provider (IdP) built from scratch to replace legacy auth services. It implements a zero-trust architecture where every request is authenticated and authorized against dynamic policies, utilizing Redis for immediate global session revocation.",
    technicalChallenge:
      "Mitigating race conditions in refresh token rotation to prevent replay attacks. I utilized Redis Lua scripts to atomically validate and swap token families, ensuring that any detected token reuse immediately invalidates the entire chain and alerts the security operation center.",
  },
  {
    slug: "predictive-demand-engine",
    title: "Predictive Demand Engine",
    description:
      "AI-driven forecasting tool for supply chain optimization, utilizing LSTM models to predict inventory needs with 94% accuracy.",
    tech: ["Python", "TensorFlow", "PostgreSQL", "FastAPI"],
    link: "#",
    isFeatured: true,
    repo: "https://github.com/fachriaziz/demand-engine",
    overview:
      "This engine processes TBs of historical sales data to forecast future inventory requirements. By using Long Short-Term Memory (LSTM) networks, it captures seasonal trends and long-term dependencies that traditional linear regression models miss, directly integrating with the ERP system.",
    technicalChallenge:
      "Training on heterogeneous time-series data with varying sequence lengths. I implemented dynamic padding and masking layers within the TensorFlow pipeline, allowing the model to efficiently batch and train on disparate product lifecycles without skewing the weights.",
  },
  {
    slug: "edge-api-gateway",
    title: "Edge API Gateway",
    description:
      "High-performance custom API Gateway handling 50k+ RPS with dynamic rate limiting and circuit breaking.",
    tech: ["Go", "Envoy", "Redis", "Consul"],
    demo: "#",
    repo: "#",
    isFeatured: false,
    overview:
      "A centralized entry point for all microservices, managing authentication, request routing, and traffic shaping. It replaces multiple Nginx instances with a single, programmable Go binary that integrates directly with Consul for service discovery.",
    technicalChallenge:
      "Implementing low-latency distributed rate limiting. Using a 'sliding window log' algorithm in Redis was too heavy. I switched to a local token bucket with eventual consistency synchronization via Gossip protocol, reducing latency added by the gateway to under 2ms.",
  },
  {
    slug: "telemetry-pipeline",
    title: "Real-time Telemetry Pipeline",
    description:
      "Scalable observability pipeline ingesting terabytes of logs and metrics daily.",
    tech: ["Go", "ClickHouse", "Kafka", "Grafana"],
    demo: "#",
    repo: "#",
    isFeatured: false,
    overview:
      "A unified observability platform designed to replace expensive SaaS solutions. It ingests application logs, system metrics, and traces via Kafka, processes them in Go, and stores them in ClickHouse for sub-second analytical queries.",
    technicalChallenge:
      "Handling write amplification during traffic spikes. I implemented an adaptive buffering mechanism in the Go consumers that dynamically adjusts batch sizes and commit intervals based on back-pressure signals from ClickHouse, ensuring system stability during 10x load surges.",
  },
  {
    slug: "aura-interface",
    title: "Aura Neural Search",
    description:
      "Experimental semantic search engine leveraging vector embeddings for natural language querying.",
    tech: ["Python", "LangChain", "Pinecone", "Next.js"],
    demo: "#",
    repo: "#",
    isFeatured: false,
    overview:
      "Aura explores the intersection of LLMs and structured data. It allows users to query complex databases using natural language, converting intent into SQL/Cypher queries and summarizing results with cited sources.",
    technicalChallenge:
      "Reducing hallucination in SQL generation. I implemented a 'Schema-Aware' RAG pipeline that retrieves only relevant table schemas and sample rows before prompting the LLM, combined with a deterministic SQL validator that dry-runs queries before execution.",
  },
];

export function getAllProjects() {
  return projects;
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.isFeatured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
