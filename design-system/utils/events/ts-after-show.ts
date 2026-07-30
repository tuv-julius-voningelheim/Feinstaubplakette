export type TsAfterShowEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-after-show': TsAfterShowEvent;
    }
}
