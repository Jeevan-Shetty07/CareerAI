import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { analyzeGitHubProfile } from '../services/githubService';
import { getDb } from '../db/db';

export const analyzeGitHub = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Please provide a GitHub username or profile URL.' });
      return;
    }

    const analysis = await analyzeGitHubProfile(username);
    const { store, save } = getDb();

    // Store or update analysis for user
    const existingIndex = store.github_analyses.findIndex(g => g.userId === userId);
    const record = {
      id: `gh-${Date.now()}`,
      userId,
      ...analysis,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      store.github_analyses[existingIndex] = record;
    } else {
      store.github_analyses.push(record);
    }
    save();

    res.json({
      success: true,
      message: 'GitHub analysis completed.',
      data: record,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLatestGitHubAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const analysis = store.github_analyses.find(g => g.userId === userId);
    if (!analysis) {
      // Return default analysis for demo user
      const defaultAnalysis = await analyzeGitHubProfile('jeevankumar-dev');
      res.json({ success: true, data: defaultAnalysis });
      return;
    }

    res.json({ success: true, data: analysis });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
