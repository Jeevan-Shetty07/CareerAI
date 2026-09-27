import { Router } from 'express';
import { chatWithAssistant, getConversationHistory } from '../controllers/assistantController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticateUser);

router.post('/chat', rateLimiter(30, 15), chatWithAssistant);
router.get('/conversations/:conversationId', getConversationHistory);

export default router;
