import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import resumeRoutes from './resumeRoutes';
import jobRoutes from './jobRoutes';
import skillRoutes from './skillRoutes';
import roadmapRoutes from './roadmapRoutes';
import interviewRoutes from './interviewRoutes';
import codingRoutes from './codingRoutes';
import applicationRoutes from './applicationRoutes';
import githubRoutes from './githubRoutes';
import assistantRoutes from './assistantRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/resumes', resumeRoutes);
router.use('/jobs', jobRoutes);
router.use('/skills', skillRoutes);
router.use('/roadmaps', roadmapRoutes);
router.use('/interviews', interviewRoutes);
router.use('/coding', codingRoutes);
router.use('/applications', applicationRoutes);
router.use('/github', githubRoutes);
router.use('/ai', assistantRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CareerAI Platform API',
    version: '1.0.0',
  });
});

export default router;
