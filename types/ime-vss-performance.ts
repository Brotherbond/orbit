import { User } from "./user";

/**
 * Interface for daily performance data
 */
export interface DailyPerformance {
  date: string;
  daily_performance: number;
  cummulative_performance: number;
}

/**
 * Interface for performance by day
 * Uses an index signature to allow for any number of days (day_1, day_2, etc.)
 */
export interface PerformanceByDay {
  [key: string]: DailyPerformance; // Allow for dynamic day keys like day_1, day_2, etc.
}

/**
 * Interface for IME-VSS performance data
 */
export interface IMEVSSPerformance {
  user: User;
  monthly_target: number;
  daily_target: number;
  workday_count: number;
  performance_by_day: PerformanceByDay;
  cummulative_performance: number;
}
