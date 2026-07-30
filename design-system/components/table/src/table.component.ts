import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

import { languageOf, normalizeLocale } from '@utils/date/locale.js';
import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';
import { getTableLocale, loadTableLocale } from '@utils/table/table-i18n.js';
import type { TsTableColumnDef, TsTableHeaderVariant, TsTableSize } from '@utils/events/ts-table-types.js';

import { TsIcon } from '@components/icon/index.js';
import { TsPagination } from '@components/pagination/index.js';
import { TsSkeleton } from '@components/skeleton/index.js';
import { TsSpinner } from '@components/spinner/index.js';

import { TsCell } from '../cell/index.js';
import { TsColumn } from '../column/index.js';
import { TsRow } from '../row/index.js';
import { TsTableFooter } from '../table-footer/index.js';
import { TsTableHeader } from '../table-header/index.js';
import { TableCompositionMixin } from './table-composition.mixin.js';
import { TableDataMixin } from './table-data.mixin.js';
import { TableRenderMixin } from './table-render.mixin.js';
import nativeModeStyles from './TsTableNativeStyles.js';
import styles from './TsTableStyles.js';
import type { TableRenderInstance } from './table-render.mixin.js';

const TableBase = TableRenderMixin(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TableCompositionMixin(TableDataMixin(ComponentElement) as any) as any,
) as unknown as new (...args: unknown[]) => ComponentElement & TableRenderInstance;

/**
 * @summary A data table with optional header, footer, pagination, sorting, search, fixed rows/columns and column resize.
 *
 * @status Beta
 * @since 1.27
 *
 * @dependency ts-table-header
 * @dependency ts-table-footer
 * @dependency ts-row
 * @dependency ts-column
 * @dependency ts-cell
 * @dependency ts-pagination
 * @dependency ts-icon
 * @dependency ts-spinner
 * @dependency ts-skeleton
 *
 * @slot - In composition mode, slot your own `<ts-row>` / `<ts-column>` / `<ts-cell>` markup here.
 * @slot header - Replace the default top bar (items-per-page + search).
 * @slot footer - Replace the default bottom bar (entries info + pagination).
 * @slot empty - Replace the default "no data" empty-state block shown when `data` is an empty array.
 *
 * @event ts-table-sort-change - Emitted when a sortable column header is clicked. Detail: `{ field, direction }`.
 * @event ts-table-page-change - Emitted when the current page changes. Detail: `{ page }`.
 * @event ts-table-page-size-change - Emitted when items-per-page changes. Detail: `{ pageSize }`.
 * @event ts-table-search-change - Emitted (debounced) when the search input changes. Detail: `{ query }`.
 *
 * @csspart base - The component's outermost wrapper.
 * @csspart table - The native `<table>` element.
 * @csspart header - The top bar wrapper.
 * @csspart footer - The bottom bar wrapper.
 */
export default class TsTableComponent extends TableBase {
    static styles: CSSResultGroup = [componentStyles, styles];

    static dependencies = {
        'ts-table-header': TsTableHeader,
        'ts-table-footer': TsTableFooter,
        'ts-row': TsRow,
        'ts-column': TsColumn,
        'ts-cell': TsCell,
        'ts-pagination': TsPagination,
        'ts-icon': TsIcon,
        'ts-spinner': TsSpinner,
        'ts-skeleton': TsSkeleton,
    };

    /** Column definitions for data-table mode. */
    @property({ attribute: false }) override columns?: TsTableColumnDef[];

    /** Row data for data-table mode. */
    @property({ attribute: false }) override data?: Array<Record<string, unknown>>;

    /** Header color variant. */
    @property({ reflect: true, attribute: 'header-variant' })
    variant: TsTableHeaderVariant = 'primary';

    /** Table size — controls row height. */
    @property({ reflect: true }) size: TsTableSize = 'medium';

    /** Highlight rows on hover. */
    @property({ type: Boolean, reflect: true }) hover = false;

    /** Alternate row background */
    @property({ type: Boolean, reflect: true }) override striped = false;

    /** Draw horizontal borders between rows. */
    @property({ type: Boolean, reflect: true }) bordered = true;

    /** Draw vertical borders between columns. */
    @property({ type: Boolean, reflect: true, attribute: 'column-borders' }) columnBorders = false;

    /** Enable sorting on ALL columns. Individual columns can still override with their own `sortable` prop. */
    @property({ type: Boolean, reflect: true }) override sortable = false;

