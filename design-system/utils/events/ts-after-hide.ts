export type TsAfterHideEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-after-hide': TsAfterHideEvent;
    }
}
