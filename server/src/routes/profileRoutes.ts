import { Router } from 'express';
import { getProfile, updateProfile, getDashboardMetrics } from '../controllers/profileController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/dashboard-metrics', getDashboardMetrics);

export default router;
