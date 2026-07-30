export type TsErrorEvent = CustomEvent<{ status?: number }>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-error': TsErrorEvent;
    }
}
