import { CounterState, CounterStatus, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Starts a new counting sequence from 1
 * 
 * @param userId User identifier
 * @returns Counter status after starting
 */
export async function startCounter(userId: number): Promise<ServiceResult<CounterStatus>> {
  try {
    // Get current counter status
    const currentStatus = await dbService.getCounterStatus(userId);
    
    // Check if counter is already running
    if (currentStatus && currentStatus.state === CounterState.RUNNING) {
      return {
        success: false,
        error: {
          code: 'COUNTER_ALREADY_RUNNING',
          message: 'Counter is already running'
        }
      };
    }
    
    // Get user settings
    const settings = await dbService.getCounterSettings(userId);
    
    // Create new counter status
    const newStatus: CounterStatus = {
      currentNumber: 1,
      state: CounterState.RUNNING,
      speed: settings?.speed || 1,
      startedAt: new Date()
    };
    
    // Save to database
    await dbService.saveCounterStatus(userId, newStatus);
    
    return {
      success: true,
      data: newStatus
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNTER_START_ERROR',
        message: 'Failed to start counter',
        details: error
      }
    };
  }
}