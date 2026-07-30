export interface TsTablePageSizeChangeDetail {
    /** The newly selected items per page. */
    pageSize: number;
}

export type TsTablePageSizeChangeEvent = CustomEvent<TsTablePageSizeChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-table-page-size-change': TsTablePageSizeChangeEvent;
    }
}
