export type TsCancelEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-cancel': TsCancelEvent;
    }
}
