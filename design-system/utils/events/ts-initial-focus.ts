export type TsInitialFocusEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-initial-focus': TsInitialFocusEvent;
    }
}
