import { Router } from 'express';
import {
  startInterview,
  submitInterviewAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewReport,
} from '../controllers/interviewController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.post('/start', rateLimiter(15, 15), startInterview);
router.post('/:sessionId/answer', rateLimiter(30, 15), submitInterviewAnswer);
router.post('/:sessionId/complete', completeInterview);
router.get('/history', getInterviewHistory);
router.get('/report/:sessionId', getInterviewReport);

export default router;
