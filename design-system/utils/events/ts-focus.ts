export type TsFocusEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-focus': TsFocusEvent;
    }
}
