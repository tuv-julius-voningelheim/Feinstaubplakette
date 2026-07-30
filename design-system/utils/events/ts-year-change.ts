export interface TsYearChangeDetail {
    /** The newly focused Date (normalized to midnight). */
    focused: Date;
}

/** Emitted by ts-date-picker when the user navigates to a different year in the calendar header. */
export type TsYearChangeEvent = CustomEvent<TsYearChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-year-change': TsYearChangeEvent;
    }
}
