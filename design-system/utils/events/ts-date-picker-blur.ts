import type { TsDateMeta, TsDateValidationError } from './ts-date-meta.js';

export interface TsDatePickerBlurDetail {
    /** ISO date string (YYYY-MM-DD), or empty string when cleared. */
    value: string;
    /** Active locale (e.g. "en", "de"). */
    locale: string;
    /** Rich date metadata, or null when no date is selected. */
    meta: TsDateMeta | null;
    /** Whether the current value passes all validation rules. */
    isValid: boolean;
    /** List of validation errors (empty when valid). */
    errors: TsDateValidationError[];
    /** First error message, or empty string when valid. */
    errorMessage: string;
}

/** Emitted by ts-date-picker when the input loses focus. */
export type TsDatePickerBlurEvent = CustomEvent<TsDatePickerBlurDetail>;
