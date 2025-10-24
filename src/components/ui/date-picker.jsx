"use client";

import * as React from "react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Universal Date Picker Component
 * 
 * @param {Date} date - Selected date
 * @param {Function} onDateChange - Callback when date changes
 * @param {string} placeholder - Placeholder text (default: "Valitse päivämäärä")
 * @param {string} dateFormat - Date format string (default: "PPP")
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable the picker
 * @param {Date} fromDate - Minimum selectable date
 * @param {Date} toDate - Maximum selectable date
 */
export function DatePicker({
  date,
  onDateChange,
  placeholder = "Valitse päivämäärä",
  dateFormat = "PPP",
  className,
  disabled = false,
  fromDate,
  toDate,
  ...props
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, dateFormat, { locale: fi })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={(date) => {
            if (disabled) return true;
            if (fromDate && date < fromDate) return true;
            if (toDate && date > toDate) return true;
            return false;
          }}
          initialFocus
          locale={fi}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Date Range Picker Component
 * 
 * @param {Object} dateRange - Selected date range { from: Date, to: Date }
 * @param {Function} onDateRangeChange - Callback when date range changes
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable the picker
 */
export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Valitse aikaväli",
  className,
  disabled = false,
  ...props
}) {
  const [date, setDate] = React.useState(dateRange);

  React.useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(date);
    }
  }, [date, onDateRangeChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "PPP", { locale: fi })} -{" "}
                {format(date.to, "PPP", { locale: fi })}
              </>
            ) : (
              format(date.from, "PPP", { locale: fi })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          disabled={disabled}
          initialFocus
          locale={fi}
        />
      </PopoverContent>
    </Popover>
  );
}
