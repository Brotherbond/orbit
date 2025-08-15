"use client"

import { format } from "date-fns"

interface MonthYearPickerProps {
  month?: string
  year?: string
  onChange: (month: string, year: string) => void
  placeholder?: string
}

export function MonthYearPicker({ 
  month, 
  year, 
  onChange
}: MonthYearPickerProps) {
  // Use current date as default
  const currentDate = new Date()
  const selectedMonth = month || format(currentDate, "MM")
  const selectedYear = year || format(currentDate, "yyyy")
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthValue = e.target.value
    onChange(monthValue, selectedYear)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearValue = e.target.value
    onChange(selectedMonth, yearValue)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Month</label>
        <select
          className="w-full h-9 px-2 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Year</label>
        <select
          className="w-full h-9 px-2 py-1 rounded border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
