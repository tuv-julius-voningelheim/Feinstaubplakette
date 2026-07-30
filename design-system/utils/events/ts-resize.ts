export type TsResizeEvent = CustomEvent<{ entries: ResizeObserverEntry[] }>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-resize': TsResizeEvent;
    }
}
