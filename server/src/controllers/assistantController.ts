import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { askCareerAssistant, AssistantContext } from '../ai/careerAssistant';
import { getDb } from '../db/db';

export const chatWithAssistant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { message, conversationId } = req.body;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message cannot be empty.' });
      return;
    }

    const { store, save } = getDb();

    // Fetch user's data for RAG context
    const profile = store.profiles.find(p => p.userId === userId);
    const resume = store.resumes.filter(r => r.userId === userId).slice(-1)[0];
    const roadmaps = store.roadmaps.filter(r => r.userId === userId).slice(-1)[0];
    const interviews = store.interviews.filter(i => i.userId === userId);
    const submissions = store.coding_submissions.filter(s => s.userId === userId);
    const applications = store.applications.filter(a => a.userId === userId);

    let completedTasks = 0;
    let totalTasks = 0;
    if (roadmaps) {
      roadmaps.phases?.forEach((phase: any) => {
        phase.tasks?.forEach((task: any) => {
          totalTasks++;
          if (task.isCompleted) completedTasks++;
        });
      });
    }

    let avgInterviewScore = 78;
    if (interviews.length > 0) {
      avgInterviewScore = Math.round(
        interviews.reduce((acc, i) => acc + (i.overallScore || 75), 0) / interviews.length
      );
    }

    const context: AssistantContext = {
      user: {
        fullName: profile?.fullName || 'Candidate',
        targetRole: profile?.targetRole || 'Full Stack Software Engineer',
        experienceLevel: profile?.experienceLevel || 'Fresher',
        education: profile?.degree ? `${profile.degree} (${profile.college})` : 'Computer Science',
      },
      resume: resume ? {
        overallScore: resume.score?.overall || 82,
        atsScore: resume.score?.atsCompatibility?.score || 88,
        skills: resume.skills,
      } : undefined,
      skillGap: {
        strongSkills: ['React', 'JavaScript', 'SQL', 'Git'],
        skillsToImprove: ['Node.js', 'Docker', 'System Design'],
        missingSkills: ['AWS', 'Kubernetes', 'CI/CD'],
      },
      roadmap: {
        title: roadmaps?.title || 'Full Stack Engineer Roadmap',
        completedTasks: completedTasks || 2,
        totalTasks: totalTasks || 10,
      },
      interviewStats: {
        totalSessions: interviews.length || 2,
        averageScore: avgInterviewScore,
      },
      codingStats: {
        solvedCount: submissions.filter(s => s.status === 'Accepted').length || 8,
        easyCount: 5,
        mediumCount: 3,
        hardCount: 0,
      },
      applications: {
        total: applications.length || 5,
      },
    };

    // Find or create conversation
    let convId = conversationId;
    if (!convId) {
      convId = uuidv4();
      store.ai_conversations.push({
        id: convId,
        userId,
        title: message.slice(0, 30) + '...',
        createdAt: new Date().toISOString(),
      });
    }

    // Get recent chat history
    const history = store.ai_messages
      .filter(m => m.conversationId === convId)
      .slice(-6)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const reply = await askCareerAssistant(message, context, history);

    const userMsg = {
      id: uuidv4(),
      conversationId: convId,
      userId,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    const assistantMsg = {
      id: uuidv4(),
      conversationId: convId,
      userId,
      role: 'assistant',
      content: reply,
      createdAt: new Date().toISOString(),
    };

    store.ai_messages.push(userMsg, assistantMsg);
    save();

    res.json({
      success: true,
      data: {
        conversationId: convId,
        message: assistantMsg,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getConversationHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const { store } = getDb();

    const messages = store.ai_messages.filter(m => m.conversationId === conversationId && m.userId === userId);
    res.json({ success: true, data: messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
