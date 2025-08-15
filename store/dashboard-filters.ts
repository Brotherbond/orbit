import type {
  CustomDateRange,
  DateFilterOption,
  DateRange,
} from "@/lib/date-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Re-export types for backward compatibility
export type { CustomDateRange, DateFilterOption, DateRange };

interface DashboardFiltersState {
  selectedFilter: DateFilterOption;
  customDateRange: CustomDateRange;
  dateRange: DateRange;
}

const initialState: DashboardFiltersState = {
  selectedFilter: "This week",
  customDateRange: {},
  dateRange: {
    start_date: "",
    end_date: "",
  },
};

const dashboardFiltersSlice = createSlice({
  name: "dashboardFilters",
  initialState,
  reducers: {
    setSelectedFilter(state, action: PayloadAction<DateFilterOption>) {
      state.selectedFilter = action.payload;
    },
    setCustomDateRange(state, action: PayloadAction<CustomDateRange>) {
      state.customDateRange = action.payload;
    },
    setDateRange(state, action: PayloadAction<DateRange>) {
      state.dateRange = action.payload;
    },
    resetFilters(state) {
      state.selectedFilter = "This week";
      state.customDateRange = {};
      state.dateRange = { start_date: "", end_date: "" };
    },
  },
});

export const {
  setSelectedFilter,
  setCustomDateRange,
  setDateRange,
  resetFilters,
} = dashboardFiltersSlice.actions;

export default dashboardFiltersSlice.reducer;
