import React from 'react';
import { Calendar } from 'lucide-react';

/*
DateRangeInput component displays a date range input with start and end dates.
*/

// Create a date with time set to noon to avoid timezone issues
const createLocalDate = (year, month, day) => {
  return new Date(year, month, day, 12, 0, 0);
};

// Start of week, ensuring consistent time of day
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return createLocalDate(d.getFullYear(), d.getMonth(), diff);
};

// End of week, ensuring consistent time of day
const endOfWeek = (date) => {
  const start = startOfWeek(date);
  return createLocalDate(start.getFullYear(), start.getMonth(), start.getDate() + 6);
};

// Parse a date string to a Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  // If already a Date object, return it
  if (dateStr instanceof Date) return dateStr;
  
  try {
    // Handle ISO date strings (YYYY-MM-DD)
    if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Parse as YYYY-MM-DD to avoid timezone issues
      const [year, month, day] = dateStr.split('-').map(Number);
      return createLocalDate(year, month - 1, day);
    }
    
    // Create a new Date object if it's not already a Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Normalize to noon local time to avoid timezone issues
    return createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
  } catch (error) {
    return null;
  }
};

// Check if a date falls within a specified week
const isDateInWeek = (dateStr, weekStart, weekEnd) => {
  // Parse the date string
  const date = parseDate(dateStr);
  if (!date) {
    return false;
  }
  
  // Ensure all dates are using the same time of day for comparison
  const normalizedDate = createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
  const normalizedStart = createLocalDate(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  const normalizedEnd = createLocalDate(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
  
  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
};

// Format date for short display
const formatDateShort = (date) => {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

// Format a date range for display, ensuring consistent formatting
const formatDateRange = (start, end) => {
  const startMonth = start.toLocaleDateString(undefined, { month: 'short' });
  const endMonth = end.toLocaleDateString(undefined, { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  
  if (start.getFullYear() !== end.getFullYear()) {
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
};

// Format a single date in a user-friendly way
const formatUserDate = (dateStr) => {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  return date ? date.toLocaleDateString() : dateStr;
};

// Normalize a date string to prevent timezone issues
const normalizeDate = (dateString) => {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = createLocalDate(year, month - 1, day); 
  
  return date.toISOString().split('T')[0];
};

const DateRangeInput = ({ 
  startDate, 
  onStartDateChange, 
  endDate, 
  onEndDateChange 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date <span className="text-xs text-gray-500"></span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={startDate} 
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent"
            placeholder="Click to select start date"
          />
          {!startDate && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <Calendar size={16} />
            </div>
          )}
        </div>

      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date <span className="text-xs text-gray-500"></span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color-teal)] focus:border-transparent"
            placeholder="Click to select end date"
          />
          {!endDate && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <Calendar size={16} />
            </div>
          )}
        </div>
    
      </div>
    </div>
  );
};

// Attach utility functions to the component for external use
DateRangeInput.createLocalDate = createLocalDate;
DateRangeInput.startOfWeek = startOfWeek;
DateRangeInput.endOfWeek = endOfWeek;
DateRangeInput.parseDate = parseDate;
DateRangeInput.isDateInWeek = isDateInWeek;
DateRangeInput.formatDateShort = formatDateShort;
DateRangeInput.formatDateRange = formatDateRange;
DateRangeInput.formatUserDate = formatUserDate;
DateRangeInput.normalizeDate = normalizeDate;

export default DateRangeInput; 