export interface TsPaginationClickDetail {
    /** The page number associated with the click. */
    page: number;
}

export type TsPageClickEvent = CustomEvent<TsPaginationClickDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-page-click': TsPageClickEvent;
    }
}
