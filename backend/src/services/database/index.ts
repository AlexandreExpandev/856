import { User } from '../auth/authTypes';
import { CounterStatus, CounterSettings } from '../counter/counterTypes';

// In-memory database for development/demo purposes
const db = {
  users: new Map<string, any>(),
  counters: new Map<number, CounterStatus>(),
  settings: new Map<number, CounterSettings>()
};

/**
 * @summary
 * Database service with methods for data access
 * In a real application, this would connect to an actual database
 */
export const dbService = {
  /**
   * Find a user by email
   */
  async findUserByEmail(email: string): Promise<any | null> {
    return db.users.get(email) || null;
  },
  
  /**
   * Create a new user
   */
  async createUser(userData: { name: string; email: string; passwordHash: string }): Promise<any> {
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      dateCreated: new Date()
    };
    
    db.users.set(userData.email, newUser);
    return newUser;
  },
  
  /**
   * Get counter status for a user
   */
  async getCounterStatus(userId: number): Promise<CounterStatus | null> {
    return db.counters.get(userId) || null;
  },
  
  /**
   * Save counter status for a user
   */
  async saveCounterStatus(userId: number, status: CounterStatus): Promise<void> {
    db.counters.set(userId, status);
  },
  
  /**
   * Get counter settings for a user
   */
  async getCounterSettings(userId: number): Promise<CounterSettings | null> {
    return db.settings.get(userId) || null;
  },
  
  /**
   * Save counter settings for a user
   */
  async saveCounterSettings(userId: number, settings: CounterSettings): Promise<void> {
    db.settings.set(userId, settings);
  }
};