    /** Stick the header row to the top while scrolling. */
    @property({ type: Boolean, reflect: true, attribute: 'sticky-header' }) override stickyHeader = true;

    /** Make body rows clickable — shows pointer cursor, highlights the selected row and emits `ts-table-row-click`. */
    @property({ type: Boolean, reflect: true }) override clickable = false;

    /** Maximum visible height before vertical scroll kicks in (number of pixels). */
    @property({ type: Number, attribute: 'max-height' }) override maxHeight?: number;

    /** Show the top bar (items-per-page + search). Default is `false` — opt in when needed. */
    @property({ type: Boolean, reflect: true, attribute: 'show-header' }) override showHeader = false;

    /** Show the bottom bar (entries info + pagination). Default is `false` — opt in when needed. */
    @property({ type: Boolean, reflect: true, attribute: 'show-footer' }) override showFooter = false;

    /** Show the search input in the top bar. */
    @property({ type: Boolean, attribute: 'show-search' }) override showSearch = true;

    /** Show the items-per-page selector in the top bar. */
    @property({ type: Boolean, attribute: 'show-page-size' }) override showPageSize = true;

    /** Show the pagination control in the bottom bar. */
    @property({ type: Boolean, attribute: 'show-pagination' }) override showPagination = true;

    /** Available items-per-page options. */
    @property({ type: Array, attribute: 'page-size-options' })
    override pageSizeOptions: number[] = [10, 25, 50, 100];

    /** Current items per page. */
    @property({ type: Number, reflect: true, attribute: 'page-size' }) override pageSize = 10;

    /** Search input placeholder. */
    @property({ attribute: 'search-placeholder' }) override searchPlaceholder?: string;

    /** Text shown when there is no data. */
    @property({ attribute: 'empty-text' }) override emptyText?: string;

    /** Accessible caption for the table — rendered as a visually-hidden `<caption>`. */
    @property() override caption?: string;

    /**
     * BCP 47 locale tag (e.g. `"de"`, `"fr-FR"`) used to translate built-in
     * text strings. Falls back to `document.documentElement.lang` then `"en"`.
     */
    @property() locale = '';

    /**
     * When `true`, shows a `ts-spinner` overlay at the top of the table and
     * prevents all interaction with the table content.
     */
    @property({ type: Boolean, reflect: true }) override loading = false;

    /**
     * When `true`, replaces the table body rows with animated `ts-skeleton`
     * placeholder rows to indicate that data is being fetched.
     * The header is still rendered. Use `skeleton-rows` to control how many
     * placeholder rows are shown.
     */
    @property({ type: Boolean, reflect: true }) override skeleton = false;

    /**
     * Number of skeleton placeholder rows shown when `skeleton` is `true`.
     * Defaults to the current `page-size` value when not set explicitly.
     */
    @property({ type: Number, attribute: 'skeleton-rows' }) override skeletonRows?: number;

    override get resolvedLocale(): string {
        return normalizeLocale(this.locale || document.documentElement.lang || 'en');
    }

    override get i18n() {
        return getTableLocale(languageOf(this.resolvedLocale));
    }

    private _hScrollSynced = false;
    private _splitResizeObserver: ResizeObserver | null = null;
    private _scrollHandler: ((ev: Event) => void) | null = null;
    private _scrollBody: HTMLElement | null = null;

    private _attachHorizontalScrollSync(): void {
        if (this._hScrollSynced) return;
        const body = this.shadowRoot?.querySelector('.table-split-body') as HTMLElement | null;
        const header = this.shadowRoot?.querySelector('.table-split-header') as HTMLElement | null;
        if (!body || !header) return;

        this._scrollHandler = () => {
            header.scrollLeft = body.scrollLeft;
        };
        this._scrollBody = body;
        body.addEventListener('scroll', this._scrollHandler, { passive: true });

        if (typeof ResizeObserver !== 'undefined') {
            this._splitResizeObserver?.disconnect();
            this._splitResizeObserver = new ResizeObserver(() => {
                this._syncSplitGutter();
            });
            this._splitResizeObserver.observe(body);
        }

        this._hScrollSynced = true;
    }

    private _syncSplitGutter(): void {
        const shadow = this.shadowRoot;
        if (!shadow) return;
        const body = shadow.querySelector('.table-split-body') as HTMLElement | null;
        const header = shadow.querySelector('.table-split-header') as HTMLElement | null;
        if (!body || !header) return;
        const gutterWidth = body.offsetWidth - body.clientWidth;
        header.style.paddingRight = `${gutterWidth}px`;
    }

