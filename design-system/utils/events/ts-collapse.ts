export type TsCollapseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-collapse': TsCollapseEvent;
    }
}
