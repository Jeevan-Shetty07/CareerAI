import { Router } from 'express';
import { analyzeJob, matchJob, getCuratedJobs } from '../controllers/jobController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.get('/curated', getCuratedJobs);
router.post('/analyze', rateLimiter(20, 15), analyzeJob);
router.post('/match', rateLimiter(20, 15), matchJob);

export default router;
