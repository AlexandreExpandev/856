import { CounterState, CounterStatus, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Resets the counter back to 1
 * 
 * @param userId User identifier
 * @returns Counter status after resetting
 */
export async function resetCounter(userId: number): Promise<ServiceResult<CounterStatus>> {
  try {
    // Get current counter status
    const currentStatus = await dbService.getCounterStatus(userId);
    
    // Check if counter exists
    if (!currentStatus) {
      return {
        success: false,
        error: {
          code: 'COUNTER_NOT_FOUND',
          message: 'No counter found'
        }
      };
    }
    
    // Get user settings
    const settings = await dbService.getCounterSettings(userId);
    
    // Create reset counter status
    const resetStatus: CounterStatus = {
      currentNumber: 1,
      state: CounterState.IDLE,
      speed: settings?.speed || currentStatus.speed,
      startedAt: undefined,
      pausedAt: undefined,
      completedAt: undefined
    };
    
    // Save to database
    await dbService.saveCounterStatus(userId, resetStatus);
    
    return {
      success: true,
      data: resetStatus
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNTER_RESET_ERROR',
        message: 'Failed to reset counter',
        details: error
      }
    };
  }
}