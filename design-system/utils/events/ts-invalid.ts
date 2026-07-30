export type TsInvalidEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-invalid': TsInvalidEvent;
    }
}
