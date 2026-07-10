// src/common/utils/dateTime.ts
import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from "date-fns";

const parseDate = (date: Date | string): Date | null => {
  const value =
    typeof date === "string" ? parseISO(date) : date;

  return isValid(value) ? value : null;
};

const formatValue = (
  date: Date | string,
  pattern: string
): string => {
  const value = parseDate(date);

  if (!value) return "";

  return format(value, pattern);
};

export const formatDate = (
  date: Date | string,
  pattern = "dd MMM yyyy"
) => formatValue(date, pattern);

export const formatDateTime = (
  date: Date | string,
  pattern = "dd MMM yyyy, hh:mm a"
) => formatValue(date, pattern);

export const formatTime = (
  date: Date | string,
  pattern = "hh:mm a"
) => formatValue(date, pattern);

export const timeAgo = (
  date: Date | string
): string => {
  const value = parseDate(date);

  if (!value) return "";

  return formatDistanceToNow(value, {
    addSuffix: true,
  });
};

export const now = (): Date => new Date();