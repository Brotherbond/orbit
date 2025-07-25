"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"

interface CustomDatePickerProps {
  selectedRange: { from?: Date; to?: Date }
  onDateChange: (range: { from?: Date; to?: Date }) => void
}

export function CustomDatePicker({ selectedRange, onDateChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      onDateChange(range)
      // Close popover when both dates are selected
      if (range.from && range.to) {
        setIsOpen(false)
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <CalendarComponent
          mode="range"
          selected={selectedRange.from || selectedRange.to ? selectedRange as DateRange : undefined}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
