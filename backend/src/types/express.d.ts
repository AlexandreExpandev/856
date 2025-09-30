/**
 * @summary
 * Type definitions to extend Express Request interface
 */
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      name: string;
      [key: string]: any;
    };
  }
}