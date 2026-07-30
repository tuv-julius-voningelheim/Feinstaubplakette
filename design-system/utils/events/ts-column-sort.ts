export interface TsColumnSortDetail {
    /** The field key of the column. */
    field: string;
    /** The next sort direction proposed by the column. */
    direction: 'asc' | 'desc' | 'none';
}

export type TsColumnSortEvent = CustomEvent<TsColumnSortDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-column-sort': TsColumnSortEvent;
    }
}
