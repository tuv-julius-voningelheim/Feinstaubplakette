export type TsLazyLoadEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-lazy-load': TsLazyLoadEvent;
    }
}
