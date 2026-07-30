export type TsLoadEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-load': TsLoadEvent;
    }
}
