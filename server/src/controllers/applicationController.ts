import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../middleware/auth';
import { getDb } from '../db/db';

export const getApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { store } = getDb();

    const apps = store.applications.filter(a => a.userId === userId);
    res.json({ success: true, data: apps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { company, role, location, salary, jobUrl, status = 'Saved', notes, appliedDate } = req.body;

    if (!company || !role) {
      res.status(400).json({ success: false, message: 'Company name and role are required.' });
      return;
    }

    const { store, save } = getDb();

    const newApp = {
      id: uuidv4(),
      userId,
      company,
      role,
      location: location || 'Remote / Hybrid',
      salary: salary || 'Competitive',
      jobUrl: jobUrl || '',
      status, // 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected'
      notes: notes || '',
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.applications.push(newApp);
    save();

    res.status(201).json({
      success: true,
      message: 'Application added to tracker.',
      data: newApp,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { store, save } = getDb();

    const app = store.applications.find(a => a.id === id && a.userId === userId);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const oldStatus = app.status;
    Object.assign(app, req.body, { updatedAt: new Date().toISOString() });

    if (req.body.status && req.body.status !== oldStatus) {
      if (req.body.status === 'Interview') {
        store.notifications.push({
          id: uuidv4(),
          userId,
          title: 'Interview Scheduled!',
          message: `Great progress! ${app.company} moved your ${app.role} application to Interview round.`,
          type: 'application',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      } else if (req.body.status === 'Offer') {
        store.notifications.push({
          id: uuidv4(),
          userId,
          title: '🎉 Job Offer Received!',
          message: `Congratulations on receiving an offer from ${app.company} for ${app.role}!`,
          type: 'milestone',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    save();

    res.json({
      success: true,
      message: 'Application updated.',
      data: app,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { store, save } = getDb();

    const index = store.applications.findIndex(a => a.id === id && a.userId === userId);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    store.applications.splice(index, 1);
    save();

    res.json({ success: true, message: 'Application removed.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
