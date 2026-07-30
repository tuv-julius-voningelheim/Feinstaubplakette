export type TsTabClickEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-tab-click': TsTabClickEvent;
    }
}
