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
    
    // Check if counter is already running or paused (BR-005)
    if (currentStatus && (currentStatus.state === CounterState.RUNNING || currentStatus.state === CounterState.PAUSED)) {
      return {
        success: false,
        error: {
          code: 'COUNTER_ALREADY_ACTIVE',
          message: `Counter is already active (current state: ${currentStatus.state})`
        }
      };
    }
    
    // Get user settings
    const settings = await dbService.getCounterSettings(userId);
    
    // Create new counter status (BR-002)
    const newStatus: CounterStatus = {
      currentNumber: 1, // Always start at 1
      state: CounterState.RUNNING,
      speed: settings?.speed || 5,
      startedAt: new Date() // Record start timestamp (DF-006)
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
