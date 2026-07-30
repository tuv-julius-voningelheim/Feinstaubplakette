export interface TsTableSearchChangeDetail {
    /** The current search query. */
    query: string;
}

export type TsTableSearchChangeEvent = CustomEvent<TsTableSearchChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-table-search-change': TsTableSearchChangeEvent;
    }
}
