import { generateStructuredJson } from './aiClient';

export interface GeneratedQuestion {
  id: string;
  questionText: string;
  category: 'Technical' | 'Behavioral' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedKeywords: string[];
  hint: string;
}

export interface AnswerEvaluation {
  technicalAccuracy: number; // 1-10
  completeness: number; // 1-10
  communication: number; // 1-10
  overallScore: number; // 1-10
  feedback: string;
  keyPointsCovered: string[];
  keyPointsMissed: string[];
  idealAnswer: string;
  followUpQuestion?: string;
}

export interface InterviewReport {
  overallScore: number;
  technicalKnowledge: number;
  communication: number;
  problemSolving: number;
  answerDepth: number;
  strengths: string[];
  areasToImprove: string[];
  recommendedPractice: string[];
  readinessVerdict: string;
  detailedSummary: string;
}

export const generateInterviewQuestions = async (
  role: string,
  experience: string,
  difficulty: string,
  interviewType: string,
  count: number = 5
): Promise<GeneratedQuestion[]> => {
  const systemPrompt = `You are a Principal Engineer and Hiring Interviewer at a top tier tech company.
Generate ${count} realistic, challenging, and insightful interview questions tailored to:
Role: "${role}", Level: "${experience}", Difficulty: "${difficulty}", Type: "${interviewType}".
Ensure questions test actual practical understanding rather than trivial syntax memorization.`;

  const userPrompt = `Generate ${count} interview questions. Return a JSON array of objects matching:
[
  {
    "id": "q-1",
    "questionText": "Explain the difference between useState and useEffect in React. When would useEffect trigger an infinite re-render loop?",
    "category": "Technical",
    "difficulty": "Medium",
    "expectedKeywords": ["state mutation", "dependency array", "lifecycle", "side effects"],
    "hint": "Focus on dependency array references and updating state within effect callbacks."
  }
]`;

  const fallback: GeneratedQuestion[] = [
    {
      id: "q-1",
      questionText: "Can you explain how React's Virtual DOM works and how React optimizes rendering with the reconciliation algorithm?",
      category: "Technical",
      difficulty: "Medium",
      expectedKeywords: ["Virtual DOM", "Diffing algorithm", "Reconciliation", "Fiber tree", "Keys"],
      hint: "Mention how React compares old and new VDOM trees in O(n) time and the importance of key props in lists."
    },
    {
      id: "q-2",
      questionText: "What is the difference between synchronous and asynchronous execution in Node.js? How does the Event Loop handle I/O-bound tasks?",
      category: "Technical",
      difficulty: "Medium",
      expectedKeywords: ["Event Loop", "libuv", "Thread pool", "Microtask queue", "Non-blocking I/O"],
      hint: "Explain how libuv offloads file system and network operations to background worker threads."
    },
    {
      id: "q-3",
      questionText: "Explain how database indexing works in PostgreSQL or MySQL. When might an index actually degrade performance?",
      category: "Technical",
      difficulty: "Medium",
      expectedKeywords: ["B-Tree", "Index lookup", "Write overhead", "Table scan", "Storage overhead"],
      hint: "Consider how indexes accelerate SELECT queries but add overhead to INSERT, UPDATE, and DELETE operations."
    },
    {
      id: "q-4",
      questionText: "Tell me about a challenging bug or technical bottleneck you encountered in a project. How did you debug and resolve it?",
      category: "Behavioral",
      difficulty: "Medium",
      expectedKeywords: ["STAR method", "Root cause analysis", "Profiling", "Problem solving", "Outcome"],
      hint: "Use the STAR method: Situation, Task, Action, and quantifiable Result."
    },
    {
      id: "q-5",
      questionText: "How would you secure a REST API against common vulnerabilities like SQL injection, CSRF, and unauthorized data access?",
      category: "Technical",
      difficulty: "Hard",
      expectedKeywords: ["Parameterized queries", "JWT validation", "CORS", "Rate limiting", "RBAC"],
      hint: "Discuss prepared statements, token expiration, HTTPS, and authorization middleware."
    }
  ];

  return await generateStructuredJson<GeneratedQuestion[]>(userPrompt, systemPrompt, fallback);
};

