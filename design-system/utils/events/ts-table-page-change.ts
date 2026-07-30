export interface TsTablePageChangeDetail {
    /** The new active page (1-based). */
    page: number;
}

export type TsTablePageChangeEvent = CustomEvent<TsTablePageChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-table-page-change': TsTablePageChangeEvent;
    }
}
