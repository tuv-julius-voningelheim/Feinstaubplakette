export type TsRemoveEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-remove': TsRemoveEvent;
    }
}
