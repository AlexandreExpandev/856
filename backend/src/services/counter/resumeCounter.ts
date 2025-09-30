import { CounterState, CounterStatus, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Resumes a paused counting sequence
 * 
 * @param userId User identifier
 * @returns Counter status after resuming
 */
export async function resumeCounter(userId: number): Promise<ServiceResult<CounterStatus>> {
  try {
    // Get current counter status
    const currentStatus = await dbService.getCounterStatus(userId);
    
    // Check if counter exists and is paused
    if (!currentStatus) {
      return {
        success: false,
        error: {
          code: 'COUNTER_NOT_FOUND',
          message: 'No counter found'
        }
      };
    }
    
    if (currentStatus.state !== CounterState.PAUSED) {
      return {
        success: false,
        error: {
          code: 'COUNTER_NOT_PAUSED',
          message: `Counter is not paused (current state: ${currentStatus.state})`
        }
      };
    }
    
    // Update counter status
    const updatedStatus: CounterStatus = {
      ...currentStatus,
      state: CounterState.RUNNING,
      pausedAt: undefined
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
        code: 'COUNTER_RESUME_ERROR',
        message: 'Failed to resume counter',
        details: error
      }
    };
  }
}