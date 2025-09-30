import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { counterService } from '../../../services/counter';
import { successResponse, errorResponse } from '../../../utils/response';

/**
 * @summary
 * Starts a new counting sequence from 1
 */
export async function startHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.startCounter(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Pauses an active counting sequence
 */
export async function pauseHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.pauseCounter(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Resumes a paused counting sequence
 */
export async function resumeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.resumeCounter(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Resets the counter back to 1
 */
export async function resetHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.resetCounter(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}

/**
 * @summary
 * Gets the current counter status including current number and state
 */
export async function statusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user.id;
    const result = await counterService.getCounterStatus(userId);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    next(error);
  }
}