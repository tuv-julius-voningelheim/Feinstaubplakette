export type TsExpandEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-expand': TsExpandEvent;
    }
}
