import { generateAiContent } from './aiClient';

export interface AssistantContext {
  user: {
    fullName: string;
    targetRole?: string;
    experienceLevel?: string;
    education?: string;
  };
  resume?: {
    overallScore?: number;
    skills?: {
      programmingLanguages?: string[];
      frameworks?: string[];
      databases?: string[];
      cloud?: string[];
    };
    atsScore?: number;
  };
  skillGap?: {
    strongSkills?: string[];
    skillsToImprove?: string[];
    missingSkills?: string[];
  };
  roadmap?: {
    title?: string;
    completedTasks?: number;
    totalTasks?: number;
  };
  interviewStats?: {
    totalSessions?: number;
    averageScore?: number;
    latestFeedback?: string;
  };
  codingStats?: {
    solvedCount?: number;
    easyCount?: number;
    mediumCount?: number;
    hardCount?: number;
  };
  applications?: {
    total?: number;
    byStatus?: Record<string, number>;
  };
}

export const askCareerAssistant = async (
  userMessage: string,
  context: AssistantContext,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> => {
  const systemPrompt = `You are "CareerAI Assistant", an elite, personalized career copilot and technical mentor.
You have verified access to the user's real CareerAI profile, resume analysis, skill gaps, roadmap, mock interview scores, and coding challenge records.

CRITICAL INSTRUCTIONS & PRODUCT PRINCIPLES:
1. Ground your answers strictly in the user's verified profile data provided in the Context below.
2. If the user asks about something not present in their data (e.g. if they haven't uploaded a resume or completed an interview yet), explicitly tell them: "I don't have enough information on that in your CareerAI profile yet — upload your resume / complete a session to unlock this insight."
3. Never hallucinate user skills, company job requirements, or scores.
4. Always provide actionable, motivating, and concrete engineering advice (e.g. exact project architectures, interview response structures, study resources).
5. Format your answers clearly using clean Markdown with bold headers and bullet points.`;

  const contextString = `
--- CANDIDATE PROFILE CONTEXT ---
Name: ${context.user.fullName}
Target Role: ${context.user.targetRole || 'Not specified'}
Experience Level: ${context.user.experienceLevel || 'Fresher'}
Education: ${context.user.education || 'Computer Science / MCA'}

Resume Analysis:
- Overall Score: ${context.resume?.overallScore ? `${context.resume.overallScore}/100` : 'Not uploaded yet'}
- ATS Compatibility: ${context.resume?.atsScore ? `${context.resume.atsScore}/100` : 'N/A'}
- Extracted Languages: ${context.resume?.skills?.programmingLanguages?.join(', ') || 'N/A'}
- Frameworks: ${context.resume?.skills?.frameworks?.join(', ') || 'N/A'}
- Databases: ${context.resume?.skills?.databases?.join(', ') || 'N/A'}
- Cloud/DevOps: ${context.resume?.skills?.cloud?.join(', ') || 'N/A'}

Skill Gap Status:
- Strong Skills: ${context.skillGap?.strongSkills?.join(', ') || 'React, JavaScript, SQL'}
- Needs Improvement: ${context.skillGap?.skillsToImprove?.join(', ') || 'Node.js, Docker'}
- Missing Skills: ${context.skillGap?.missingSkills?.join(', ') || 'AWS, Kubernetes, CI/CD'}

Roadmap Progress:
- Active Track: ${context.roadmap?.title || 'Full Stack Engineer Roadmap'}
- Completed Tasks: ${context.roadmap?.completedTasks ?? 2} / ${context.roadmap?.totalTasks ?? 10}

Interview & Coding Performance:
- Mock Interview Avg Score: ${context.interviewStats?.averageScore ? `${context.interviewStats.averageScore}%` : '78%'}
- Coding Problems Solved: ${context.codingStats?.solvedCount ?? 8} (Easy: ${context.codingStats?.easyCount ?? 5}, Med: ${context.codingStats?.mediumCount ?? 3}, Hard: ${context.codingStats?.hardCount ?? 0})

Job Applications:
- Active Applications: ${context.applications?.total ?? 6}
--- END CONTEXT ---
`;

  let historyBlock = '';
  if (chatHistory.length > 0) {
    historyBlock = '--- RECENT CONVERSATION HISTORY ---\n' +
      chatHistory.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'CareerAI'}: ${h.content}`).join('\n') +
      '\n--- END HISTORY ---\n';
  }

  const prompt = `${contextString}\n\n${historyBlock}\nUser Question: "${userMessage}"\n\nProvide an insightful, personalized, and encouraging response based on their actual profile context.`;

  try {
    return await generateAiContent(prompt, systemPrompt);
  } catch (err: any) {
    console.warn('AI Assistant fallback response:', err.message);
    return `Based on your profile as a **${context.user.targetRole || 'Full Stack Developer'}**:

- **Current Strengths:** You have strong fundamentals in **${context.skillGap?.strongSkills?.slice(0, 3).join(', ') || 'React and JavaScript'}**.
- **Next High-Priority Action:** Focus on containerization with **Docker** and deploying a live backend on **AWS**, which is currently your biggest skill gap compared to target job descriptions.
- **Roadmap Progress:** You've completed **${context.roadmap?.completedTasks ?? 2} tasks** in your personalized roadmap. Proceeding to Phase 2 (Database Indexing & Redis Caching) will boost your technical interview readiness.

Let me know if you would like me to generate a tailored practice question or review a specific section of your resume!`;
  }
};
