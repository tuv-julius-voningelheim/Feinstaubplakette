export type TsHideEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-hide': TsHideEvent;
    }
}
