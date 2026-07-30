export type TsChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-change': TsChangeEvent;
    }
}
