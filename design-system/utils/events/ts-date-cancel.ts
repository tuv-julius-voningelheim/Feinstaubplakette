import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateCancelDetail {
    /** ISO date string (YYYY-MM-DD), or empty string when cleared. */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
}

/** Emitted by ts-date-picker when the user cancels a selection via the Cancel button (footer-action mode). */
export type TsDateCancelEvent = CustomEvent<TsDateCancelDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-cancel': TsDateCancelEvent;
    }
}
