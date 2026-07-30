import type { TsDateMeta } from './ts-date-meta.js';

export interface TsDateChangeYearDetail {
    /** Full year. */
    year: number;
    /** Rich date metadata for the first day of the visible year. */
    date: TsDateMeta | null;
}

export type TsDateChangeYearEvent = CustomEvent<TsDateChangeYearDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-change-year': TsDateChangeYearEvent;
    }
}
