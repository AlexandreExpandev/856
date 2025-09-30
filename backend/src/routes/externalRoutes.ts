import { Router } from 'express';
import * as securityController from '../api/external/security/auth/controller';

const router = Router();

// Authentication routes
router.post('/auth/login', securityController.loginHandler);
router.post('/auth/register', securityController.registerHandler);

export default router;