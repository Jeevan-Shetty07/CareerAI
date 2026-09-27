import { generateStructuredJson } from './aiClient';

export interface RoadmapTask {
  id: string;
  name: string;
  description: string;
  resources: Array<{
    title: string;
    url: string;
    type: 'Documentation' | 'Video' | 'Article' | 'Practice';
  }>;
  isCompleted: boolean;
  projectIdea?: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  tasks: RoadmapTask[];
}

export interface RoadmapResult {
  title: string;
  targetRole: string;
  estimatedDurationWeeks: number;
  totalHours: number;
  phases: RoadmapPhase[];
}

export const generatePersonalizedRoadmap = async (
  targetRole: string,
  currentSkills: string[],
  missingSkills: string[],
  experienceLevel: string = 'Fresher'
): Promise<RoadmapResult> => {
  const systemPrompt = `You are an elite Engineering Mentor and Technical Career Architect.
Create a high-impact, actionable, personalized learning roadmap for a student/engineer aiming for "${targetRole}".
Design 3 to 4 sequential phases transitioning the learner from current fundamentals to closing high-priority skill gaps and finishing with production capstones.
Provide real, high-quality documentation and learning resource links and practical mini-projects for each task.`;

  const userPrompt = `Target Role: ${targetRole}
Experience Level: ${experienceLevel}
Current Skills: ${currentSkills.join(', ')}
Missing / Skills to Bridge: ${missingSkills.join(', ')}

Return a structured JSON object matching this schema:
{
  "title": "Full Stack Engineer Career Roadmap",
  "targetRole": "${targetRole}",
  "estimatedDurationWeeks": 8,
  "totalHours": 60,
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Node.js Fundamentals & Modular Architecture",
      "description": "Master server-side JavaScript runtime, event loop, modules, npm ecosystem, and asynchronous patterns.",
      "estimatedHours": 15,
      "tasks": [
        {
          "id": "task-1-1",
          "name": "Node.js Event Loop & Stream Processing",
          "description": "Understand non-blocking I/O, Buffer manipulation, and EventEmitter pattern.",
          "resources": [
            { "title": "Node.js Official Docs: Event Loop", "url": "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick", "type": "Documentation" }
          ],
          "isCompleted": false,
          "projectIdea": "Build a streaming file compression CLI utility in pure Node.js."
        }
      ]
    }
  ]
}`;

  const fallback: RoadmapResult = {
    title: `${targetRole || 'Full Stack Developer'} Mastery Roadmap`,
    targetRole: targetRole || "Full Stack Software Engineer",
    estimatedDurationWeeks: 8,
    totalHours: 64,
    phases: [
      {
        phaseNumber: 1,
        title: "Phase 1: Backend Architecture & REST APIs",
        description: "Deepen server-side engineering in Node.js, Express, request validation, and clean controller-service architecture.",
        estimatedHours: 16,
        tasks: [
          {
            id: "task-1-1",
            name: "Master Node.js Event Loop & Async Architecture",
            description: "Deep dive into microtasks, macrotasks, async/await mechanics, and error propagation.",
            resources: [
              { title: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/", type: "Documentation" },
              { title: "Node.js Event Loop Visualized", url: "https://youtube.com", type: "Video" }
            ],
            isCompleted: true,
            projectIdea: "Implement a non-blocking asynchronous log processor."
          },
          {
            id: "task-1-2",
            name: "Robust REST API Design with Express & Zod",
            description: "Build type-safe controllers, middleware error handlers, and strict request payload validation.",
            resources: [
              { title: "Express.js Routing Guide", url: "https://expressjs.com/en/guide/routing.html", type: "Documentation" },
              { title: "Zod Schema Validation", url: "https://zod.dev", type: "Documentation" }
            ],
            isCompleted: true,
            projectIdea: "Build a multi-resource E-commerce catalog API with filtering and pagination."
          },
          {
            id: "task-1-3",
            name: "JWT Authentication & Role Authorization",
            description: "Implement secure authentication, password hashing with bcrypt, and refresh token rotation.",
            resources: [
              { title: "OWASP Auth Cheat Sheet", url: "https://cheatsheetseries.owasp.org", type: "Article" }
            ],
            isCompleted: false,
            projectIdea: "Create an OAuth2 / JWT Auth microservice with session invalidation."
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "Phase 2: Database Modeling & Performance Optimization",
        description: "Design relational schemas, manage migrations, write complex joins, and optimize PostgreSQL indexes.",
        estimatedHours: 16,
        tasks: [
          {
            id: "task-2-1",
            name: "Advanced SQL Queries & Indexing Strategies",
            description: "Learn B-Tree indexes, EXPLAIN ANALYZE query profiling, and ACID transaction isolation.",
            resources: [
              { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com", type: "Article" },
              { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com", type: "Documentation" }
            ],
            isCompleted: false,
            projectIdea: "Optimize a 100,000-row relational database schema with composite indexes."
          },
          {
            id: "task-2-2",
            name: "In-Memory Caching with Redis",
            description: "Implement Cache-Aside patterns, TTL invalidation, and rate limiting with Redis.",
            resources: [
              { title: "Redis Developer Hub", url: "https://redis.io/docs/", type: "Documentation" }
            ],
            isCompleted: false,
            projectIdea: "Add a high-speed Redis caching layer to frequent read endpoints."
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "Phase 3: Docker Containerization & Cloud Deployment",
        description: "Containerize multi-container applications, automate CI/CD pipelines, and deploy to modern cloud platforms.",
        estimatedHours: 18,
        tasks: [
          {
            id: "task-3-1",
            name: "Dockerizing Full-Stack Applications",
            description: "Write multi-stage Dockerfiles for Client and Server, and compose them with Docker Compose.",
            resources: [
              { title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", type: "Documentation" }
            ],
            isCompleted: false,
            projectIdea: "Containerize a React + Node + Postgres stack with hot-reloading."
          },
          {
            id: "task-3-2",
            name: "GitHub Actions CI/CD Pipeline",
            description: "Automate automated linting, test suite execution, and container registry publishing on git push.",
            resources: [
              { title: "GitHub Actions Workflow Docs", url: "https://docs.github.com/en/actions", type: "Documentation" }
            ],
            isCompleted: false,
            projectIdea: "Build a CI/CD pipeline that auto-deploys passing commits to Render/Railway."
          },
          {
            id: "task-3-3",
            name: "AWS Fundamentals (S3, EC2 & RDS)",
            description: "Deploy Node server to cloud compute, host assets on S3, and connect managed PostgreSQL RDS.",
            resources: [
              { title: "AWS Cloud Essentials", url: "https://aws.amazon.com/training/", type: "Documentation" }
            ],
            isCompleted: false,
            projectIdea: "Host a production full-stack project live with custom domain and SSL."
          }
        ]
      },
      {
        phaseNumber: 4,
        title: "Phase 4: Production Capstone & Interview Mastery",
        description: "Synthesize all skills in a production portfolio project and practice system design and coding challenges.",
        estimatedHours: 14,
        tasks: [
          {
            id: "task-4-1",
            name: "Architect & Deploy Capstone SaaS Product",
            description: "Build a full-stack SaaS with payments, background queue workers, and observability.",
            resources: [
              { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Practice" }
            ],
            isCompleted: false,
            projectIdea: "Deploy full-stack CareerAI with live metrics."
          },
          {
            id: "task-4-2",
            name: "Master 50 Core LeetCode & Coding Patterns",
            description: "Practice Two-Pointer, Sliding Window, DFS/BFS, and Dynamic Programming algorithms in Python/JS.",
            resources: [
              { title: "NeetCode Roadmap", url: "https://neetcode.io", type: "Practice" }
            ],
            isCompleted: false,
            projectIdea: "Solve 2 medium problems daily across 5 core topics."
          }
        ]
      }
    ]
  };

  return await generateStructuredJson<RoadmapResult>(userPrompt, systemPrompt, fallback);
};
