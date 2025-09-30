import { CounterState, CounterStatus, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Pauses an active counting sequence
 * 
 * @param userId User identifier
 * @returns Counter status after pausing
 */
export async function pauseCounter(userId: number): Promise<ServiceResult<CounterStatus>> {
  try {
    // Get current counter status
    const currentStatus = await dbService.getCounterStatus(userId);
    
    // Check if counter exists and is running
    if (!currentStatus) {
      return {
        success: false,
        error: {
          code: 'COUNTER_NOT_FOUND',
          message: 'No active counter found'
        }
      };
    }
    
    if (currentStatus.state !== CounterState.RUNNING) {
      return {
        success: false,
        error: {
          code: 'COUNTER_NOT_RUNNING',
          message: `Counter is not running (current state: ${currentStatus.state})`
        }
      };
    }
    
    // Update counter status
    const updatedStatus: CounterStatus = {
      ...currentStatus,
      state: CounterState.PAUSED,
      pausedAt: new Date()
    };
    
    // Save to database
    await dbService.saveCounterStatus(userId, updatedStatus);
    
    return {
      success: true,
      data: updatedStatus
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNTER_PAUSE_ERROR',
        message: 'Failed to pause counter',
        details: error
      }
    };
  }
}