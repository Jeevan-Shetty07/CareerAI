export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  degree?: string;
  college?: string;
  graduationYear?: string;
  targetRole?: string;
  experienceLevel?: string;
  bio?: string;
}

export interface ResumeData {
  id?: string;
  fileName?: string;
  rawText?: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
    gpa?: string;
  }>;
  skills?: {
    programmingLanguages: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    devops: string[];
    tools: string[];
  };
  projects?: Array<{
    title?: string;
    description?: string;
    technologies?: string[];
    link?: string;
  }>;
  experience?: Array<{
    role?: string;
    company?: string;
    duration?: string;
    achievements?: string[];
  }>;
  score?: {
    overall: number;
    atsCompatibility: number;
    impactAndMetrics: number;
    formatting: number;
    skillCoverage: number;
  };
  suggestions?: {
    criticalFixes: string[];
    formattingImprovements: string[];
    suggestedBulletPoints: string[];
    missingKeywords: string[];
  };
  createdAt?: string;
}

export interface JobMatchResult {
  id?: string;
  jobTitle: string;
  company?: string;
  overallMatch: number;
  matchedSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  matchSummary: string;
  keyStrengths: string[];
  keyGaps: string[];
  actionPlan: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  objectives: string[];
  topics: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  resources: Array<{
    name: string;
    type: string;
    url?: string;
  }>;
}

export interface Roadmap {
  id: string;
  userId?: string;
  title: string;
  targetRole: string;
  estimatedDurationWeeks: number;
  totalHours: number;
  phases: RoadmapPhase[];
  createdAt?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'system-design';
  idealAnswerKeyPoints?: string[];
}

export interface InterviewSession {
  id: string;
  userId?: string;
  role: string;
  experience: string;
  difficulty: string;
  interviewType: string;
  status: 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  answers: Array<{
    questionId: string;
    question: string;
    answer: string;
    feedback?: {
      score: number;
      strengths: string[];
      improvements: string[];
      sampleAnswer: string;
    };
  }>;
  overallScore?: number;
  report?: {
    overallScore: number;
    communicationScore: number;
    technicalScore: number;
    problemSolvingScore: number;
    summary: string;
    topStrengths: string[];
    areasToImprove: string[];
    recommendedNextSteps: string[];
  };
  createdAt?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topics: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: Record<string, string>;
  sampleTestCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  acceptanceRate: string;
}

export interface CodeSubmissionResult {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  totalPassed: number;
  totalTests: number;
  executionTimeMs: number;
  testResults: Array<{
    input: string;
    expected: string;
    actual?: string;
    passed: boolean;
    error?: string;
    executionTimeMs?: number;
  }>;
  aiReview?: {
    timeComplexity: string;
    spaceComplexity: string;
    codeQualityScore: number;
    critique: string;
    optimizations: string[];
  };
}

export interface GitHubAnalysis {
  id?: string;
  username: string;
  profileInfo: {
    name: string;
    avatarUrl: string;
    bio: string;
    publicRepos: number;
    followers: number;
    following: number;
    topLanguages: Record<string, number>;
  };
  score: {
    overall: number;
    repositoryHealth: number;
    documentation: number;
    consistency: number;
  };
  highlights: string[];
  recommendations: string[];
  updatedAt?: string;
}

export interface JobApplication {
  id: string;
  userId?: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  notes?: string;
  appliedDate?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}
