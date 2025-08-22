"use client"

import { useDateFilter } from "@/hooks/use-date-filter"
import { CustomDatePicker } from "./CustomDatePicker"
import { DateFilterDropdown } from "./DateFilterDropdown"

export function DateFilter() {
  const {
    selectedFilter,
    handleFilterChange,
    handleCustomDateChange,
    getDisplayText,
    getCustomDateSelection,
  } = useDateFilter()

  return (
    <div className="flex items-center gap-2">
      <DateFilterDropdown
        selectedFilter={selectedFilter}
        displayText={getDisplayText()}
        onFilterChange={handleFilterChange}
      />

      {selectedFilter === "Custom" && (
        <CustomDatePicker
          selectedRange={getCustomDateSelection()}
          onDateChange={handleCustomDateChange}
        />
      )}
    </div>
  )
}
