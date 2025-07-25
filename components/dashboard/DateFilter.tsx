"use client"

import { useDateFilter } from "@/hooks/use-date-filter"
import { DateFilterDropdown } from "./DateFilterDropdown"
import { CustomDatePicker } from "./CustomDatePicker"

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
