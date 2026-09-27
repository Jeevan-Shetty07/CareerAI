import { Router } from 'express';
import { uploadAndAnalyzeResume, getLatestResume, updateSuggestion } from '../controllers/resumeController';
import { authenticateUser } from '../middleware/auth';
import { uploadResumeMiddleware } from '../middleware/upload';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.post('/analyze', rateLimiter(15, 15), uploadResumeMiddleware.single('resume'), uploadAndAnalyzeResume);
router.get('/latest', getLatestResume);
router.patch('/:resumeId/suggestions/:suggestionId', updateSuggestion);

export default router;
