export interface TsMonthNavigationDetail {
    /** The new focused month date (first day of the month, normalized to midnight). */
    focused: Date;
    /** Month number of the new view (1–12). */
    month: number;
    /** Full year of the new view. */
    year: number;
}

/** Emitted by ts-date-range when the user clicks the previous month navigation button. */
export type TsPrevMonthClickEvent = CustomEvent<TsMonthNavigationDetail>;

/** Emitted by ts-date-range when the user clicks the next month navigation button. */
export type TsNextMonthClickEvent = CustomEvent<TsMonthNavigationDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-prev-month-click': TsPrevMonthClickEvent;
        'ts-next-month-click': TsNextMonthClickEvent;
    }
}
