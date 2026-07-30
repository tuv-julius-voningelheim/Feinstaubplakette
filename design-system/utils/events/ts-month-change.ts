export interface TsMonthChangeDetail {
    /** The newly focused Date (normalized to midnight). */
    focused: Date;
}

/** Emitted by ts-date-picker when the user navigates to a different month in the calendar header. */
export type TsMonthChangeEvent = CustomEvent<TsMonthChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-month-change': TsMonthChangeEvent;
    }
}
