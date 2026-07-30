export interface TsShortcutSelectDetail {
    /** Zero-based index of the shortcut that was clicked. */
    index: number;
}

/** Emitted by ts-date-range when a date shortcut tag is clicked. */
export type TsShortcutSelectEvent = CustomEvent<TsShortcutSelectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-shortcut-select': TsShortcutSelectEvent;
    }
}
