// src/common/utils/dateTime.ts
import {
  format,
  parseISO,
  isValid,
  formatDistanceToNow,
} from "date-fns";

/**
 * Format Date
 * Example: 15 May 2026
 */
export const formatDate = (
  date: Date | string,
  dateFormat = "dd MMM yyyy"
): string => {
  const value = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(value)) return "";

  return format(value, dateFormat);
};

/**
 * Format Date & Time
 * Example: 15 May 2026, 02:35 PM
 */
export const formatDateTime = (
  date: Date | string,
  dateFormat = "dd MMM yyyy, hh:mm a"
): string => {
  const value = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(value)) return "";

  return format(value, dateFormat);
};

/**
 * Format Time
 * Example: 02:35 PM
 */
export const formatTime = (
  date: Date | string,
  timeFormat = "hh:mm a"
): string => {
  const value = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(value)) return "";

  return format(value, timeFormat);
};

/**
 * Relative Time
 * Example:
 * 5 minutes ago
 * 2 hours ago
 * 3 days ago
 */
export const timeAgo = (date: Date | string): string => {
  const value = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(value)) return "";

  return formatDistanceToNow(value, {
    addSuffix: true,
  });
};

/**
 * Current Timestamp
 */
export const now = (): Date => new Date();