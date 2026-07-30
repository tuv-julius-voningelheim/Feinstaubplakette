import type { TsDateMeta } from './ts-date-meta.js';

export interface TsCalendarStaticSelectDetail {
    /** The raw selected Date object. */
    date: Date;
    /** ISO date string (YYYY-MM-DD). */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
}

/** Emitted by ts-calendar-static when a date is picked from the calendar. */
export type TsCalendarStaticSelectEvent = CustomEvent<TsCalendarStaticSelectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-calendar-static-select': TsCalendarStaticSelectEvent;
    }
}
