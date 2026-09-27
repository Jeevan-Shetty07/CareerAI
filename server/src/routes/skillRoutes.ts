import { Router } from 'express';
import { getSkillGapAnalysis } from '../controllers/skillController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/gap', getSkillGapAnalysis);

export default router;
