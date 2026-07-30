/**
 * Shared, dev-facing types for `ts-table` and `ts-column`.
 * Re-exported from `utils/events/events.ts` so consumers can import them
 * from `@tuvsud/design-system` alongside the event types.
 */

export type TsTableHeaderVariant = 'primary' | 'light' | 'dark';

export type TsTableSize = 'small' | 'medium' | 'large';

export type TsTableSortDirection = 'asc' | 'desc' | 'none';

export type TsColumnSortDirection = 'asc' | 'desc' | 'none';

export interface TsTableColumnDef {
    /** Field key used to extract the value from each row in `data`. */
    field: string;
    /** Display label for the column header. */
    label?: string;
    /** Allow sorting on this column. */
    sortable?: boolean;
    /** Allow user to resize this column at runtime. */
    resizable?: boolean;
    /** Pin the column to the left or right side of the scroll container. */
    fixed?: 'left' | 'right';
    /** Initial / fixed width (e.g. `120px`, `20%`). */
    width?: string;
    /** Cell content alignment. */
    align?: 'left' | 'center' | 'right';
    /** Optional custom renderer for the cell value. */
    render?: (row: Record<string, unknown>, rowIndex: number) => unknown;
    /** Optional custom renderer for the column header label. Replaces the default `label` text. */
    renderHeader?: (col: TsTableColumnDef) => unknown;
}
