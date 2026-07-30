export type TsAfterCollapseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-after-collapse': TsAfterCollapseEvent;
    }
}
