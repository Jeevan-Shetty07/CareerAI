import { Router } from 'express';
import { getRoadmap, createNewRoadmap, toggleTaskCompletion } from '../controllers/roadmapController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.get('/', getRoadmap);
router.post('/generate', rateLimiter(10, 15), createNewRoadmap);
router.patch('/tasks/:taskId/toggle', toggleTaskCompletion);

export default router;