export const evaluateInterviewAnswer = async (
  question: string,
  answer: string,
  role: string,
  experience: string
): Promise<AnswerEvaluation> => {
  const systemPrompt = `You are an elite Technical Interview Evaluator.
Evaluate the candidate's answer thoroughly for Technical Accuracy, Completeness, and Clarity.
Then formulate an intelligent, conversational follow-up question that digs deeper into their response.`;

  const userPrompt = `Role: ${role} (${experience})
Question: "${question}"
Candidate Answer:
"${answer}"

Evaluate the answer and return a JSON object with this exact structure:
{
  "technicalAccuracy": 8,
  "completeness": 7,
  "communication": 8,
  "overallScore": 7.7,
  "feedback": "Clear explanation of core concepts with good terminology. However, missing edge-case considerations regarding cleanup functions.",
  "keyPointsCovered": ["Explained state lifecycle", "Mentioned dependency array"],
  "keyPointsMissed": ["Did not mention cleanup/unmount behavior", "Did not explain referential equality for object dependencies"],
  "idealAnswer": "A strong answer explains that useState manages local component state, whereas useEffect handles side-effects after paint. Key hazards include omitting dependencies or passing changing object references, which trigger infinite loops.",
  "followUpQuestion": "You mentioned dependency arrays. Can you describe how passing an inline object or function as a dependency can cause unnecessary re-renders, and how you would prevent that with useMemo or useCallback?"
}`;

  const wordCount = answer.trim().split(/\s+/).length;
  const baseline = Math.min(9, Math.max(5, Math.round(5 + (wordCount > 30 ? 2 : 1) + (wordCount > 60 ? 1 : 0))));

  const fallback: AnswerEvaluation = {
    technicalAccuracy: baseline,
    completeness: Math.max(5, baseline - 1),
    communication: 8,
    overallScore: baseline,
    feedback: wordCount > 20 
      ? "Good foundational explanation that addresses the main premise of the question with accurate terminology. Adding specific practical examples or edge-case handling would elevate this to a top-tier answer."
      : "Your answer touches on the correct idea, but is brief. Expand with concrete architecture examples and explain 'why' the technology behaves that way under the hood.",
    keyPointsCovered: [
      "Demonstrated correct conceptual understanding",
      "Used standard industry terminology"
    ],
    keyPointsMissed: [
      "Could elaborate on production edge cases",
      "Quantifiable performance implications"
    ],
    idealAnswer: "A top-tier answer provides clear conceptual definition, explains internal mechanics (e.g. engine/runtime behavior), discusses performance trade-offs, and provides a real-world scenario where this concept applies.",
    followUpQuestion: `Building on your point, how would you design this specifically to handle high concurrency and prevent race conditions in a production environment?`
  };

  return await generateStructuredJson<AnswerEvaluation>(userPrompt, systemPrompt, fallback);
};

export const generateFinalInterviewReport = async (
  role: string,
  qaList: Array<{ question: string; answer: string; evaluation: AnswerEvaluation }>
): Promise<InterviewReport> => {
  const systemPrompt = `You are a Principal Engineering Interview Board.
Synthesize the multi-question interview session and produce a comprehensive, structured hiring readiness report.`;

  const userPrompt = `Role: ${role}
Session Transcript:
${JSON.stringify(qaList, null, 2)}

Return a JSON object matching this schema:
{
  "overallScore": 78,
  "technicalKnowledge": 82,
  "communication": 75,
  "problemSolving": 79,
  "answerDepth": 72,
  "strengths": ["Strong understanding of core web fundamentals", "Good communication structure", "Quick grasp of architectural trade-offs"],
  "areasToImprove": ["Elaborate on production failure recovery", "Deepen system design and scaling concepts", "Structure answers with explicit trade-off comparisons"],
  "recommendedPractice": ["Practice Node.js concurrency & stream handling", "Review REST API idempotency and HTTP status conventions", "Work on 15 medium system design problems"],
  "readinessVerdict": "Nearly Ready (Minor Gaps)",
  "detailedSummary": "Candidate performed well across fundamental technical questions with clear structured communication. With targeted practice on scaling and production resilience, candidate will be well-positioned for L4 / SDE-1 roles."
}`;

  // Deterministic average
  let totalTech = 0, totalComp = 0, totalComm = 0, totalCount = qaList.length || 1;
  qaList.forEach(q => {
    totalTech += q.evaluation?.technicalAccuracy || 7;
    totalComp += q.evaluation?.completeness || 7;
    totalComm += q.evaluation?.communication || 7;
  });

  const avgTech = Math.round((totalTech / totalCount) * 10);
  const avgComm = Math.round((totalComm / totalCount) * 10);
  const avgProblem = Math.round(((totalTech + totalComp) / (2 * totalCount)) * 10);
  const avgDepth = Math.round((totalComp / totalCount) * 10);
  const overall = Math.round((avgTech * 0.35 + avgComm * 0.25 + avgProblem * 0.25 + avgDepth * 0.15));

  const fallback: InterviewReport = {
    overallScore: overall || 78,
    technicalKnowledge: avgTech || 82,
    communication: avgComm || 75,
    problemSolving: avgProblem || 79,
    answerDepth: avgDepth || 72,
    strengths: [
      "Solid understanding of core framework architecture and lifecycle hooks",
      "Clear, professional technical communication and structured reasoning",
      "Good comprehension of relational database concepts and query structure"
    ],
    areasToImprove: [
      "Include concrete production examples and edge-case failure scenarios in answers",
      "Deepen system design knowledge (caching strategies, rate limiting, event queues)",
      "Provide more detailed architectural trade-offs between alternative solutions"
    ],
    recommendedPractice: [
      "Practice multi-container backend orchestration and caching patterns",
      "Review REST API idempotency, JWT refresh rotations, and OWASP security practices",
      "Conduct 2 additional technical mock interviews on System Design & Concurrency"
    ],
    readinessVerdict: overall >= 75 ? "Nearly Ready (Minor Gaps)" : "Needs Dedicated Practice",
    detailedSummary: `Candidate achieved an overall score of ${overall}%. Demonstrated strong competence in foundational technical concepts with clear answers. Addressing edge-case depth and cloud architecture will solidify readiness for top tech roles.`
  };

  return await generateStructuredJson<InterviewReport>(userPrompt, systemPrompt, fallback);
};
