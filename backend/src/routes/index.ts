import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

// External routes (public access)
router.use('/external', externalRoutes);

// Internal routes (authenticated access)
router.use('/internal', internalRoutes);

export default router;