    private _detachSplitSync(): void {
        if (this._scrollHandler && this._scrollBody) {
            this._scrollBody.removeEventListener('scroll', this._scrollHandler);
            this._scrollHandler = null;
            this._scrollBody = null;
        }
        this._splitResizeObserver?.disconnect();
        this._splitResizeObserver = null;
        this._hScrollSynced = false;
    }

    protected override willUpdate(changed: PropertyValues): void {
        if (changed.has('locale')) {
            void loadTableLocale(this.locale).then(() => this.requestUpdate());
        }

        if (!this.isDataMode) {
            const next = !!this.peekSlottedTable();
            if (this.hasSlottedTable !== next) this.hasSlottedTable = next;
        } else if (this.hasSlottedTable) {
            this.hasSlottedTable = false;
        }

        const nextCustomHeader = !!this.querySelector(':scope > [slot="header"]');
        if (this.hasCustomHeader !== nextCustomHeader) this.hasCustomHeader = nextCustomHeader;

        const nextCustomFooter = !!this.querySelector(':scope > [slot="footer"]');
        if (this.hasCustomFooter !== nextCustomFooter) this.hasCustomFooter = nextCustomFooter;

        const nextCustomEmpty = !!this.querySelector(':scope > [slot="empty"]');
        if (this.hasCustomEmpty !== nextCustomEmpty) this.hasCustomEmpty = nextCustomEmpty;

        this.toggleAttribute('has-footer', this.showFooter || nextCustomFooter);
    }

    protected override updated(changed: PropertyValues): void {
        super.updated?.(changed);

        if (this.isDataMode && this.stickyHeader && this.maxHeight != null) {
            this._attachHorizontalScrollSync();
            this._syncSplitGutter();
        } else {
            this._detachSplitSync();
        }

        if (this.isDataMode || this.isNativeMode) return;

        if (
            changed.has('sortable') ||
            changed.has('sortField' as PropertyKey) ||
            changed.has('sortDirection' as PropertyKey)
        ) {
            this.syncCompositionColumns();
        }

        if (
            changed.has('clickable') ||
            changed.has('striped') ||
            changed.has('selectedRowIndex' as PropertyKey) ||
            changed.has('focusedRowIndex' as PropertyKey)
        ) {
            this.syncCompositionRows();
        }
    }

    override connectedCallback(): void {
        super.connectedCallback();
        TsTableComponent.injectNativeStylesOnce();
        this.addEventListener('focusout', this.handleHostFocusOut);
        this.addEventListener('click', this.handleNativeTableClick);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this._detachSplitSync();
        this.removeEventListener('focusout', this.handleHostFocusOut);
        this.removeEventListener('click', this.handleNativeTableClick);
    }

    private static nativeStylesInjected = false;
    private static injectNativeStylesOnce(): void {
        if (TsTableComponent.nativeStylesInjected) return;
        if (typeof document === 'undefined') return;
        if (document.getElementById('ts-table-native-styles')) {
            TsTableComponent.nativeStylesInjected = true;
            return;
        }
        const style = document.createElement('style');
        style.id = 'ts-table-native-styles';
        style.textContent = nativeModeStyles;
        document.head.appendChild(style);
        TsTableComponent.nativeStylesInjected = true;
    }

    override render(): TemplateResult {
        if (this.isNativeMode) {
            this.setAttribute('native', '');
            if (this.maxHeight != null) {
                this.style.maxHeight = `${this.maxHeight}px`;
                this.style.overflowY = 'auto';
            } else {
                this.style.maxHeight = '';
                this.style.overflowY = '';
            }
        } else {
            this.removeAttribute('native');
            this.style.maxHeight = '';
            this.style.overflowY = '';
        }

        let body: TemplateResult;
        if (this.skeleton) {
            body = this.isDataMode ? this.renderSkeletonDataTable() : this.renderSkeletonGenericTable();
        } else {
            body = this.isDataMode
                ? this.renderDataModeTable()
                : this.isNativeMode
                  ? this.renderNativeTable()
                  : this.renderCompositionTable();
        }

        return html`
            <div part="base" class="table-wrapper">
                ${this.loading ? this.renderLoadingOverlay() : nothing}
                <div ?inert=${this.loading} class="table-content">
                    ${this.renderHeaderBar()} ${body} ${this.renderFooterBar()}
                </div>
            </div>
        `;
    }
}
