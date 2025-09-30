import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../../config';
import { LoginCredentials, ServiceResult, AuthResult } from './authTypes';
import { dbService } from '../database';

/**
 * @summary
 * Authenticates a user with email and password
 * 
 * @param credentials User login credentials
 * @returns Authentication result with user data and JWT token
 */
export async function authLogin(credentials: LoginCredentials): Promise<ServiceResult<AuthResult>> {
  try {
    // This is a placeholder for actual database integration
    // In a real application, you would query the database for the user
    const user = await dbService.findUserByEmail(credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    
    if (!passwordMatch) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name
      },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpiration }
    );
    
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          dateCreated: user.dateCreated
        },
        token
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        details: error
      }
    };
  }
}