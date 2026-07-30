import { DATE_ORDER } from './date-format.js';
import { LANG, LOCALE } from './locale.js';

export type Language = (typeof LANG)[keyof typeof LANG];

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];

export type DateOrder = (typeof DATE_ORDER)[keyof typeof DATE_ORDER];

export enum DaysOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
}

export type DateValidationRule =
    | 'required'
    | 'invalidDate'
    | 'minDate'
    | 'maxDate'
    | 'minYear'
    | 'maxYear'
    | 'disabledDate'
    | 'disablePast'
    | 'disableFuture'
    | 'startAfterEnd'
    | 'endBeforeStart';

export interface DateValidationError {
    rule: DateValidationRule;
    message: string;
}

export interface DateValidationResult {
    valid: boolean;
    errors: DateValidationError[];
    date?: Date;
}

export interface DateValidationOptions {
    locale: string;
    required?: boolean;
    minDate?: string;
    maxDate?: string;
    minYear?: number;
    maxYear?: number;
    disableWeekend?: boolean;
    disableDates?: string[];
    disablePast?: boolean;
    disableFuture?: boolean;
}

export interface DateAria {
    previousMonth: string;
    nextMonth: string;
    openCalendar: string;
    selectMonth: string;
    selectYear: string;
    weekdays: string;
    calendarDateSelection: string;
    calendarIconStart: string;
    calendarIconEnd: string;
}

export interface LangData {
    calendarText: { months: string[]; monthsShort: string[]; weekdaysShort: string[] };
    error: Record<DateValidationRule, (p?: Record<string, string | number>) => string>;
    buttons: { ok: string; cancel: string };
    aria: DateAria;
    rangeDialog: string;
    fallback: { start: string; end: string };
    shortcuts: Record<number, string>;
    datePlaceholders?: Partial<Record<DateOrder, string>>;
}
