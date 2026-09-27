import { Router } from 'express';
import { getAdminMetrics } from '../controllers/adminController';
import { authenticateUser, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);
router.use(requireRole('ADMIN'));

router.get('/metrics', getAdminMetrics);

export default router;
