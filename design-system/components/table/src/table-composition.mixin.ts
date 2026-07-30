import { query, state } from 'lit/decorators.js';

import type ComponentElement from '@utils/internal/component-element.js';

import type { TsCell } from '../cell/index.js';
import type { TsColumn } from '../column/index.js';
import type { TsRow } from '../row/index.js';
import type { Constructor, TableDataInstance } from './table-data.mixin.js';

export interface TableCompositionInstance extends TableDataInstance {
    hasSlottedTable: boolean;
    hasCustomHeader: boolean;
    hasCustomFooter: boolean;
    hasCustomEmpty: boolean;
    readonly defaultSlot: HTMLSlotElement | undefined;
    readonly isNativeMode: boolean;
    getSlottedTable(): HTMLTableElement | undefined;
    peekSlottedTable(): HTMLTableElement | undefined;
    getSlottedTsRows(): TsRow[];
    getCompositionBodyRows(): TsRow[];
    getCompositionColumns(): TsColumn[];
    getRowCells(row: TsRow): TsCell[];
    syncCompositionColumns(): void;
    syncCompositionRows(): void;
    focusCompositionRow(index: number): void;
    handleSlotChange: () => void;
    handleCompositionRowClick: (event: MouseEvent) => void;
    handleCompositionKeydown: (event: KeyboardEvent) => void;
    handleCompositionFocusIn: (event: FocusEvent) => void;
    handleHostFocusOut: (event: FocusEvent) => void;
    handleNativeTableClick: (event: MouseEvent) => void;
}

