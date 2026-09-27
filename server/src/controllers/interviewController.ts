import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
} from '../ai/interviewGenerator';
import { getDb } from '../db/db';

export const startInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { role = 'Frontend Developer', experience = 'Fresher', difficulty = 'Medium', interviewType = 'Technical' } = req.body;

    const questions = await generateInterviewQuestions(role, experience, difficulty, interviewType, 4);
    const { store, save } = getDb();

    const session = {
      id: uuidv4(),
      userId,
      role,
      experience,
      difficulty,
      interviewType,
      status: 'in_progress', // 'in_progress' | 'completed'
      currentQuestionIndex: 0,
      questions,
      answers: [] as Array<{
        questionId: string;
        questionText: string;
        userAnswer: string;
        evaluation?: any;
      }>,
      createdAt: new Date().toISOString(),
    };

    store.interviews.push(session);
    save();

    res.status(201).json({
      success: true,
      message: 'Mock interview session initialized.',
      data: {
        sessionId: session.id,
        role: session.role,
        difficulty: session.difficulty,
        interviewType: session.interviewType,
        totalQuestions: session.questions.length,
        currentQuestionIndex: 0,
        currentQuestion: session.questions[0],
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitInterviewAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    if (!answer || answer.trim().length < 5) {
      res.status(400).json({ success: false, message: 'Please provide a meaningful answer.' });
      return;
    }

    const { store, save } = getDb();
    const session = store.interviews.find(s => s.id === sessionId && s.userId === userId);

    if (!session) {
      res.status(404).json({ success: false, message: 'Interview session not found.' });
      return;
    }

    const question = session.questions.find((q: any) => q.id === questionId) || session.questions[session.currentQuestionIndex];
    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found.' });
      return;
    }

    // Evaluate answer with AI
    const evaluation = await evaluateInterviewAnswer(
      question.questionText,
      answer,
      session.role,
      session.experience
    );

    // Save answer & evaluation
    session.answers.push({
      questionId: question.id,
      questionText: question.questionText,
      userAnswer: answer,
      evaluation,
    });

    session.currentQuestionIndex += 1;
    const isCompleted = session.currentQuestionIndex >= session.questions.length;

    save();

    res.json({
      success: true,
      message: 'Answer evaluated.',
      data: {
        evaluation,
        isCompleted,
        nextQuestionIndex: session.currentQuestionIndex,
        nextQuestion: isCompleted ? null : session.questions[session.currentQuestionIndex],
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const completeInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { store, save } = getDb();

    const session = store.interviews.find(s => s.id === sessionId && s.userId === userId);
    if (!session) {
      res.status(404).json({ success: false, message: 'Interview session not found.' });
      return;
    }

    const formattedQa = session.answers.map((a: any) => ({
      question: a.questionText,
      answer: a.userAnswer,
      evaluation: a.evaluation,
    }));

    const report = await generateFinalInterviewReport(session.role, formattedQa);

    session.status = 'completed';
    session.overallScore = report.overallScore;
    session.report = report;
    session.completedAt = new Date().toISOString();

    // Add notification
    store.notifications.push({
      id: uuidv4(),
      userId,
      title: 'Interview Report Ready',
      message: `You scored ${report.overallScore}% in your ${session.role} mock interview!`,
      type: 'interview',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    save();

    res.json({
      success: true,
      message: 'Interview session completed and report generated.',
      data: {
        session,
        report,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInterviewHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const history = store.interviews
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInterviewReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { store } = getDb();

    const session = store.interviews.find(s => s.id === sessionId && s.userId === userId);
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found.' });
      return;
    }

    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
