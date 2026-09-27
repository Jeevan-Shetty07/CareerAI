import { Router } from 'express';
import {
  getProblems,
  getProblemById,
  runCode,
  submitCode,
  requestAiCodeReview,
  getCodingStats,
} from '../controllers/codingController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.get('/problems', getProblems);
router.get('/stats', getCodingStats);
router.get('/problems/:problemId', getProblemById);
router.post('/problems/:problemId/run', rateLimiter(40, 15), runCode);
router.post('/problems/:problemId/submit', rateLimiter(20, 15), submitCode);
router.post('/problems/:problemId/review', rateLimiter(15, 15), requestAiCodeReview);

export default router;
