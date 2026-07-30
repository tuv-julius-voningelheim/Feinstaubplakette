import type { TsDateMeta, TsDateValidationError } from './ts-date-meta.js';

export interface TsDateSelectDetail {
    /** ISO date string (YYYY-MM-DD), or empty string when cleared. */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
    /** Whether the selected date passes all validation rules. */
    isValid: boolean;
    /** List of validation errors (empty when valid). */
    errors: TsDateValidationError[];
    /** First error message, or empty string when valid. */
    errorMessage: string;
}

export type TsDateSelectEvent = CustomEvent<TsDateSelectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-date-select': TsDateSelectEvent;
    }
}
