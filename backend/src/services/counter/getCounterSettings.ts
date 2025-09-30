import { CounterSettings, ServiceResult } from './counterTypes';
import { dbService } from '../database';

/**
 * @summary
 * Gets the current counter settings
 * 
 * @param userId User identifier
 * @returns Current counter settings
 */
export async function getCounterSettings(userId: number): Promise<ServiceResult<CounterSettings>> {
  try {
    // Get current settings
    const settings = await dbService.getCounterSettings(userId);
    
    // If no settings exist, return defaults
    if (!settings) {
      const defaultSettings: CounterSettings = {
        speed: 5,
        autoRestart: false
      };
      
      // Save default settings
      await dbService.saveCounterSettings(userId, defaultSettings);
      
      return {
        success: true,
        data: defaultSettings
      };
    }
    
    return {
      success: true,
      data: settings
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SETTINGS_ERROR',
        message: 'Failed to get counter settings',
        details: error
      }
    };
  }
}