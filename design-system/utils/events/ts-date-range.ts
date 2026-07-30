import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateRangeMeta {
    /** Metadata for the start date, or null when not selected. */
    start: TsDateMeta | null;
    /** Metadata for the end date, or null when not selected. */
    end: TsDateMeta | null;
}

export interface TsDateRangeDetail {
    /** ISO date string (YYYY-MM-DD) for the start date, or empty string when cleared. */
    start: string;
    /** ISO date string (YYYY-MM-DD) for the end date, or empty string when cleared. */
    end: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich metadata for both start and end dates. */
    meta: TsDateRangeMeta;
}

/** Emitted by ts-date-range when the start or end date changes. */
export type TsDateRangeChangeEvent = CustomEvent<TsDateRangeDetail>;

/** Emitted by ts-date-range when the user confirms the selection (OK button or shortcut). */
export type TsDateRangeApplyEvent = CustomEvent<TsDateRangeDetail>;

/** Emitted by ts-date-range when the user cancels the selection. */
export type TsDateRangeCancelEvent = CustomEvent<TsDateRangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-range-change': TsDateRangeChangeEvent;
        'ts-date-range-apply': TsDateRangeApplyEvent;
        'ts-date-range-cancel': TsDateRangeCancelEvent;
    }
}
