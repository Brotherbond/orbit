import { format } from "date-fns";

export type DateFilterOption =
  | "This week"
  | "This month"
  | "This quarter"
  | "All time"
  | "Custom";

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface CustomDateRange {
  from?: string;
  to?: string;
}

/**
 * Calculate date range based on filter option
 */
export function calculateDateRange(
  filter: DateFilterOption,
  customRange?: { from?: Date; to?: Date },
): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case "This week":
      return getWeekRange(today);
    case "This month":
      return getMonthRange(now);
    case "This quarter":
      return getQuarterRange(now);
    case "All time":
      return getAllTimeRange(today);
    case "Custom":
      return getCustomRange(customRange);
    default:
      return getWeekRange(today);
  }
}

function getWeekRange(today: Date): DateRange {
  const startOfWeek = new Date(today);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return {
    start_date: format(startOfWeek, "yyyy-MM-dd"),
    end_date: format(endOfWeek, "yyyy-MM-dd"),
  };
}

function getMonthRange(now: Date): DateRange {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start_date: format(startOfMonth, "yyyy-MM-dd"),
    end_date: format(endOfMonth, "yyyy-MM-dd"),
  };
}

function getQuarterRange(now: Date): DateRange {
  const quarter = Math.floor(now.getMonth() / 3);
  const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
  const endOfQuarter = new Date(now.getFullYear(), quarter * 3 + 3, 0);

  return {
    start_date: format(startOfQuarter, "yyyy-MM-dd"),
    end_date: format(endOfQuarter, "yyyy-MM-dd"),
  };
}

function getAllTimeRange(today: Date): DateRange {
  return {
    start_date: "2020-01-01",
    end_date: format(today, "yyyy-MM-dd"),
  };
}

function getCustomRange(customRange?: { from?: Date; to?: Date }): DateRange {
  if (customRange?.from && customRange?.to) {
    return {
      start_date: format(customRange.from, "yyyy-MM-dd"),
      end_date: format(customRange.to, "yyyy-MM-dd"),
    };
  }
  // Fallback to current week if custom range is incomplete
  return getWeekRange(new Date());
}

/**
 * Format custom date range for display
 */
export function formatCustomDateRange(from: string, to: string): string {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  return `${format(fromDate, "MMM dd")} - ${format(toDate, "MMM dd, yyyy")}`;
}

/**
 * Get all available filter options
 */
export const DATE_FILTER_OPTIONS: DateFilterOption[] = [
  "This week",
  "This month",
  "This quarter",
  "All time",
  "Custom",
];
