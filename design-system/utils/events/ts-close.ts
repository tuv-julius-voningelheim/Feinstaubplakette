export type TsCloseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-close': TsCloseEvent;
    }
}
