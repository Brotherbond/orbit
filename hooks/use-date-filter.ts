import {
  calculateDateRange,
  formatCustomDateRange,
  type CustomDateRange,
  type DateFilterOption,
} from "@/lib/date-utils";
import type { RootState } from "@/store";
import {
  setCustomDateRange,
  setDateRange,
  setSelectedFilter,
} from "@/store/dashboard-filters";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useDateFilter() {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(
    (state: RootState) => state.dashboardFilters.selectedFilter,
  );
  const customDateRange = useSelector(
    (state: RootState) => state.dashboardFilters.customDateRange,
  );

  const handleFilterChange = useCallback(
    (filter: DateFilterOption) => {
      dispatch(setSelectedFilter(filter));

      if (filter !== "Custom") {
        // Clear custom date range for non-custom filters
        dispatch(setCustomDateRange({}));
        const dateRange = calculateDateRange(filter);
        dispatch(setDateRange(dateRange));
      }
    },
    [dispatch],
  );

  const handleCustomDateChange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      const customRange: CustomDateRange = {
        from: range.from?.toISOString(),
        to: range.to?.toISOString(),
      };

      dispatch(setCustomDateRange(customRange));

      if (range.from && range.to) {
        const dateRange = calculateDateRange("Custom", range);
        dispatch(setDateRange(dateRange));
      }
    },
    [dispatch],
  );

  const getDisplayText = useCallback(() => {
    if (
      selectedFilter === "Custom" &&
      customDateRange.from &&
      customDateRange.to
    ) {
      return formatCustomDateRange(customDateRange.from, customDateRange.to);
    }
    return selectedFilter;
  }, [selectedFilter, customDateRange]);

  const getCustomDateSelection = useCallback(() => {
    return {
      from: customDateRange.from ? new Date(customDateRange.from) : undefined,
      to: customDateRange.to ? new Date(customDateRange.to) : undefined,
    };
  }, [customDateRange]);

  return {
    selectedFilter,
    customDateRange,
    handleFilterChange,
    handleCustomDateChange,
    getDisplayText,
    getCustomDateSelection,
  };
}
