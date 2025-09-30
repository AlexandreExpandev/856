import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { RegisterData, ServiceResult, AuthResult } from './authTypes';
import { dbService } from '../database';

/**
 * @summary
 * Registers a new user with name, email and password
 * 
 * @param userData User registration data
 * @returns Registration result with user data and JWT token
 */
export async function authRegister(userData: RegisterData): Promise<ServiceResult<AuthResult>> {
  try {
    // Check if user already exists
    const existingUser = await dbService.findUserByEmail(userData.email);
    
    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists'
        }
      };
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, config.security.bcryptRounds);
    
    // Create new user
    const newUser = await dbService.createUser({
      name: userData.name,
      email: userData.email,
      passwordHash
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      config.security.jwtSecret,
      { expiresIn: config.security.jwtExpiration }
    );
    
    return {
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          dateCreated: newUser.dateCreated
        },
        token
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'User registration failed',
        details: error
      }
    };
  }
}