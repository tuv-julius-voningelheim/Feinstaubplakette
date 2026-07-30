export type TsFinishEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-finish': TsFinishEvent;
    }
}
