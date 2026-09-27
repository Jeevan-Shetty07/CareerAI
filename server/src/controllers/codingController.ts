import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { executeCodeSandbox } from '../services/codeSandbox';
import { reviewCode } from '../ai/codeReviewer';
import { getDb } from '../db/db';

export const getProblems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, topic } = req.query;
    const { store } = getDb();
    const userId = req.user?.id;

    let list = store.coding_problems || [];

    if (difficulty && difficulty !== 'All') {
      list = list.filter((p: any) => p.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
    }

    if (topic && topic !== 'All') {
      list = list.filter((p: any) => p.topics?.some((t: string) => t.toLowerCase() === (topic as string).toLowerCase()));
    }

    // Attach solved status for this user
    const userSubmissions = store.coding_submissions.filter((s: any) => s.userId === userId && s.status === 'Accepted');
    const solvedProblemIds = new Set(userSubmissions.map((s: any) => s.problemId));

    const enriched = list.map((p: any) => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics,
      acceptanceRate: p.acceptanceRate || '85%',
      isSolved: solvedProblemIds.has(p.id),
    }));

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProblemById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.params;
    const { store } = getDb();

    const problem = store.coding_problems.find((p: any) => p.id === problemId);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    res.json({ success: true, data: problem });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const runCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.params;
    const { language = 'javascript', code, customInput } = req.body;
    const { store } = getDb();

    const problem = store.coding_problems.find((p: any) => p.id === problemId);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    const testCasesToRun = customInput
      ? [{ input: customInput, expectedOutput: '' }]
      : (problem.sampleTestCases || problem.testCases?.slice(0, 2) || []);

    const verdict = await executeCodeSandbox(language, code, testCasesToRun);

    res.json({
      success: true,
      data: verdict,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { problemId } = req.params;
    const { language = 'javascript', code } = req.body;
    const { store, save } = getDb();

    const problem = store.coding_problems.find((p: any) => p.id === problemId);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    const testCases = problem.testCases || problem.sampleTestCases || [];
    const verdict = await executeCodeSandbox(language, code, testCases);

    const submission = {
      id: uuidv4(),
      userId,
      problemId,
      problemTitle: problem.title,
      language,
      code,
      status: verdict.status,
      totalPassed: verdict.totalPassed,
      totalTests: verdict.totalTests,
      executionTimeMs: verdict.executionTimeMs,
      testResults: verdict.testResults,
      createdAt: new Date().toISOString(),
    };

    store.coding_submissions.push(submission);

    if (verdict.status === 'Accepted') {
      store.notifications.push({
        id: uuidv4(),
        userId,
        title: 'Problem Solved!',
        message: `You successfully solved "${problem.title}" in ${verdict.executionTimeMs}ms.`,
        type: 'coding',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    save();

    res.json({
      success: true,
      message: verdict.status === 'Accepted' ? 'Solution Accepted!' : `Submission: ${verdict.status}`,
      data: submission,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestAiCodeReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { problemId } = req.params;
    const { language = 'javascript', code, verdict = 'Accepted' } = req.body;
    const { store } = getDb();

    const problem = store.coding_problems.find((p: any) => p.id === problemId);
    if (!problem) {
      res.status(404).json({ success: false, message: 'Problem not found.' });
      return;
    }

    const review = await reviewCode(
      problem.title,
      problem.description,
      language,
      code,
      verdict
    );

    res.json({
      success: true,
      data: review,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCodingStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const submissions = store.coding_submissions.filter((s: any) => s.userId === userId);
    const acceptedProblemIds = Array.from(new Set(submissions.filter((s: any) => s.status === 'Accepted').map((s: any) => s.problemId)));

    const problems = store.coding_problems;
    let easyCount = 0, mediumCount = 0, hardCount = 0;

    acceptedProblemIds.forEach(id => {
      const p = problems.find((prob: any) => prob.id === id);
      if (p) {
        if (p.difficulty === 'Easy') easyCount++;
        else if (p.difficulty === 'Medium') mediumCount++;
        else if (p.difficulty === 'Hard') hardCount++;
      }
    });

    const topicStats: Record<string, { solved: number; total: number }> = {};
    problems.forEach((p: any) => {
      p.topics?.forEach((t: string) => {
        if (!topicStats[t]) topicStats[t] = { solved: 0, total: 0 };
        topicStats[t].total++;
        if (acceptedProblemIds.includes(p.id)) {
          topicStats[t].solved++;
        }
      });
    });

    const topicsArray = Object.entries(topicStats).map(([topic, data]) => ({
      topic,
      solved: data.solved,
      total: data.total,
      percentage: Math.round((data.solved / Math.max(1, data.total)) * 100),
    }));

    res.json({
      success: true,
      data: {
        totalSolved: acceptedProblemIds.length,
        totalProblems: problems.length,
        difficultyBreakdown: {
          easy: { solved: easyCount, total: problems.filter((p: any) => p.difficulty === 'Easy').length },
          medium: { solved: mediumCount, total: problems.filter((p: any) => p.difficulty === 'Medium').length },
          hard: { solved: hardCount, total: problems.filter((p: any) => p.difficulty === 'Hard').length },
        },
        topicStats: topicsArray,
        recentSubmissions: submissions.slice(-5).reverse(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
