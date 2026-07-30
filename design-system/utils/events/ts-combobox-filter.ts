export interface TsComboboxFilterDetail {
    /** The current filter query string typed by the user. */
    value: string;
}

export type TsComboboxFilterEvent = CustomEvent<TsComboboxFilterDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-combobox-filter': TsComboboxFilterEvent;
    }
}
