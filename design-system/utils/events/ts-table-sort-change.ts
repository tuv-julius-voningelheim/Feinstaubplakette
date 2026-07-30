export interface TsTableSortChangeDetail {
    /** The field key being sorted, or `null` when sort is cleared. */
    field: string | null;
    /** The current sort direction. */
    direction: 'asc' | 'desc' | 'none';
}

export type TsTableSortChangeEvent = CustomEvent<TsTableSortChangeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-table-sort-change': TsTableSortChangeEvent;
    }
}
