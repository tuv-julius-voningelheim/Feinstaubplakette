import type { DateTime } from 'luxon';

/**
 * Rich metadata returned by the date-picker events for the selected date.
 * Null when no date is selected.
 */
export interface TsDateMeta {
    /** ISO 8601 date string (YYYY-MM-DD). */
    iso: string | null;
    /** Unix timestamp in milliseconds. */
    timestamp: number;
    /** Day of the week (1 = Monday … 7 = Sunday, ISO weekday). */
    weekday: number;
    /** ISO week number. */
    weekNumber: number;
    /** Month number (1–12). */
    month: number;
    /** Full year. */
    year: number;
    /** Whether the date is valid. */
    isValid: boolean;
    /** Luxon DateTime instance for advanced manipulation. */
    luxon: DateTime;
    /** Whether the date was built in UTC mode. */
    utc: boolean;
    /** IANA timezone name. */
    timezone: string | null;
    /** Short offset name (e.g. "UTC+2"). */
    offsetNameShort: string | null;
    /** Total days in the year. */
    daysInYear: number | null;
    /** Total days in the month. */
    daysInMonth: number | null;
    /** Whether the year is a leap year. */
    isInLeapYear: boolean;
}

/** Shared validation error shape returned by date validation. */
export interface TsDateValidationError {
    message: string;
    [key: string]: unknown;
}
