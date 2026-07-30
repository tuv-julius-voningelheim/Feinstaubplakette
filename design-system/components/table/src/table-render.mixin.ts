import { html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { TemplateResult } from 'lit';

import type { TsTableColumnDef, TsTableSortDirection } from '@utils/events/ts-table-types.js';
import type ComponentElement from '@utils/internal/component-element.js';

import type { TableCompositionInstance } from './table-composition.mixin.js';
import type { Constructor } from './table-data.mixin.js';

export interface TableRenderInstance extends TableCompositionInstance {
    handleHeaderSlotChange: () => void;
    handleFooterSlotChange: () => void;
    renderHeaderBar(): TemplateResult;
    renderFooterBar(): TemplateResult;
    renderSortIndicator(field: string): TemplateResult;
    renderTh(col: TsTableColumnDef, colIndex: number, applyWidth?: boolean): TemplateResult;
    renderTd(
        col: TsTableColumnDef,
        row: Record<string, unknown>,
        rowIndex: number,
        colIndex: number,
        applyWidth?: boolean,
    ): TemplateResult;
    _renderBodyRows(
        cols: TsTableColumnDef[],
        rows: Array<Record<string, unknown>>,
        pageOffset: number,
        applyWidth: boolean,
    ): TemplateResult | TemplateResult[];
    renderEmptyState(): TemplateResult;
    renderLoadingOverlay(): TemplateResult;
    renderSkeletonBodyRows(colCount: number, rowCount: number): TemplateResult[];
    renderSkeletonDataTable(): TemplateResult;
    renderSkeletonGenericTable(): TemplateResult;
    renderDataModeTable(): TemplateResult;
    renderCompositionTable(): TemplateResult;
    renderNativeTable(): TemplateResult;
    showHeader: boolean;
    showFooter: boolean;
    showSearch: boolean;
    showPageSize: boolean;
    showPagination: boolean;
    pageSizeOptions: number[];
    searchPlaceholder?: string;
    emptyText?: string;
    caption?: string;
    loading: boolean;
    skeleton: boolean;
    skeletonRows?: number;
    resolvedLocale: string;
    i18n: { searchPlaceholder: string; noData: string };
}

export const TableRenderMixin = <TBase extends Constructor<ComponentElement & TableCompositionInstance>>(
    Base: TBase,
): TBase & Constructor<TableRenderInstance> => {
    class TableRenderMixinClass extends Base {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);
        }

        declare showHeader: boolean;
        declare showFooter: boolean;
        declare showSearch: boolean;
        declare showPageSize: boolean;
        declare showPagination: boolean;
        declare pageSizeOptions: number[];
        declare searchPlaceholder?: string;
        declare emptyText?: string;
        declare caption?: string;
        declare loading: boolean;
        declare skeleton: boolean;
        declare skeletonRows?: number;
        declare resolvedLocale: string;
        declare i18n: { searchPlaceholder: string; noData: string };

        handleHeaderSlotChange = (): void => {
            const slot = this.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement | null;
            const next = (slot?.assignedElements({ flatten: true }).length ?? 0) > 0;
            if (this.hasCustomHeader !== next) this.hasCustomHeader = next;
        };

        handleFooterSlotChange = (): void => {
            const slot = this.shadowRoot?.querySelector('slot[name="footer"]') as HTMLSlotElement | null;
            const next = (slot?.assignedElements({ flatten: true }).length ?? 0) > 0;
            if (this.hasCustomFooter !== next) this.hasCustomFooter = next;
        };

        renderHeaderBar(): TemplateResult {
            const customSlot = html`<slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>`;

            if (this.hasCustomHeader) {
                return html`<div part="header">${customSlot}</div>`;
            }

            if (this.showHeader) {
                return html`
                    <ts-table-header
                        part="header"
                        .pageSize=${this.pageSize}
                        .pageSizeOptions=${this.pageSizeOptions}
                        .showSearch=${this.showSearch}
                        .showPageSize=${this.showPageSize}
                        .locale=${this.resolvedLocale}
                        search-placeholder=${this.searchPlaceholder ?? this.i18n.searchPlaceholder}
                        @ts-table-search-change=${this.handleSearch}
                        @ts-table-page-size-change=${this.handlePageSize}
                    ></ts-table-header>
                    ${customSlot}
                `;
            }

            return customSlot;
        }

        renderFooterBar(): TemplateResult {
            const total = this.totalEntries;
            const from = total === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
            const to = Math.min(total, this.currentPage * this.pageSize);

            const customSlot = html`<slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>`;

            if (this.hasCustomFooter) {
                return html`<div part="footer">${customSlot}</div>`;
            }

            if (this.showFooter) {
                return html`
                    <ts-table-footer
                        part="footer"
                        .from=${from}
                        .to=${to}
                        .total=${total}
                        .currentPage=${this.currentPage}
                        .pageCount=${this.pageCount}
                        .showPagination=${this.showPagination && this.pageCount > 1}
                        .locale=${this.resolvedLocale}
                        @ts-page-click=${this.handlePageClick}
                        @ts-prev-click=${this.handleNavClick}
                        @ts-next-click=${this.handleNavClick}
                    ></ts-table-footer>
                    ${customSlot}
                `;
            }

            return customSlot;
        }

        renderSortIndicator(field: string): TemplateResult {
            const active = this.sortField === field;
            const dir: TsTableSortDirection = active ? this.sortDirection : 'none';
            const iconName =
                dir === 'asc' ? 'keyboard_arrow_up' : dir === 'desc' ? 'keyboard_arrow_down' : 'unfold_more';
            return html`
                <ts-icon
                    name=${iconName}
                    library="system"
                    size="16"
                    class=${classMap({
                        'sort-indicator': true,
                        'sort-indicator--active': active && dir !== 'none',
                    })}
                    aria-hidden="true"
                ></ts-icon>
            `;
        }

        renderTh(col: TsTableColumnDef, colIndex: number, applyWidth = true): TemplateResult {
            const isSortable = this.sortable || !!col.sortable;
            const dir: TsTableSortDirection = this.sortField === col.field ? this.sortDirection : 'none';
            const ariaSort = dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
            const width = applyWidth ? (this.columnWidths[col.field] ?? col.width) : undefined;
            const thStyle = styleMap({
                width: width ?? '',
                textAlign: col.align ?? '',
            });
            const thClasses = {
                column: true,
                [`column--fixed-${col.fixed}`]: !!col.fixed,
            };
            const labelContent = html`
                <span class="column-label">
                    ${col.renderHeader ? col.renderHeader(col) : (col.label ?? col.field)}
                </span>
                ${isSortable ? this.renderSortIndicator(col.field) : nothing}
            `;

            return html`
                <div
                    role="columnheader"
                    class=${classMap(thClasses)}
                    style=${thStyle}
                    data-field=${col.field}
                    aria-colindex=${colIndex}
                    aria-sort=${isSortable ? ariaSort : nothing}
                >
                    <div class="column-inner">
                        ${
                            isSortable
                                ? html`
                                      <button
                                          type="button"
                                          class="sort-button"
                                          @click=${() => this.cycleSort(col.field)}
                                      >
                                          ${labelContent}
                                      </button>
                                  `
                                : labelContent
                        }
                    </div>
                    ${
                        col.resizable
                            ? html`
                                  <span
                                      class=${classMap({
                                          'resize-handle': true,
                                          'resize-handle--active': this.resizingField === col.field,
                                      })}
                                      @pointerdown=${(e: PointerEvent) => {
                                          const cell = (e.currentTarget as HTMLElement).closest(
                                              '[role="columnheader"]',
                                          ) as HTMLElement;
                                          this.handleResizeDown(e, col.field, cell.getBoundingClientRect().width);
                                      }}
                                  ></span>
                              `
                            : nothing
                    }
                </div>
            `;
        }

        renderTd(
            col: TsTableColumnDef,
            row: Record<string, unknown>,
            rowIndex: number,
            colIndex: number,
            applyWidth = true,
        ): TemplateResult {
            const width = applyWidth ? (this.columnWidths[col.field] ?? col.width) : undefined;
            const tdStyle = styleMap({
                width: width ?? '',
                textAlign: col.align ?? '',
            });
            const tdClasses = {
                cell: true,
                [`cell--fixed-${col.fixed}`]: !!col.fixed,
            };
            return html`
                <div
                    role="gridcell"
                    class=${classMap(tdClasses)}
                    style=${tdStyle}
                    data-col-id=${col.field}
                    aria-colindex=${colIndex}
                >
                    ${col.render ? col.render(row, rowIndex) : String(row[col.field] ?? '')}
                </div>
            `;
        }

        _renderBodyRows(
            cols: TsTableColumnDef[],
            rows: Array<Record<string, unknown>>,
            pageOffset: number,
            applyWidth: boolean,
        ): TemplateResult | TemplateResult[] {
            if (rows.length === 0) return html``;
            return rows.map(
                (row, rowIndex) => html`
                    <div
                        role="row"
                        data-row-index=${pageOffset + rowIndex}
                        class=${classMap({
                            row: true,
                            'row--clickable': this.clickable,
                            'row--selected': this.clickable && this.selectedRowIndex === rowIndex,
                        })}
                        aria-rowindex=${pageOffset + rowIndex + 2}
                        tabindex=${this.clickable ? (rowIndex === this.rovingIndex ? '0' : '-1') : nothing}
                        aria-selected=${
                            this.clickable ? (this.selectedRowIndex === rowIndex ? 'true' : 'false') : nothing
                        }
                        @click=${this.clickable ? () => this.handleRowClick(row, rowIndex) : nothing}
                        @keydown=${
                            this.clickable ? (e: KeyboardEvent) => this.handleDataRowKeydown(e, row, rowIndex) : nothing
                        }
                        @focus=${
                            this.clickable
                                ? () => {
                                      this.focusedRowIndex = rowIndex;
                                  }
                                : nothing
                        }
                    >
                        ${cols.map((col, colIndex) => this.renderTd(col, row, rowIndex, colIndex + 1, applyWidth))}
                    </div>
                `,
            );
        }

        renderEmptyState(): TemplateResult {
            if (this.hasCustomEmpty) {
                return html`<slot name="empty"></slot>`;
            }
            return html`<div class="empty-state">${this.emptyText ?? this.i18n.noData}</div>`;
        }

        renderLoadingOverlay(): TemplateResult {
            return html`
                <div class="table-loading-overlay" aria-hidden="true">
                    <ts-spinner class="table-loading-spinner"></ts-spinner>
                </div>
            `;
        }

        renderSkeletonBodyRows(colCount: number, rowCount: number): TemplateResult[] {
            return Array.from(
                { length: rowCount },
                (_, rowIndex) => html`
                    <div role="row" class="row skeleton-row" aria-rowindex=${rowIndex + 2}>
                        ${Array.from(
                            { length: colCount },
                            () => html`
                                <div role="gridcell" class="cell skeleton-cell">
                                    <ts-skeleton effect="sheen" class="skeleton-cell__indicator"></ts-skeleton>
                                </div>
                            `,
                        )}
                    </div>
                `,
            );
        }

        renderSkeletonDataTable(): TemplateResult {
            const cols = this.columns ?? [];
            const colCount = cols.length || 4;
            const rowCount = this.skeletonRows ?? this.pageSize;
            const hasMaxHeight = this.maxHeight != null;
            const useSplitLayout = this.stickyHeader && hasMaxHeight;
            const ariaColCount = colCount;
            const ariaRowCount = rowCount + 1;

            if (useSplitLayout) {
                const splitHeaderRowTpl = html`
                    <div role="row" class="row row--header" aria-rowindex="1">
                        ${cols.map((col, i) => this.renderTh(col, i + 1, false))}
                    </div>
                `;
                return html`
                    <div
                        role="grid"
                        part="table"
                        class=${classMap({ 'table-split-wrapper': true, 'table--striped': false })}
                        style="--ts-table-grid-template: ${this._gridTemplate}"
                        aria-rowcount=${ariaRowCount}
                        aria-colcount=${ariaColCount}
                        aria-busy="true"
                    >
                        <div role="none" class="table-split-header">
                            <div role="rowgroup" class="header-rows">${splitHeaderRowTpl}</div>
                        </div>
                        <div
                            role="none"
                            class="table-split-body"
                            tabindex="-1"
                            style=${styleMap({ maxHeight: `${this.maxHeight}px` })}
                        >
                            <div role="rowgroup" class="body-rows">
                                ${this.renderSkeletonBodyRows(colCount, rowCount)}
                            </div>
                        </div>
                    </div>
                `;
            }

            const headerRowTpl = html`
                <div role="row" class="row row--header" aria-rowindex="1">
                    ${cols.map((col, i) => this.renderTh(col, i + 1))}
                </div>
            `;
            const scrollStyle = styleMap({ maxHeight: hasMaxHeight ? `${this.maxHeight}px` : '' });
            return html`
                <div class="table-scroll-container">
                    <div class="table-scroll" tabindex="-1" style=${scrollStyle}>
                        <div
                            role="grid"
                            part="table"
                            class=${classMap({
                                table: true,
                                'table--sticky': this.stickyHeader,
                            })}
                            aria-rowcount=${ariaRowCount}
                            aria-colcount=${ariaColCount}
                            aria-busy="true"
                        >
                            <div role="rowgroup" class="header-rows">${headerRowTpl}</div>
                            <div role="rowgroup" class="body-rows">
                                ${this.renderSkeletonBodyRows(colCount, rowCount)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        renderSkeletonGenericTable(): TemplateResult {
            const colCount = 4;
            const rowCount = this.skeletonRows ?? this.pageSize;
            return html`
                <div class="table-scroll-container">
                    <div class="table-scroll" tabindex="-1">
                        <div role="grid" part="table" class="table table--sticky" aria-busy="true">
                            <div role="rowgroup" class="header-rows">
                                <div role="row" class="row row--header skeleton-row" aria-rowindex="1">
                                    ${Array.from(
                                        { length: colCount },
                                        () => html`
                                            <div role="columnheader" class="column skeleton-cell">
                                                <ts-skeleton
                                                    effect="sheen"
                                                    class="skeleton-cell__indicator"
                                                ></ts-skeleton>
                                            </div>
                                        `,
                                    )}
                                </div>
                            </div>
                            <div role="rowgroup" class="body-rows">
                                ${this.renderSkeletonBodyRows(colCount, rowCount)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        renderDataModeTable(): TemplateResult {
            const cols = this.columns ?? [];
            const rows = this.pagedData;
            const hasMaxHeight = this.maxHeight != null;
            const useSplitLayout = this.stickyHeader && hasMaxHeight;
            const ariaRowCount = this.totalEntries + 1;
            const ariaColCount = cols.length;
            const pageOffset = (this.currentPage - 1) * this.pageSize;

            if (useSplitLayout) {
                const splitHeaderRowTpl = html`
                    <div role="row" class="row row--header" aria-rowindex="1">
                        ${cols.map((col, i) => this.renderTh(col, i + 1, false))}
                    </div>
                `;
                const splitBodyRowsTpl = this._renderBodyRows(cols, rows, pageOffset, false);

                return html`
                    <div
                        role="grid"
                        part="table"
                        class=${classMap({
                            'table-split-wrapper': true,
                            'table--striped': this.striped,
                        })}
                        style="--ts-table-grid-template: ${this._gridTemplate}"
                        aria-rowcount=${ariaRowCount}
                        aria-colcount=${ariaColCount}
                        aria-label=${this.caption ?? nothing}
                    >
                        <div role="none" class="table-split-header">
                            <div role="rowgroup" class="header-rows">${splitHeaderRowTpl}</div>
                        </div>
                        <div
                            role="none"
                            class="table-split-body"
                            tabindex="0"
                            style=${styleMap({ maxHeight: `${this.maxHeight}px` })}
                        >
                            <div role=${rows.length === 0 ? 'none' : 'rowgroup'} class="body-rows">
                                ${splitBodyRowsTpl}
                            </div>
                            ${rows.length === 0 ? this.renderEmptyState() : nothing}
                        </div>
                    </div>
                `;
            }

            const headerRowTpl = html`
                <div role="row" class="row row--header" aria-rowindex="1">
                    ${cols.map((col, i) => this.renderTh(col, i + 1))}
                </div>
            `;
            const bodyRowsTpl = this._renderBodyRows(cols, rows, pageOffset, true);
            const scrollStyle = styleMap({
                maxHeight: hasMaxHeight ? `${this.maxHeight}px` : '',
            });
            const tableClasses = {
                table: true,
                'table--striped': this.striped,
                'table--sticky': this.stickyHeader,
            };

            return html`
                <div class="table-scroll-container">
                    <div class="table-scroll" tabindex="0" style=${scrollStyle}>
                        <div
                            role="grid"
                            part="table"
                            class=${classMap(tableClasses)}
                            aria-rowcount=${ariaRowCount}
                            aria-colcount=${ariaColCount}
                            aria-label=${this.caption ?? nothing}
                        >
                            <div role="rowgroup" class="header-rows">${headerRowTpl}</div>
                            <div role=${rows.length === 0 ? 'none' : 'rowgroup'} class="body-rows">${bodyRowsTpl}</div>
                        </div>
                        ${rows.length === 0 ? this.renderEmptyState() : nothing}
                    </div>
                </div>
            `;
        }

        renderCompositionTable(): TemplateResult {
            const scrollStyle = styleMap({
                maxHeight: this.maxHeight != null ? `${this.maxHeight}px` : '',
            });
            const tableClasses = {
                table: true,
                'table--composition': true,
                'table--striped': this.striped,
                'table--sticky': this.stickyHeader,
            };

            const bodyRows = this.getCompositionBodyRows();
            const headerRow = this.getSlottedTsRows().find(r => r.header);
            const ariaRowCount = bodyRows.length + (headerRow ? 1 : 0);
            const ariaColCount = this.getCompositionColumns().length;

            return html`
                <div class="table-scroll" tabindex="0" style=${scrollStyle}>
                    <div
                        role="grid"
                        part="table"
                        class=${classMap(tableClasses)}
                        aria-rowcount=${ariaRowCount > 0 ? ariaRowCount : nothing}
                        aria-colcount=${ariaColCount > 0 ? ariaColCount : nothing}
                        aria-label=${this.caption ?? nothing}
                        @ts-column-sort=${this.handleSort}
                        @click=${this.handleCompositionRowClick}
                        @keydown=${this.handleCompositionKeydown}
                        @focusin=${this.handleCompositionFocusIn}
                    >
                        <slot @slotchange=${this.handleSlotChange}></slot>
                    </div>
                </div>
            `;
        }

        renderNativeTable(): TemplateResult {
            return html`
                <div class="table-scroll table-scroll--native" tabindex="0">
                    <slot @slotchange=${this.handleSlotChange}></slot>
                </div>
            `;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return TableRenderMixinClass as any;
};
