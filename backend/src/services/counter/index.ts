import { startCounter } from './startCounter';
import { pauseCounter } from './pauseCounter';
import { resumeCounter } from './resumeCounter';
import { resetCounter } from './resetCounter';
import { getCounterStatus } from './getCounterStatus';
import { updateCounterSpeed } from './updateCounterSpeed';
import { getCounterSettings } from './getCounterSettings';

export const counterService = {
  startCounter,
  pauseCounter,
  resumeCounter,
  resetCounter,
  getCounterStatus,
  updateCounterSpeed,
  getCounterSettings
};

export * from './counterTypes';