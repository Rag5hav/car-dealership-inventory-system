import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authRateLimiter } from '../middlewares/rateLimiter';
import { validateRegistrationPayload } from '../middlewares/validateRequest';

const router = Router();

router.post('/register', authRateLimiter, validateRegistrationPayload, register);
router.post('/login', authRateLimiter, login);

export default router;
