export type TsClearEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-clear': TsClearEvent;
    }
}
