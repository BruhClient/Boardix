

import { clsx, type ClassValue } from "clsx"
import { format, subMonths } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function extractFileKey(fileUrl: string): string | null {
  const match = fileUrl.match(/\/f\/([^/]+)/);
  return match ? match[1] : null;
}

export function timeAgo(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];

  let duration = seconds;
  for (let i = 0; i < intervals.length; i++) {
    const [divisor, unit] = intervals[i];
    if (Math.abs(duration) < divisor) {
      return rtf.format(-Math.floor(duration), unit);
    }
    duration /= divisor;
  }

  return 'just now';
}

export function capitalizeFirstLetter(str : string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function summarizeByDayWithZeroCount(data: { created_at: Date }[]) {
  // Get the month and year from the first entry's createdAt date
  const firstDate = new Date(data[0]?.created_at);
  if (!firstDate) return [];

  const month = firstDate.getMonth(); // Month (0-indexed)
  const year = firstDate.getFullYear(); // Year
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month (handles 30/31 days)

  // Initialize an array to store the counts, with all days initialized to 0
  const dayCounts: number[] = Array(daysInMonth).fill(0);

  // Loop through the data and increment counts for the corresponding day
  data.forEach((item) => {
    const day = item.created_at.getDate(); // Extract the day of the month
    dayCounts[day - 1] += 1; // Increment the count for that day (indexing is zero-based)
  });

  // Convert the dayCounts array into a list of objects {date, count}
  const result = dayCounts.map((count, index) => ({
    date: index + 1, // Day of the month (1-based)
    count: count,
  }));

  return result;
}


export const getTimelineDescription = (filter : string) => { 
  const date = Date.now()
  switch (filter) { 
    case "month" : { 
      return format(date,"MMM yyyy")
    }
    case "year" : { 
      return format(date,"yyyy")
    }
    case "last-month" :{ 
      const lastMonth = subMonths(date,1)
      return format(lastMonth,"MMM yyyy")
    }
    default : { 
      return ""
    }
  }
}

export function getYearsSinceDate(date: Date): number[] {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid Date object provided.");
  }

  const startYear = date.getFullYear();
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
}
