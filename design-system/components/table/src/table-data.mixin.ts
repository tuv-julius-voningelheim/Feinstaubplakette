import { state } from 'lit/decorators.js';

import type { TsTableColumnDef, TsTableSortDirection } from '@utils/events/ts-table-types.js';
import type ComponentElement from '@utils/internal/component-element.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;

export interface TableDataInstance {
    sortField: string | null;
    sortDirection: TsTableSortDirection;
    currentPage: number;
    query: string;
    selectedRowIndex: number | null;
    focusedRowIndex: number | null;
    columnWidths: Record<string, string>;
    resizingField: string | null;
    resizeStartX: number;
    resizeStartWidth: number;
    columns?: TsTableColumnDef[];
    data?: Array<Record<string, unknown>>;
    pageSize: number;
    sortable: boolean;
    clickable: boolean;
    striped: boolean;
    maxHeight?: number;
    stickyHeader: boolean;
    readonly isDataMode: boolean;
    readonly _gridTemplate: string;
    readonly filteredData: Array<Record<string, unknown>>;
    readonly sortedData: Array<Record<string, unknown>>;
    readonly totalEntries: number;
    readonly pageCount: number;
    readonly pagedData: Array<Record<string, unknown>>;
    readonly rovingIndex: number;
    cycleSort(field: string): void;
    focusDataRow(index: number): void;
    handleSearch: (event: CustomEvent<{ query: string }>) => void;
    handlePageSize: (event: CustomEvent<{ pageSize: number }>) => void;
    handleSort: (event: CustomEvent<{ field: string; direction: TsTableSortDirection }>) => void;
    handlePageClick: (event: CustomEvent<{ page: number }>) => void;
    handleNavClick: (event: CustomEvent<{ page: number }>) => void;
    handleRowClick: (row: Record<string, unknown>, rowIndex: number) => void;
    handleDataRowKeydown: (event: KeyboardEvent, row: Record<string, unknown>, rowIndex: number) => void;
    handleResizeDown: (event: PointerEvent, field: string, startWidth: number) => void;
    handleResizeMove: (event: PointerEvent) => void;
    handleResizeUp: () => void;
    emit(name: string, init?: CustomEventInit): CustomEvent;
    requestUpdate(name?: PropertyKey, oldValue?: unknown): void;
    readonly updateComplete: Promise<boolean>;
    readonly shadowRoot: ShadowRoot | null;
    querySelector<E extends Element = Element>(selectors: string): E | null;
    contains(other: Node | null): boolean;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
    toggleAttribute(name: string, force?: boolean): boolean;
    getAttribute(name: string): string | null;
    style: CSSStyleDeclaration;
}

