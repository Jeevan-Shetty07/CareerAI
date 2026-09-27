import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { extractTextFromFile } from '../utils/textExtractor';
import { analyzeResume } from '../ai/resumeAnalyzer';
import { getDb } from '../db/db';

export const uploadAndAnalyzeResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    let resumeText = '';
    let fileName = 'pasted_resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype, fileName);
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      fileName = req.body.fileName || 'manual_input.txt';
    } else {
      res.status(400).json({ success: false, message: 'Please upload a resume file (PDF, DOCX) or provide raw resume text.' });
      return;
    }

    if (!resumeText.trim()) {
      res.status(400).json({ success: false, message: 'Extracted resume content is empty.' });
      return;
    }

    const analysis = await analyzeResume(resumeText);
    const { store, save } = getDb();

    const resumeRecord = {
      id: uuidv4(),
      userId,
      fileName,
      rawText: resumeText,
      personalInfo: analysis.personalInfo,
      education: analysis.education,
      skills: analysis.skills,
      projects: analysis.projects,
      experience: analysis.experience,
      score: analysis.score,
      suggestions: analysis.suggestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.resumes.push(resumeRecord);
    save();

    res.json({
      success: true,
      message: 'Resume analyzed successfully.',
      data: resumeRecord,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLatestResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const userResumes = store.resumes.filter(r => r.userId === userId);
    const latest = userResumes.slice(-1)[0];

    if (!latest) {
      res.status(404).json({ success: false, message: 'No resume found for this user.' });
      return;
    }

    res.json({ success: true, data: latest });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSuggestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { resumeId, suggestionId } = req.params;
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status. Must be accepted, rejected, or pending.' });
      return;
    }

    const { store, save } = getDb();
    const resume = store.resumes.find(r => (r.id === resumeId || !resumeId) && r.userId === userId);

    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume record not found.' });
      return;
    }

    const suggestion = resume.suggestions?.find((s: any) => s.id === suggestionId);
    if (!suggestion) {
      res.status(404).json({ success: false, message: 'Suggestion not found.' });
      return;
    }

    suggestion.status = status;

    // Recalculate score bonus if accepted
    const acceptedCount = resume.suggestions.filter((s: any) => s.status === 'accepted').length;
    resume.score.overall = Math.min(100, (resume.score.overall || 80) + (status === 'accepted' ? 2 : 0));

    save();

    res.json({
      success: true,
      message: `Suggestion marked as ${status}.`,
      data: {
        suggestion,
        score: resume.score,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
