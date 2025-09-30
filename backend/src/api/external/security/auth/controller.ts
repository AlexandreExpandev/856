import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../../../../services/auth';
import { successResponse, errorResponse } from '../../../../utils/response';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

/**
 * @summary
 * Handles user login requests, validates credentials and returns JWT token
 */
export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Attempt login
    const result = await authService.login(validatedData);
    
    if (!result.success) {
      res.status(401).json(errorResponse(result.error));
      return;
    }
    
    res.json(successResponse(result.data));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid login data',
        details: error.errors
      }));
      return;
    }
    next(error);
  }
}

/**
 * @summary
 * Handles user registration requests, creates new user accounts
 */
export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    
    // Attempt registration
    const result = await authService.register(validatedData);
    
    if (!result.success) {
      res.status(400).json(errorResponse(result.error));
      return;
    }
    
    res.status(201).json(successResponse(result.data));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Invalid registration data',
        details: error.errors
      }));
      return;
    }
    next(error);
  }
}