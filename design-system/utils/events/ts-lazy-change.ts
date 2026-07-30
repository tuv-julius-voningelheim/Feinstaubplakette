export type TsLazyChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-lazy-change': TsLazyChangeEvent;
    }
}
