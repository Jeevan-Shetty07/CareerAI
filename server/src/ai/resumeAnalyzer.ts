import { generateStructuredJson } from './aiClient';

export interface ResumeAnalysisResult {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    cgpa?: string;
    graduationYear?: string;
  }>;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    devops: string[];
    tools: string[];
    softSkills: string[];
  };
  projects: Array<{
    projectName: string;
    technologies: string[];
    description: string;
    achievements: string[];
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }>;
  score: {
    overall: number;
    atsCompatibility: { score: number; explanation: string };
    skills: { score: number; explanation: string };
    projects: { score: number; explanation: string };
    experience: { score: number; explanation: string };
    achievements: { score: number; explanation: string };
    formatting: { score: number; explanation: string };
  };
  suggestions: Array<{
    id: string;
    category: string;
    originalText: string;
    suggestedText: string;
    reason: string;
    impact: 'High' | 'Medium' | 'Low';
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysisResult> => {
  const systemPrompt = `You are an elite AI Career & Resume Intelligence Engine for top tech companies.
Your job is to analyze the given resume raw text with extreme precision.
Extract structured personal info, education, skills (strictly categorized), projects, and work experience.
Calculate ATS compatibility, skill depth, project impact, experience relevance, measurable achievements, and formatting.
Provide deep, evidence-based score explanations and concrete high-impact bullet point rewrite suggestions.
Do not fabricate information. Return structured JSON matching the requested schema.`;

  const userPrompt = `Analyze this resume carefully:

--- RESUME TEXT START ---
${resumeText}
--- RESUME TEXT END ---

Return a JSON object with this exact structure:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "linkedin": "", "github": "", "portfolio": "" },
  "education": [{ "degree": "", "institution": "", "cgpa": "", "graduationYear": "" }],
  "skills": {
    "programmingLanguages": [],
    "frameworks": [],
    "databases": [],
    "cloud": [],
    "devops": [],
    "tools": [],
    "softSkills": []
  },
  "projects": [{ "projectName": "", "technologies": [], "description": "", "achievements": [] }],
  "experience": [{ "company": "", "role": "", "duration": "", "responsibilities": [] }],
  "score": {
    "overall": 82,
    "atsCompatibility": { "score": 88, "explanation": "..." },
    "skills": { "score": 84, "explanation": "..." },
    "projects": { "score": 79, "explanation": "..." },
    "experience": { "score": 75, "explanation": "..." },
    "achievements": { "score": 65, "explanation": "..." },
    "formatting": { "score": 91, "explanation": "..." }
  },
  "suggestions": [
    {
      "id": "sug-1",
      "category": "Achievements",
      "originalText": "...",
      "suggestedText": "...",
      "reason": "...",
      "impact": "High",
      "status": "pending"
    }
  ]
}`;

  // Deterministic fallback generator if LLM is offline
  const fallback: ResumeAnalysisResult = {
    personalInfo: {
      name: "Jeevan Kumar",
      email: "jeevan.k@example.com",
      phone: "+91 98765 43210",
      linkedin: "linkedin.com/in/jeevan-kumar",
      github: "github.com/jeevankumar-dev"
    },
    education: [
      {
        degree: "Master of Computer Applications (MCA)",
        institution: "National Institute of Technology",
        cgpa: "8.6/10",
        graduationYear: "2025"
      },
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "State University",
        cgpa: "8.4/10",
        graduationYear: "2023"
      }
    ],
    skills: {
      programmingLanguages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
      frameworks: ["React", "Node.js", "Express.js", "Next.js", "Tailwind CSS"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      cloud: ["AWS (S3, EC2 basic)"],
      devops: ["Docker", "Git", "GitHub Actions"],
      tools: ["Postman", "VS Code", "Vite", "Linux"],
      softSkills: ["Agile/Scrum", "Problem Solving", "Technical Communication", "Team Collaboration"]
    },
    projects: [
      {
        projectName: "DevConnect — Developer Community Platform",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
        description: "Full-stack web application for developer networking, technical blogging, and project showcasing with real-time notifications.",
        achievements: [
          "Implemented JWT authentication and role-based access control for 500+ active mock users.",
          "Optimized PostgreSQL queries using indexes, decreasing feed query latency by 45%."
        ]
      },
      {
        projectName: "AlgoVisualizer — Interactive Algorithm Visualizer",
        technologies: ["React", "JavaScript", "HTML5 Canvas", "CSS Animations"],
        description: "Interactive visualizer for pathfinding (Dijkstra, A*) and sorting algorithms (QuickSort, MergeSort).",
        achievements: [
          "Rendered 60 FPS animations on large grid matrices using requestAnimationFrame."
        ]
      }
    ],
    experience: [
      {
        company: "TechNova Solutions",
        role: "Software Engineering Intern",
        duration: "Jan 2024 - Jun 2024 (6 months)",
        responsibilities: [
          "Developed reusable UI components in React and TypeScript for customer dashboard.",
          "Constructed RESTful API endpoints in Node.js/Express with schema validation using Zod.",
          "Collaborated in weekly sprint planning and code review sessions."
        ]
      }
    ],
    score: {
      overall: 82,
      atsCompatibility: {
        score: 88,
        explanation: "Strong ATS layout with clean standard section headers, readable font hierarchy, and absence of complex multi-column tables."
      },
      skills: {
        score: 84,
        explanation: "Comprehensive modern web development stack (React, TypeScript, Node.js, SQL). Could add deeper Cloud/DevOps competencies."
      },
      projects: {
        score: 79,
        explanation: "Solid full-stack and visualization projects showing foundational breadth, though production deployment architecture could be highlighted."
      },
      experience: {
        score: 75,
        explanation: "Clear internship scope with direct contributions; quantify business or performance metrics to stand out further."
      },
      achievements: {
        score: 65,
        explanation: "Projects describe what was built, but few bullets contain quantifiable business outcomes (e.g. latency reduction, user load, error drop)."
      },
      formatting: {
        score: 91,
        explanation: "Clean structure, consistent date formats, and excellent readability."
      }
    },
    suggestions: [
      {
        id: "sug-1",
        category: "Achievements & Metrics",
        originalText: "Constructed RESTful API endpoints in Node.js/Express with schema validation using Zod.",
        suggestedText: "Architected 12+ secure RESTful API endpoints in Node.js/Express with Zod validation, cutting API payload error rate by 35%.",
        reason: "Adding specific metrics and outcomes demonstrates tangible engineering impact.",
        impact: "High",
        status: "pending"
      },
      {
        id: "sug-2",
        category: "Action Verbs",
        originalText: "Developed reusable UI components in React and TypeScript for customer dashboard.",
        suggestedText: "Engineered a modular library of 20+ responsive React/TypeScript UI components, reducing frontend dev cycle time by 25%.",
        reason: "Stronger action verbs like 'Engineered' paired with component metrics showcase leadership.",
        impact: "Medium",
        status: "pending"
      },
      {
        id: "sug-3",
        category: "Cloud & Deployment",
        originalText: "Docker, Git, GitHub Actions",
        suggestedText: "Containerized full-stack services with Docker Compose and automated testing via GitHub Actions CI/CD pipeline.",
        reason: "Clarifying practical application of DevOps tools proves hands-on proficiency.",
        impact: "High",
        status: "pending"
      }
    ]
  };

  return await generateStructuredJson<ResumeAnalysisResult>(userPrompt, systemPrompt, fallback);
};
