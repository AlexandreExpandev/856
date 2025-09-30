import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * @summary
 * Global error handling middleware that processes all uncaught errors
 * and returns standardized error responses.
 */
export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Error occurred', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Create standardized error response
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message || 'Internal server error',
      details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    },
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(errorResponse);
}