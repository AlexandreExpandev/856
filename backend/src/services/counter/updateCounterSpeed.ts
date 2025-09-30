import { CounterStatus, ServiceResult, CounterSettings } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Updates the counter speed setting
 * 
 * @param userId User identifier
 * @param speed New speed value (1-10)
 * @returns Updated counter settings
 */
export async function updateCounterSpeed(userId: number, speed: number): Promise<ServiceResult<CounterSettings>> {
  try {
    // Validate speed range
    if (speed < 1 || speed > 10) {
      return {
        success: false,
        error: {
          code: 'INVALID_SPEED',
          message: 'Speed must be between 1 and 10'
        }
      };
    }
    
    // Get current settings
    const currentSettings = await dbService.getCounterSettings(userId);
    
    // Create updated settings
    const updatedSettings: CounterSettings = {
      speed,
      autoRestart: currentSettings?.autoRestart || false
    };
    
    // Save settings
    await dbService.saveCounterSettings(userId, updatedSettings);
    
    // Update speed in current counter if exists
    const currentStatus = await dbService.getCounterStatus(userId);
    if (currentStatus) {
      const updatedStatus: CounterStatus = {
        ...currentStatus,
        speed
      };
      await dbService.saveCounterStatus(userId, updatedStatus);
    }
    
    return {
      success: true,
      data: updatedSettings
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SPEED_UPDATE_ERROR',
        message: 'Failed to update counter speed',
        details: error
      }
    };
  }
}