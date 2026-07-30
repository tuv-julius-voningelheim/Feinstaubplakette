import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateChangeMonthDetail {
    /** Month number (1–12). */
    month: number;
    /** Full year. */
    year: number;
    /** Rich date metadata for the first day of the visible month. */
    date: TsDateMeta | null;
}

export type TsDateChangeMonth = CustomEvent<TsDateChangeMonthDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-change-month': TsDateChangeMonth;
    }
}
