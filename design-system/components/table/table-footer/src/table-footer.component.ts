import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

import { languageOf, normalizeLocale } from '@utils/date/locale.js';
import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';
import { getTableLocale, loadTableLocale } from '@utils/table/table-i18n.js';

import { TsPagination } from '@components/pagination/index.js';

import styles from './TsTableFooterStyles.js';

/**
 * @summary Bottom bar for `ts-table`. Shows entry range on the left and `ts-pagination` on the right.
 * @status experimental
 * @since 1.27
 *
 * @dependency ts-pagination
 *
 * @slot - Optional extra content between left and right sections.
 *
 * @csspart base - The component's base wrapper.
 * @csspart info - The entries info section.
 * @csspart pagination - The pagination section.
 */
export default class TsTableFooterComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-pagination': TsPagination,
    };

    /** First visible entry (1-based). */
    @property({ type: Number }) from = 0;

    /** Last visible entry (1-based, inclusive). */
    @property({ type: Number }) to = 0;

    /** Total number of entries across all pages. */
    @property({ type: Number }) total = 0;

    /** Current page (1-based). */
    @property({ type: Number, attribute: 'current-page' }) currentPage = 1;

    /** Total page count. */
    @property({ type: Number, attribute: 'page-count' }) pageCount = 1;

    /** Show the pagination control. */
    @property({ type: Boolean, reflect: true, attribute: 'show-pagination' }) showPagination = true;

    /**
     * Custom entries-info format string.
     * Supported tokens: `{from}`, `{to}`, `{total}`.
     * When omitted, the locale default is used.
     */
    @property() infoTemplate?: string;

    /**
     * BCP 47 locale tag forwarded from `<ts-table>`.
     * Falls back to `document.documentElement.lang` then `"en"`.
     */
    @property() locale = '';

    private get resolvedLocale(): string {
        return normalizeLocale(this.locale || document.documentElement.lang || 'en');
    }

    private get i18n() {
        return getTableLocale(languageOf(this.resolvedLocale));
    }

    protected override willUpdate(changed: PropertyValues): void {
        if (changed.has('locale')) {
            void loadTableLocale(this.locale).then(() => this.requestUpdate());
        }
    }

    private renderInfo(): string {
        if (this.infoTemplate) {
            return this.infoTemplate
                .replace('{from}', String(this.from))
                .replace('{to}', String(this.to))
                .replace('{total}', String(this.total));
        }
        return this.i18n.showingEntries(this.from, this.to, this.total);
    }

    override render(): TemplateResult {
        return html`
            <div part="base" class="bar">
                <div part="info" class="info">${this.renderInfo()}</div>
                <slot></slot>
                ${
                    this.showPagination
                        ? html`
                              <ts-pagination
                                  part="pagination"
                                  class="pagination"
                                  count=${this.pageCount}
                                  default-page=${this.currentPage}
                                  size="small"
                                  label="Table pagination"
                              ></ts-pagination>
                          `
                        : nothing
                }
            </div>
        `;
    }
}
