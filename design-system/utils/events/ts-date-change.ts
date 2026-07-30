import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateChangeDetail {
    /** ISO date string (YYYY-MM-DD), or empty string when cleared. */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
}

export type TsDateChangeEvent = CustomEvent<TsDateChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-change': TsDateChangeEvent;
    }
}
