export interface TsCheckboxChangeDetail {
    /** Whether the checkbox is currently checked. */
    checked: boolean;
    /** Whether the checkbox is in an indeterminate state. */
    indeterminate: boolean;
    /** The value of the checkbox (`value` attribute, defaults to `"on"`). */
    value: string;
}

/** Emitted by ts-checkbox when the checked state changes. */
export type TsCheckboxChangeEvent = CustomEvent<TsCheckboxChangeDetail>;
