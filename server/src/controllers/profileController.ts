import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getDb } from '../db/db';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const profile = store.profiles.find(p => p.userId === userId);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found.' });
      return;
    }

    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store, save } = getDb();

    let profile = store.profiles.find(p => p.userId === userId);
    if (!profile) {
      profile = {
        id: `prof-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
      };
      store.profiles.push(profile);
    }

    Object.assign(profile, req.body, {
      updatedAt: new Date().toISOString(),
    });

    save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: profile,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const profile = store.profiles.find(p => p.userId === userId);
    const resume = store.resumes.filter(r => r.userId === userId).slice(-1)[0];
    const roadmaps = store.roadmaps.filter(r => r.userId === userId);
    const interviews = store.interviews.filter(i => i.userId === userId);
    const submissions = store.coding_submissions.filter(s => s.userId === userId);
    const applications = store.applications.filter(a => a.userId === userId);

    // Calculate metrics
    const resumeScore = resume?.score?.overall || 82;

    // Technical skills score
    const skillList = [
      { name: 'React', level: 90, category: 'Frameworks' },
      { name: 'JavaScript', level: 85, category: 'Programming Languages' },
      { name: 'SQL / PostgreSQL', level: 80, category: 'Databases' },
      { name: 'Java', level: 78, category: 'Programming Languages' },
      { name: 'Node.js', level: 55, category: 'Frameworks' },
      { name: 'Docker', level: 35, category: 'DevOps' },
      { name: 'AWS', level: 25, category: 'Cloud' },
    ];

    const techScore = Math.round(
      skillList.reduce((acc, s) => acc + s.level, 0) / skillList.length
    );

    // Interview readiness
    let interviewScore = 75;
    if (interviews.length > 0) {
      const avg = interviews.reduce((acc, i) => acc + (i.overallScore || 75), 0) / interviews.length;
      interviewScore = Math.round(avg);
    }

    // Coding performance
    let codingScore = 76;
    if (submissions.length > 0) {
      const accepted = submissions.filter(s => s.status === 'Accepted').length;
      codingScore = Math.min(100, Math.max(50, Math.round((accepted / submissions.length) * 100)));
    }

    // Overall career readiness
    const careerReadiness = Math.round(
      resumeScore * 0.25 + techScore * 0.25 + interviewScore * 0.25 + codingScore * 0.25
    );

    // Recent activity
    const activities = [
      {
        id: 'act-1',
        title: 'Completed React Technical Mock Interview',
        timestamp: '2 hours ago',
        type: 'interview',
        score: '84%',
      },
      {
        id: 'act-2',
        title: 'Solved Two Sum algorithm challenge in Python',
        timestamp: '5 hours ago',
        type: 'coding',
        score: 'Accepted',
      },
      {
        id: 'act-3',
        title: 'Analyzed Software Engineer Job (Cloud Systems)',
        timestamp: '1 day ago',
        type: 'job',
        score: '78% Match',
      },
      {
        id: 'act-4',
        title: 'Uploaded & parsed updated resume',
        timestamp: '2 days ago',
        type: 'resume',
        score: `${resumeScore}/100`,
      },
    ];

    // Recommended next actions
    const recommendedActions = [
      {
        id: 'rec-1',
        title: 'Bridge Docker & Containerization Gap',
        description: 'Complete Phase 3 of your Full Stack roadmap to raise job match for Tier-1 companies by +15%.',
        actionUrl: '/roadmap',
        tag: 'Skill Gap',
        priority: 'High',
      },
      {
        id: 'rec-2',
        title: 'Accept 2 High-Impact Resume Suggestions',
        description: 'Quantify metrics in your DevConnect project description to increase ATS score above 90.',
        actionUrl: '/resume',
        tag: 'Resume',
        priority: 'High',
      },
      {
        id: 'rec-3',
        title: 'Practice System Design & API Concurrency',
        description: 'Complete an adaptive 15-minute mock interview focusing on REST API error handling.',
        actionUrl: '/interview',
        tag: 'Interview',
        priority: 'Medium',
      },
      {
        id: 'rec-4',
        title: 'Solve 2 Medium Tree & Graph Challenges',
        description: 'Solidify algorithmic problem solving in the Coding Arena.',
        actionUrl: '/coding',
        tag: 'Coding',
        priority: 'Medium',
      },
    ];

    res.json({
      success: true,
      data: {
        userName: profile?.fullName || 'Jeevan Kumar',
        targetRole: profile?.targetRole || 'Full Stack Software Engineer',
        careerReadiness,
        resumeScore,
        technicalSkillsScore: techScore,
        interviewReadiness: interviewScore,
        codingPerformance: codingScore,
        skillsOverview: skillList,
        recentActivity: activities,
        recommendedActions,
        stats: {
          resumesAnalyzed: resume ? 1 : 0,
          roadmapsActive: roadmaps.length || 1,
          interviewsCompleted: interviews.length || 2,
          codingProblemsSolved: submissions.filter(s => s.status === 'Accepted').length || 8,
          activeApplications: applications.length || 5,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
