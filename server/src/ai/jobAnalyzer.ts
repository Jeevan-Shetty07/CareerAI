import { generateStructuredJson } from './aiClient';

export interface JobAnalysisResult {
  title: string;
  company: string;
  location?: string;
  experienceLevel: string;
  employmentType?: string;
  salaryRange?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  summary: string;
}

export const analyzeJobDescription = async (
  jobText: string,
  title?: string,
  company?: string
): Promise<JobAnalysisResult> => {
  const systemPrompt = `You are an expert Job Description Analyzer for technology roles.
Extract all key data points from the job description text with high accuracy.
Identify core required technical skills vs preferred skills, responsibilities, and experience expectations.
Do not hallucinate skills not explicitly stated or directly inferred from tech descriptions.`;

  const userPrompt = `Analyze this Job Description:
Job Title Hint: ${title || 'Not specified'}
Company Hint: ${company || 'Not specified'}

--- JOB TEXT START ---
${jobText}
--- JOB TEXT END ---

Return a JSON object with this exact structure:
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote / Hybrid",
  "experienceLevel": "Entry / Mid / Senior",
  "employmentType": "Full-time",
  "salaryRange": "$80k - $110k or Not Disclosed",
  "requiredSkills": ["React", "JavaScript", "Node.js", "REST APIs", "PostgreSQL"],
  "preferredSkills": ["Docker", "AWS", "CI/CD", "Redis"],
  "responsibilities": [
    "Build responsive web applications in React",
    "Develop scalable backend APIs in Node.js",
    "Collaborate with cross-functional product teams"
  ],
  "qualifications": [
    "Bachelor's / Master's degree in Computer Science or related field",
    "1-3 years of full-stack development experience"
  ],
  "summary": "Concise 2-sentence summary of the role and key focus."
}`;

  const fallback: JobAnalysisResult = {
    title: title || "Full Stack Software Engineer",
    company: company || "NextGen Cloud Systems",
    location: "Bengaluru, India (Hybrid)",
    experienceLevel: "Fresher / 0-2 Years",
    employmentType: "Full-time",
    salaryRange: "₹8 LPA - ₹14 LPA",
    requiredSkills: ["React", "TypeScript", "Node.js", "REST APIs", "PostgreSQL", "Git"],
    preferredSkills: ["Docker", "AWS", "Redis", "Next.js", "GraphQL"],
    responsibilities: [
      "Design and construct modular frontend user interfaces using React and TypeScript.",
      "Architect and maintain high-throughput REST APIs utilizing Node.js, Express, and PostgreSQL.",
      "Collaborate with product designers and engineers in an Agile sprint environment.",
      "Write clean, unit-tested, and well-documented production code."
    ],
    qualifications: [
      "B.Tech/BE/MCA/BCA in Computer Science, Information Technology, or relevant discipline.",
      "Strong fundamentals in Data Structures, Algorithms, and Object-Oriented Design.",
      "Demonstrated projects or internship experience in modern JavaScript/TypeScript ecosystem."
    ],
    summary: "High-growth software engineering position seeking energetic full-stack engineers with solid React, Node.js, and relational database skills to power next-generation SaaS workflows."
  };

  return await generateStructuredJson<JobAnalysisResult>(userPrompt, systemPrompt, fallback);
};
