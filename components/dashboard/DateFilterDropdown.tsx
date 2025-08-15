"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DATE_FILTER_OPTIONS, type DateFilterOption } from "@/lib/date-utils"
import { ChevronDown } from "lucide-react"

interface DateFilterDropdownProps {
  selectedFilter: DateFilterOption
  displayText: string
  onFilterChange: (filter: DateFilterOption) => void
}

export function DateFilterDropdown({
  selectedFilter,
  displayText,
  onFilterChange
}: DateFilterDropdownProps) {
  const availableOptions = DATE_FILTER_OPTIONS.filter(option => option !== selectedFilter)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] justify-between">
          <span className="text-sm">{displayText}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {availableOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onFilterChange(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
