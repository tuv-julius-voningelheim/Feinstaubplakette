export type TsAfterExpandEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-after-expand': TsAfterExpandEvent;
    }
}
