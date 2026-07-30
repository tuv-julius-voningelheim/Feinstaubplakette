export interface TsRequestCloseDetail {
    /** The source that triggered the close request. */
    source: 'close-button' | 'keyboard' | 'overlay';
}

export type TsRequestCloseEvent = CustomEvent<TsRequestCloseDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-request-close': TsRequestCloseEvent;
    }
}
