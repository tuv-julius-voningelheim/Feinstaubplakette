import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';
import { TsPaginationItem } from '@components/pagination-item/index.js';

import styles from './TsPaginationStyles.js';

type PageItem = { type: 'page'; page: number } | { type: 'ellipsis'; key: string };

/**
 * @summary Pagination allows users to navigate through multiple pages of content.
 * @status stable
 * @since 1.21
 *
 * @dependency ts-pagination-item
 * @dependency ts-icon
 *
 * @event ts-page-click - Emitted (bubbled) when a numbered page button is clicked. Detail: `{ page: number }`.
 * @event ts-prev-click - Emitted by this component when the previous button is clicked. Detail: `{ page: number }`.
 * @event ts-next-click - Emitted by this component when the next button is clicked. Detail: `{ page: number }`.
 * @event ts-nav-click - Internal event fired by `ts-pagination-item` prev/next buttons. Intercepted and stopped by this component; converted into `ts-prev-click` / `ts-next-click`. Detail: `{ direction: 'prev' | 'next', page: number }`.
 *
 * @csspart base - The component's base nav wrapper.
 */
export default class TsPaginationComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-pagination-item': TsPaginationItem,
        'ts-icon': TsIcon,
    };

    /** Total number of pages. */
    @property({ type: Number, reflect: true }) count = 1;

    /** The initially active page (uncontrolled). */
    @property({ type: Number, reflect: true, attribute: 'default-page' }) defaultPage = 1;

    /** The visual variant for all page items. */
    @property({ reflect: true }) variant: 'outlined' | 'text' = 'outlined';

    /** The size of all page items. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Disables all pagination items. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /**
     * Accessible label for the `<nav>` landmark. Use a unique value when multiple
     * pagination components appear on the same page (e.g. "Product list pagination").
     */
    @property({ reflect: true }) label = 'Pagination';

    /**
     * The number of pages always shown at the beginning and end of the range.
     * For example, `boundaryCount=1` always shows page 1 and the last page.
     */
    @property({ type: Number, reflect: true, attribute: 'boundary-count' }) boundaryCount = 1;

    /**
     * The number of sibling page buttons to show on each side of the current page.
     */
    @property({ type: Number, reflect: true, attribute: 'sibling-count' }) siblingCount = 1;

    @state() private currentPage = 1;

    override connectedCallback() {
        super.connectedCallback();
        this.currentPage = Math.max(1, Math.min(this.defaultPage, this.count));
    }

    private getPageItems(): PageItem[] {
        const { count, boundaryCount, siblingCount, currentPage } = this;

        if (count <= 0) return [];

        // Helper
        const range = (start: number, end: number): number[] =>
            Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);

        // If the total page count fits inside the fixed-slot budget, show all pages —
        // no ellipsis is ever needed and the layout is trivially stable.
        const budget = 2 * boundaryCount + 2 * siblingCount + 3; // 3 = current + 2 ellipsis
        if (count <= budget) {
            return range(1, count).map(page => ({ type: 'page', page }));
        }

        // Fixed boundary pages
        const startPages = range(1, boundaryCount);
        const endPages = range(count - boundaryCount + 1, count);

        // Clamp sibling window so it never overlaps the boundaries.
        // The clamping is asymmetric: when the current page is near one boundary the
        // sibling window shifts toward the other side so the TOTAL slot count stays
        // constant (this is what prevents the next-button from jumping).
        const siblingsStart = Math.max(
            Math.min(currentPage - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
            boundaryCount + 2,
        );

        const siblingsEnd = Math.min(
            Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
            count - boundaryCount - 1,
        );

        // An ellipsis is only shown when it hides ≥ 2 pages (otherwise show the page).
        const showStartEllipsis = siblingsStart > boundaryCount + 2;
        const showEndEllipsis = siblingsEnd < count - boundaryCount - 1;

        // Fill the gap between boundary and sibling window with either an ellipsis or
        // the actual page number(s) — the slot count is identical either way.
        const beforeSiblings: PageItem[] = showStartEllipsis
            ? [{ type: 'ellipsis', key: 'ellipsis-start' }]
            : range(boundaryCount + 1, siblingsStart - 1).map(page => ({ type: 'page', page }));

        const afterSiblings: PageItem[] = showEndEllipsis
            ? [{ type: 'ellipsis', key: 'ellipsis-end' }]
            : range(siblingsEnd + 1, count - boundaryCount).map(page => ({ type: 'page', page }));

        return [
            ...startPages.map(page => ({ type: 'page' as const, page })),
            ...beforeSiblings,
            ...range(siblingsStart, siblingsEnd).map(page => ({ type: 'page' as const, page })),
            ...afterSiblings,
            ...endPages.map(page => ({ type: 'page' as const, page })),
        ];
    }

    private handleItemEvent(event: Event) {
        event.stopPropagation();

        if (event.type === 'ts-nav-click') {
            const { direction } = (event as CustomEvent<{ direction: 'prev' | 'next'; page: number }>).detail;
            const newPage =
                direction === 'prev' ? Math.max(1, this.currentPage - 1) : Math.min(this.count, this.currentPage + 1);
            this.currentPage = newPage;
            this.emit(direction === 'prev' ? 'ts-prev-click' : 'ts-next-click', { detail: { page: newPage } });
        } else {
            // ts-page-click from a numbered page item
            const { page } = (event as CustomEvent<{ page: number }>).detail;
            this.currentPage = page;
            // Re-emit so listeners on ts-pagination also receive it
            this.emit('ts-page-click', { detail: { page } });
        }
    }

    override render() {
        const pageItems = this.getPageItems();
        const iconSize = this.size === 'large' ? 20 : this.size === 'small' ? 14 : 16;

        return html`
            <nav
                part="base"
                class="pagination"
                aria-label=${this.label}
                @ts-page-click=${this.handleItemEvent}
                @ts-nav-click=${this.handleItemEvent}
            >
                <ts-pagination-item
                    type="prev"
                    .size=${this.size}
                    .variant=${this.variant}
                    .page=${this.currentPage - 1}
                    ?disabled=${this.disabled || this.currentPage <= 1}
                >
                    <ts-icon library="system" name="arrow_back_ios" size=${iconSize}></ts-icon>
                </ts-pagination-item>

                ${pageItems.map(item =>
                    item.type === 'ellipsis'
                        ? html`
                              <ts-pagination-item
                                  type="ellipsis"
                                  .size=${this.size}
                                  .variant=${this.variant}
                                  ?disabled=${this.disabled}
                              >
                                  &hellip;
                              </ts-pagination-item>
                          `
                        : html`
                              <ts-pagination-item
                                  type="page"
                                  .page=${item.page}
                                  .size=${this.size}
                                  .variant=${this.variant}
                                  ?active=${item.page === this.currentPage}
                                  ?disabled=${this.disabled}
                              >
                                  ${item.page}
                              </ts-pagination-item>
                          `,
                )}

                <ts-pagination-item
                    type="next"
                    .size=${this.size}
                    .variant=${this.variant}
                    .page=${this.currentPage + 1}
                    ?disabled=${this.disabled || this.currentPage >= this.count}
                >
                    <ts-icon library="system" name="arrow_forward_ios" size=${iconSize}></ts-icon>
                </ts-pagination-item>
            </nav>
        `;
    }
}
