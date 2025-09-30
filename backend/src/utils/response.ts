/**
 * @summary
 * Utility functions for standardized API responses
 */

/**
 * Creates a standardized success response
 * 
 * @param data Response data
 * @param metadata Optional metadata
 * @returns Formatted success response
 */
export function successResponse<T>(data: T, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Creates a standardized error response
 * 
 * @param error Error details
 * @returns Formatted error response
 */
export function errorResponse(error: { code: string; message: string; details?: any }) {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
}