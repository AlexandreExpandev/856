import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * @summary
 * Middleware factory that creates validation middleware
 * for request body, query parameters, or URL parameters.
 */
export function validationMiddleware(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await schema.parseAsync(req[source]);
      req[source] = data;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors
        },
        timestamp: new Date().toISOString()
      });
    }
  };
}