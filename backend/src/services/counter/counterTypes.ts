/**
 * @summary
 * Type definitions for counter service
 */

export enum CounterState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface CounterStatus {
  currentNumber: number;
  state: CounterState;
  speed: number;
  startedAt?: Date;
  pausedAt?: Date;
  completedAt?: Date;
}

export interface CounterSettings {
  speed: number;
  autoRestart: boolean;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}