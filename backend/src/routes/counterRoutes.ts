import { Router } from 'express';
import * as counterController from '../api/internal/counter/controller';
import * as counterSettingsController from '../api/internal/counter/settings/controller';

const router = Router();

// Counter management routes
router.post('/start', counterController.startHandler);
router.post('/pause', counterController.pauseHandler);
router.post('/resume', counterController.resumeHandler);
router.post('/reset', counterController.resetHandler);
router.get('/status', counterController.statusHandler);

// Counter settings routes
router.put('/settings/speed', counterSettingsController.updateSpeedHandler);
router.get('/settings', counterSettingsController.getSettingsHandler);

export default router;