import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { analyzeJobDescription } from '../ai/jobAnalyzer';
import { matchResumeWithJob } from '../ai/skillMatcher';
import { getDb } from '../db/db';

export const analyzeJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { jobText, title, company } = req.body;

    if (!jobText || jobText.trim().length < 20) {
      res.status(400).json({ success: false, message: 'Please provide a valid job description with at least 20 characters.' });
      return;
    }

    const analysis = await analyzeJobDescription(jobText, title, company);
    const { store, save } = getDb();

    const jobRecord = {
      id: uuidv4(),
      title: analysis.title,
      company: analysis.company,
      location: analysis.location,
      experienceLevel: analysis.experienceLevel,
      salaryRange: analysis.salaryRange,
      requiredSkills: analysis.requiredSkills,
      preferredSkills: analysis.preferredSkills,
      responsibilities: analysis.responsibilities,
      qualifications: analysis.qualifications,
      summary: analysis.summary,
      rawText: jobText,
      createdAt: new Date().toISOString(),
    };

    store.jobs.push(jobRecord);
    save();

    res.json({
      success: true,
      message: 'Job description analyzed successfully.',
      data: jobRecord,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const matchJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { jobId, jobText, title, company } = req.body;
    const { store, save } = getDb();

    // Get user's resume
    const userResumes = store.resumes.filter(r => r.userId === userId);
    const latestResume = userResumes.slice(-1)[0];

    let candidateSkills = latestResume?.skills;
    if (!candidateSkills) {
      // Default baseline profile skills if no resume uploaded yet
      candidateSkills = {
        programmingLanguages: ['JavaScript', 'TypeScript', 'Java', 'Python', 'SQL'],
        frameworks: ['React', 'Node.js', 'Express.js', 'Tailwind CSS'],
        databases: ['PostgreSQL', 'MongoDB'],
        cloud: ['AWS basic'],
        devops: ['Git', 'Docker'],
        tools: ['Postman', 'VS Code'],
      };
    }

    let targetJob = null;
    if (jobId) {
      targetJob = store.jobs.find(j => j.id === jobId);
    }

    if (!targetJob && jobText) {
      const parsed = await analyzeJobDescription(jobText, title, company);
      targetJob = {
        id: uuidv4(),
        title: parsed.title,
        company: parsed.company,
        requiredSkills: parsed.requiredSkills,
        preferredSkills: parsed.preferredSkills,
        rawText: jobText,
      };
      store.jobs.push(targetJob);
    }

    if (!targetJob) {
      res.status(400).json({ success: false, message: 'Please select an existing job or provide job description text.' });
      return;
    }

    const matchResult = await matchResumeWithJob(
      candidateSkills,
      targetJob.requiredSkills || ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      targetJob.preferredSkills || ['Redis', 'Next.js', 'CI/CD'],
      targetJob.title || 'Full Stack Engineer'
    );

    const matchRecord = {
      id: uuidv4(),
      userId,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      company: targetJob.company,
      overallMatch: matchResult.overallMatch,
      matchedSkills: matchResult.matchedSkills,
      partialSkills: matchResult.partialSkills,
      missingSkills: matchResult.missingSkills,
      matchSummary: matchResult.matchSummary,
      keyStrengths: matchResult.keyStrengths,
      keyGaps: matchResult.keyGaps,
      actionPlan: matchResult.actionPlan,
      createdAt: new Date().toISOString(),
    };

    store.job_matches.push(matchRecord);
    save();

    res.json({
      success: true,
      message: 'Job matching analysis completed.',
      data: {
        job: targetJob,
        match: matchRecord,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCuratedJobs = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { store } = getDb();
    res.json({ success: true, data: store.jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
