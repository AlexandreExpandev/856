import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { counterService } from '../../../../services/counter';
import { successResponse, errorResponse } from '../../../../utils/response';

// Validation schemas
const speedSettingsSchema = z.object({
  speed: z.number().int().min(1).max(10)
});

/**
 * @summary
 * Updates the counter speed settings
 */
export async function updateSpeedHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate request body
    const validatedData = speedSettingsSchema.parse(req.body);
    const userId = req.user.id;
    
    const result = await counterService.updateCounterSpeed(userId, validatedData.speed);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid speed setting',
        details: error.errors
      }));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Gets the current counter settings
 */
export async function getSettingsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.getCounterSettings(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}