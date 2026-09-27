import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { generatePersonalizedRoadmap } from '../ai/roadmapGenerator';
import { getDb } from '../db/db';

export const getRoadmap = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store, save } = getDb();

    let roadmap = store.roadmaps.filter(r => r.userId === userId).slice(-1)[0];

    if (!roadmap) {
      // Auto-generate default roadmap for new user
      const profile = store.profiles.find(p => p.userId === userId);
      const targetRole = profile?.targetRole || 'Full Stack Software Engineer';

      const generated = await generatePersonalizedRoadmap(
        targetRole,
        ['React', 'JavaScript', 'SQL', 'Git'],
        ['Node.js', 'Docker', 'AWS', 'System Design'],
        profile?.experienceLevel || 'Fresher'
      );

      roadmap = {
        id: uuidv4(),
        userId,
        ...generated,
        createdAt: new Date().toISOString(),
      };

      store.roadmaps.push(roadmap);
      save();
    }

    // Calculate completion stats
    let totalTasks = 0;
    let completedTasks = 0;

    roadmap.phases.forEach((phase: any) => {
      phase.tasks.forEach((task: any) => {
        totalTasks++;
        if (task.isCompleted) completedTasks++;
      });
    });

    const progressPercentage = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);

    res.json({
      success: true,
      data: {
        ...roadmap,
        totalTasks,
        completedTasks,
        progressPercentage,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNewRoadmap = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { targetRole, missingSkills } = req.body;
    const { store, save } = getDb();

    const profile = store.profiles.find(p => p.userId === userId);
    const role = targetRole || profile?.targetRole || 'Full Stack Engineer';

    const generated = await generatePersonalizedRoadmap(
      role,
      ['React', 'TypeScript', 'SQL', 'Git'],
      missingSkills || ['Docker', 'AWS', 'System Design'],
      profile?.experienceLevel || 'Fresher'
    );

    const roadmap = {
      id: uuidv4(),
      userId,
      ...generated,
      createdAt: new Date().toISOString(),
    };

    store.roadmaps.push(roadmap);
    save();

    res.status(201).json({
      success: true,
      message: 'New personalized roadmap generated successfully.',
      data: roadmap,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleTaskCompletion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { taskId } = req.params;
    const { store, save } = getDb();

    const roadmap = store.roadmaps.filter(r => r.userId === userId).slice(-1)[0];

    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found.' });
      return;
    }

    let foundTask = null;
    for (const phase of roadmap.phases) {
      for (const task of phase.tasks) {
        if (task.id === taskId) {
          task.isCompleted = !task.isCompleted;
          foundTask = task;
          break;
        }
      }
      if (foundTask) break;
    }

    if (!foundTask) {
      res.status(404).json({ success: false, message: 'Task ID not found in active roadmap.' });
      return;
    }

    save();

    // Recompute total progress
    let totalTasks = 0;
    let completedTasks = 0;

    roadmap.phases.forEach((phase: any) => {
      phase.tasks.forEach((task: any) => {
        totalTasks++;
        if (task.isCompleted) completedTasks++;
      });
    });

    const progressPercentage = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);

    // If milestone reached (100%), add notification
    if (progressPercentage === 100) {
      store.notifications.push({
        id: uuidv4(),
        userId,
        title: 'Roadmap Milestone Completed!',
        message: `Congratulations! You have completed 100% of your ${roadmap.title}.`,
        type: 'milestone',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      save();
    }

    res.json({
      success: true,
      message: `Task "${foundTask.name}" marked as ${foundTask.isCompleted ? 'completed' : 'incomplete'}.`,
      data: {
        task: foundTask,
        progressPercentage,
        completedTasks,
        totalTasks,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
