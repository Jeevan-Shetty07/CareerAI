import { Router } from 'express';
import { analyzeGitHub, getLatestGitHubAnalysis } from '../controllers/githubController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.post('/analyze', rateLimiter(10, 15), analyzeGitHub);
router.get('/latest', getLatestGitHubAnalysis);

export default router;
