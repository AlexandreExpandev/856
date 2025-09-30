import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { ServiceResult, User } from './authTypes';

/**
 * @summary
 * Validates a JWT token and returns the associated user data
 * 
 * @param token JWT token to validate
 * @returns Validation result with user data
 */
export async function authValidate(token: string): Promise<ServiceResult<User>> {
  try {
    const decoded = jwt.verify(token, config.security.jwtSecret) as any;
    
    if (!decoded || !decoded.id) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      };
    }
    
    return {
      success: true,
      data: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        dateCreated: new Date(decoded.dateCreated || Date.now())
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'TOKEN_VALIDATION_ERROR',
        message: 'Token validation failed',
        details: error
      }
    };
  }
}