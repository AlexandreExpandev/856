/**
 * @summary
 * Type definitions for authentication service
 */

export interface User {
  id: number;
  name: string;
  email: string;
  dateCreated: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}