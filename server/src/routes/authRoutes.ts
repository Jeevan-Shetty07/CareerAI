import { Router } from 'express';
import { register, login, refreshToken, getMe } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', rateLimiter(20, 15), register);
router.post('/login', rateLimiter(30, 15), login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateUser, getMe);

export default router;
