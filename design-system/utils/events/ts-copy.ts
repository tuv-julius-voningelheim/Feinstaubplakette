export interface TsCopyDetail {
    /** The value that was copied. */
    value: string;
}

export type TsCopyEvent = CustomEvent<TsCopyDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-copy': TsCopyEvent;
    }
}
