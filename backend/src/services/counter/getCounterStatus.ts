import { CounterState, CounterStatus, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Gets the current counter status including current number and state
 * 
 * @param userId User identifier
 * @returns Current counter status
 */
export async function getCounterStatus(userId: number): Promise<ServiceResult<CounterStatus>> {
  try {
    // Get current counter status
    const currentStatus = await dbService.getCounterStatus(userId);
    
    // If no counter exists, return default status
    if (!currentStatus) {
      const settings = await dbService.getCounterSettings(userId);
      
      return {
        success: true,
        data: {
          currentNumber: 0,
          state: CounterState.IDLE,
          speed: settings?.speed || 1
        }
      };
    }
    
    // Check if counter is running and should be auto-incremented
    if (currentStatus.state === CounterState.RUNNING) {
      // Calculate how many numbers should have been counted based on elapsed time and speed
      const now = new Date();
      const startTime = new Date(currentStatus.startedAt!);
      const elapsedSeconds = (now.getTime() - startTime.getTime()) / 1000;
      const expectedNumber = Math.floor(elapsedSeconds / (11 - currentStatus.speed)) + 1;
      
      // Update current number (capped at 10)
      let updatedNumber = Math.min(expectedNumber, 10);
      
      // Check if counter has reached 10
      if (updatedNumber === 10 && currentStatus.currentNumber < 10) {
        // Counter has just completed
        const completedStatus: CounterStatus = {
          ...currentStatus,
          currentNumber: 10,
          state: CounterState.COMPLETED,
          completedAt: now
        };
        
        // Save completed status
        await dbService.saveCounterStatus(userId, completedStatus);
        
        return {
          success: true,
          data: completedStatus
        };
      }
      
      // If number has changed but not completed, update status
      if (updatedNumber > currentStatus.currentNumber && updatedNumber < 10) {
        const updatedStatus: CounterStatus = {
          ...currentStatus,
          currentNumber: updatedNumber
        };
        
        // Save updated status
        await dbService.saveCounterStatus(userId, updatedStatus);
        
        return {
          success: true,
          data: updatedStatus
        };
      }
    }
    
    // Return current status
    return {
      success: true,
      data: currentStatus
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'COUNTER_STATUS_ERROR',
        message: 'Failed to get counter status',
        details: error
      }
    };
  }
}