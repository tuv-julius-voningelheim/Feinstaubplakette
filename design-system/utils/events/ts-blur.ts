export type TsBlurEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-blur': TsBlurEvent;
    }
}
