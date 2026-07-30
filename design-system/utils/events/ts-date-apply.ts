import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateApplyDetail {
    /** ISO date string (YYYY-MM-DD), or empty string when cleared. */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
}

/** Emitted by ts-date-picker when the user confirms a selection via the OK button (footer-action mode). */
export type TsDateApplyEvent = CustomEvent<TsDateApplyDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-apply': TsDateApplyEvent;
    }
}
