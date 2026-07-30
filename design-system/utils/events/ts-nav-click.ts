export type TsNavClickEvent = CustomEvent<{ direction: 'prev' | 'next'; page: number }>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-nav-click': TsNavClickEvent;
    }
}
