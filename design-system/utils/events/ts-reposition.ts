export type TsRepositionEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-reposition': TsRepositionEvent;
    }
}
