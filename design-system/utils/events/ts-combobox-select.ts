export interface TsComboboxSelectDetail {
    /** The value of the selected option. */
    value: string;
    /** The text label of the selected option. */
    label: string;
}

export type TsComboboxSelectEvent = CustomEvent<TsComboboxSelectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-combobox-select': TsComboboxSelectEvent;
    }
}