export const TableCompositionMixin = <TBase extends Constructor<ComponentElement & TableDataInstance>>(
    Base: TBase,
): TBase & Constructor<TableCompositionInstance> => {
    class TableCompositionMixinClass extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);
        }

        @state() hasSlottedTable = false;
        @state() hasCustomHeader = false;
        @state() hasCustomFooter = false;
        @state() hasCustomEmpty = false;

        @query('slot:not([name])') defaultSlot?: HTMLSlotElement;

        get isNativeMode(): boolean {
            return !this.isDataMode && this.hasSlottedTable;
        }

        getSlottedTable(): HTMLTableElement | undefined {
            const assigned = this.defaultSlot?.assignedElements({ flatten: true }) ?? [];
            return assigned.find(el => el.tagName.toLowerCase() === 'table') as HTMLTableElement | undefined;
        }

        peekSlottedTable(): HTMLTableElement | undefined {
            const fromSlot = this.getSlottedTable();
            if (fromSlot) return fromSlot;
            return (this.querySelector(':scope > table') as HTMLTableElement | null) ?? undefined;
        }

        getSlottedTsRows(): TsRow[] {
            const assigned = this.defaultSlot?.assignedElements({ flatten: true }) ?? [];
            return assigned.filter(el => el.tagName.toLowerCase() === 'ts-row') as TsRow[];
        }

        getCompositionBodyRows(): TsRow[] {
            return this.getSlottedTsRows().filter(row => !row.header);
        }

        getCompositionColumns(): TsColumn[] {
            const header = this.getSlottedTsRows().find(r => r.header);
            if (!header) return [];
            const slot = header.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
            const children = slot ? slot.assignedElements({ flatten: true }) : Array.from(header.children);
            return children.filter(el => el.tagName.toLowerCase() === 'ts-column') as TsColumn[];
        }

        getRowCells(row: TsRow): TsCell[] {
            const slot = row.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
            const children = slot ? slot.assignedElements({ flatten: true }) : Array.from(row.children);
            return children.filter(el => el.tagName.toLowerCase() === 'ts-cell') as TsCell[];
        }

        syncCompositionColumns(): void {
            const cols = this.getCompositionColumns();
            cols.forEach((col, i) => {
                if (this.sortable) col.sortable = true;
                col.sortDirection = this.sortField === col.field ? this.sortDirection : 'none';
                col.setAttribute('aria-colindex', String(i + 1));
            });
            const headerRow = this.getSlottedTsRows().find(r => r.header);
            if (headerRow) headerRow.setAttribute('aria-rowindex', '1');
        }

        syncCompositionRows(): void {
            const rows = this.getCompositionBodyRows();
            const cols = this.getCompositionColumns();
            const activeIndex = this.rovingIndex;
            rows.forEach((row, i) => {
                row.clickable = this.clickable;
                row.selected = this.clickable && this.selectedRowIndex === i;
                row.striped = this.striped && i % 2 === 1;
                row.setAttribute('aria-rowindex', String(i + 2));
                row.setAttribute('data-row-index', String(i));
                if (this.clickable) {
                    row.tabIndex = i === activeIndex ? 0 : -1;
                } else {
                    row.removeAttribute('tabindex');
                }
                this.getRowCells(row).forEach((cell, ci) => {
                    cell.setAttribute('aria-colindex', String(ci + 1));
                    if (cols[ci]) cell.setAttribute('data-col-id', cols[ci].field);
                });
            });
        }

        focusCompositionRow(index: number): void {
            this.focusedRowIndex = index;
            void this.updateComplete.then(() => {
                this.getCompositionBodyRows()[index]?.focus();
            });
        }

        handleSlotChange = (): void => {
            const slotted = !!this.getSlottedTable();
            if (this.hasSlottedTable !== slotted) {
                this.hasSlottedTable = slotted;
            }
            if (!this.isDataMode && !slotted) {
                this.syncCompositionColumns();
                this.syncCompositionRows();
            }
        };

        handleCompositionRowClick = (event: MouseEvent): void => {
            if (!this.clickable) return;
            const row = event
                .composedPath()
                .find(
                    el =>
                        el instanceof Element &&
                        (el as Element).tagName.toLowerCase() === 'ts-row' &&
                        !(el as TsRow).header,
                ) as TsRow | undefined;
            if (!row) return;

            const rows = this.getCompositionBodyRows();
            const rowIndex = rows.indexOf(row);
            if (rowIndex === -1) return;

            this.selectedRowIndex = this.selectedRowIndex === rowIndex ? null : rowIndex;
            this.syncCompositionRows();
            this.emit('ts-table-row-click', { detail: { row: {}, rowIndex } });
        };

        handleCompositionKeydown = (event: KeyboardEvent): void => {
            if (!this.clickable) return;
            const rows = this.getCompositionBodyRows();
            if (rows.length === 0) return;
            const current = this.focusedRowIndex ?? this.rovingIndex;
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (current < rows.length - 1) this.focusCompositionRow(current + 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (current > 0) this.focusCompositionRow(current - 1);
                    break;
                case 'Home':
                    event.preventDefault();
                    this.focusCompositionRow(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.focusCompositionRow(rows.length - 1);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.handleCompositionRowActivate(current);
                    break;
            }
        };

        handleCompositionFocusIn = (event: FocusEvent): void => {
            if (!this.clickable) return;
            const rows = this.getCompositionBodyRows();
            const idx = rows.findIndex(r => event.composedPath().includes(r));
            if (idx !== -1 && this.focusedRowIndex !== idx) {
                this.focusedRowIndex = idx;
            }
        };

        handleCompositionRowActivate(rowIndex: number): void {
            const rows = this.getCompositionBodyRows();
            if (rowIndex < 0 || rowIndex >= rows.length) return;
            this.selectedRowIndex = this.selectedRowIndex === rowIndex ? null : rowIndex;
            this.syncCompositionRows();
            this.emit('ts-table-row-click', { detail: { row: {}, rowIndex } });
        }

        handleHostFocusOut = (event: FocusEvent): void => {
            if (!this.clickable) return;
            const next = event.relatedTarget as Element | null;
            const staysInside = next && (this.contains(next) || (this.shadowRoot?.contains(next) ?? false));
            if (!staysInside) {
                this.focusedRowIndex = null;
            }
        };

        handleNativeTableClick = (event: MouseEvent): void => {
            if (!this.isNativeMode || !this.clickable) return;
            const tr = event
                .composedPath()
                .find(
                    el => el instanceof HTMLTableRowElement && (el as HTMLTableRowElement).closest('tbody') !== null,
                ) as HTMLTableRowElement | undefined;
            if (!tr) return;
            const tbody = tr.closest('tbody')!;
            const rows = Array.from(tbody.rows);
            const rowIndex = rows.indexOf(tr);
            if (rowIndex === -1) return;

            const isSelected = tr.classList.contains('ts-table-selected');
            rows.forEach(r => r.classList.remove('ts-table-selected'));
            if (!isSelected) tr.classList.add('ts-table-selected');

            this.emit('ts-table-row-click', { detail: { row: {}, rowIndex } });
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return TableCompositionMixinClass as any;
};
