export interface TsTableRowClickDetail {
    /** The full row data object. */
    row: Record<string, unknown>;
    /** Zero-based index of the clicked row within the current page. */
    rowIndex: number;
}

export type TsTableRowClickEvent = CustomEvent<TsTableRowClickDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-table-row-click': TsTableRowClickEvent;
    }
}