export const TableDataMixin = <TBase extends Constructor<ComponentElement>>(
    Base: TBase,
): TBase & Constructor<TableDataInstance> => {
    class TableDataMixinClass extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);
        }

        declare columns?: TsTableColumnDef[];
        declare data?: Array<Record<string, unknown>>;
        declare pageSize: number;
        declare sortable: boolean;
        declare clickable: boolean;
        declare striped: boolean;
        declare maxHeight?: number;
        declare stickyHeader: boolean;

        @state() sortField: string | null = null;
        @state() sortDirection: TsTableSortDirection = 'none';
        @state() currentPage = 1;
        @state() query = '';
        @state() selectedRowIndex: number | null = null;
        @state() focusedRowIndex: number | null = null;
        @state() columnWidths: Record<string, string> = {};

        resizingField: string | null = null;
        resizeStartX = 0;
        resizeStartWidth = 0;

        get isDataMode(): boolean {
            return Array.isArray(this.columns) && Array.isArray(this.data);
        }

        get _gridTemplate(): string {
            const cols = this.columns ?? [];
            return cols.map(col => this.columnWidths[col.field] ?? col.width ?? 'minmax(0, 1fr)').join(' ');
        }

        get filteredData(): Array<Record<string, unknown>> {
            if (!this.data) return [];
            const q = this.query.trim().toLowerCase();
            if (!q) return this.data;
            return this.data.filter(row =>
                Object.values(row).some(v =>
                    String(v ?? '')
                        .toLowerCase()
                        .includes(q),
                ),
            );
        }

        get sortedData(): Array<Record<string, unknown>> {
            const rows = this.filteredData;
            if (!this.sortField || this.sortDirection === 'none') return rows;
            const field = this.sortField;
            const dir = this.sortDirection === 'asc' ? 1 : -1;
            return [...rows].sort((a, b) => {
                const av = a[field] as unknown;
                const bv = b[field] as unknown;
                if (av == null && bv == null) return 0;
                if (av == null) return -1 * dir;
                if (bv == null) return 1 * dir;
                if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
                return String(av).localeCompare(String(bv)) * dir;
            });
        }

        get totalEntries(): number {
            return this.filteredData.length;
        }

        get pageCount(): number {
            return Math.max(1, Math.ceil(this.totalEntries / Math.max(1, this.pageSize)));
        }

        get pagedData(): Array<Record<string, unknown>> {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.sortedData.slice(start, start + this.pageSize);
        }

        get rovingIndex(): number {
            if (this.focusedRowIndex !== null) return this.focusedRowIndex;
            if (this.selectedRowIndex !== null) return this.selectedRowIndex;
            return 0;
        }

        handleSearch = (event: CustomEvent<{ query: string }>): void => {
            this.query = event.detail.query;
            this.currentPage = 1;
            this.selectedRowIndex = null;
            this.emit('ts-table-search-change', { detail: { query: this.query } });
        };

        handlePageSize = (event: CustomEvent<{ pageSize: number }>): void => {
            this.pageSize = event.detail.pageSize;
            this.currentPage = 1;
            this.selectedRowIndex = null;
            this.emit('ts-table-page-size-change', { detail: { pageSize: this.pageSize } });
        };

        cycleSort(field: string): void {
            if (this.sortField !== field) {
                this.sortField = field;
                this.sortDirection = 'asc';
            } else if (this.sortDirection === 'asc') {
                this.sortDirection = 'desc';
            } else if (this.sortDirection === 'desc') {
                this.sortField = null;
                this.sortDirection = 'none';
            } else {
                this.sortDirection = 'asc';
            }
            this.selectedRowIndex = null;
            this.emit('ts-table-sort-change', {
                detail: { field: this.sortField, direction: this.sortDirection },
            });
        }

        handleSort = (event: CustomEvent<{ field: string; direction: TsTableSortDirection }>): void => {
            event.stopPropagation();
            this.cycleSort(event.detail.field);
        };

        handlePageClick = (event: CustomEvent<{ page: number }>): void => {
            event.stopPropagation();
            this.currentPage = event.detail.page;
            this.selectedRowIndex = null;
            this.emit('ts-table-page-change', { detail: { page: this.currentPage } });
        };

        handleNavClick = (event: CustomEvent<{ page: number }>): void => {
            event.stopPropagation();
            this.currentPage = Math.max(1, Math.min(this.pageCount, event.detail.page));
            this.selectedRowIndex = null;
            this.emit('ts-table-page-change', { detail: { page: this.currentPage } });
        };

        handleRowClick = (row: Record<string, unknown>, rowIndex: number): void => {
            this.selectedRowIndex = this.selectedRowIndex === rowIndex ? null : rowIndex;
            this.emit('ts-table-row-click', { detail: { row, rowIndex } });
        };

        focusDataRow(index: number): void {
            this.focusedRowIndex = index;
            void this.updateComplete.then(() => {
                const tbody = this.shadowRoot?.querySelector('.body-rows');
                const rows = tbody?.querySelectorAll<HTMLElement>('.row[tabindex]');
                rows?.[index]?.focus();
            });
        }

        handleDataRowKeydown = (event: KeyboardEvent, row: Record<string, unknown>, rowIndex: number): void => {
            const total = this.pagedData.length;
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (rowIndex < total - 1) this.focusDataRow(rowIndex + 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (rowIndex > 0) this.focusDataRow(rowIndex - 1);
                    break;
                case 'Home':
                    event.preventDefault();
                    this.focusDataRow(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.focusDataRow(total - 1);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.handleRowClick(row, rowIndex);
                    break;
            }
        };

        handleResizeDown = (event: PointerEvent, field: string, startWidth: number): void => {
            event.preventDefault();
            event.stopPropagation();
            this.resizingField = field;
            this.resizeStartX = event.clientX;
            this.resizeStartWidth = startWidth;
            window.addEventListener('pointermove', this.handleResizeMove);
            window.addEventListener('pointerup', this.handleResizeUp, { once: true });
        };

        handleResizeMove = (event: PointerEvent): void => {
            if (!this.resizingField) return;
            const delta = event.clientX - this.resizeStartX;
            const newWidth = Math.max(40, this.resizeStartWidth + delta);
            this.columnWidths = { ...this.columnWidths, [this.resizingField]: `${newWidth}px` };
        };

        handleResizeUp = (): void => {
            if (!this.resizingField) return;
            const field = this.resizingField;
            const width = this.columnWidths[field];
            this.resizingField = null;
            window.removeEventListener('pointermove', this.handleResizeMove);
            this.requestUpdate();
            this.emit('ts-column-resize', { detail: { field, width } });
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return TableDataMixinClass as any;
};
