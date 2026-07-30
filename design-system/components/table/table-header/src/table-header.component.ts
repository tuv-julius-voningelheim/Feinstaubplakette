import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

import { languageOf, normalizeLocale } from '@utils/date/locale.js';
import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';
import { getTableLocale, loadTableLocale } from '@utils/table/table-i18n.js';

import { TsButton } from '@components/button/index.js';
import { TsDialog } from '@components/dialog/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';
import { TsOption } from '@components/option/index.js';
import { TsRadio } from '@components/radio/index.js';
import { TsRadioGroup } from '@components/radio-group/index.js';
import { TsSelect } from '@components/select/index.js';

import styles from './TsTableHeaderStyles.js';

/**
 * @summary Top bar for `ts-table`. Renders an items-per-page selector on the left
 * and a search input on the right. Designed to be used inside `<ts-table>`, but
 * can also be used standalone.
 *
 * @status experimental
 * @since 1.27
 *
 * @event ts-table-search-change - Emitted (debounced) on search input. Detail: `{ query: string }`.
 * @event ts-table-page-size-change - Emitted when the items-per-page selector changes. Detail: `{ pageSize: number }`.
 *
 * @slot - Optional extra content rendered between the left and right sections.
 *
 * @csspart base - The component's base wrapper.
 * @csspart left - The left section (items per page).
 * @csspart right - The right section (search).
 */
export default class TsTableHeaderComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-button': TsButton,
        'ts-dialog': TsDialog,
        'ts-icon-button': TsIconButton,
        'ts-select': TsSelect,
        'ts-option': TsOption,
        'ts-input': TsInput,
        'ts-radio': TsRadio,
        'ts-radio-group': TsRadioGroup,
    };

    /** Current items per page. */
    @property({ type: Number, attribute: 'page-size' }) pageSize = 10;

    /** Items-per-page options. */
    @property({ type: Array, attribute: 'page-size-options' })
    pageSizeOptions: number[] = [10, 25, 50, 100];

    /** Show the search input. */
    @property({ type: Boolean, reflect: true, attribute: 'show-search' }) showSearch = true;

    /** Show the items-per-page selector. */
    @property({ type: Boolean, reflect: true, attribute: 'show-page-size' }) showPageSize = true;

    /** Placeholder text for the search input. Overrides the locale default. */
    @property({ attribute: 'search-placeholder' }) searchPlaceholder?: string;

    /** Debounce delay (ms) before emitting `ts-table-search-change`. */
    @property({ type: Number, attribute: 'search-debounce' }) searchDebounce = 200;

    /** Label preceding the items-per-page selector. Overrides the locale default. */
    @property({ attribute: 'page-size-label' }) pageSizeLabel?: string;

    /** Suffix after the items-per-page selector. Overrides the locale default. */
    @property({ attribute: 'page-size-suffix' }) pageSizeSuffix?: string;

    /**
     * BCP 47 locale tag forwarded from `<ts-table>`.
     * Falls back to `document.documentElement.lang` then `"en"`.
     */
    @property() locale = '';

    @state() private _pageSizeDialogOpen = false;

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

    private debounceTimer: ReturnType<typeof setTimeout> | null = null;

    private handleSearchInput = (event: Event): void => {
        const value = (event.target as TsInput).value;
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.emit('ts-table-search-change', { detail: { query: value } });
        }, this.searchDebounce);
    };

    private handlePageSizeChange = (event: Event): void => {
        const value = Number((event.target as TsSelect).value);
        this.pageSize = value;
        this.emit('ts-table-page-size-change', { detail: { pageSize: value } });
    };

    private handleMobilePageSizeButtonClick = (): void => {
        this._pageSizeDialogOpen = true;
    };

    private handleMobilePageSizeDialogClose = (): void => {
        this._pageSizeDialogOpen = false;
    };

    private handleMobilePageSizeSelect = (event: Event): void => {
        const value = Number((event.target as TsRadioGroup).value);
        if (!value) return;
        this.pageSize = value;
        this._pageSizeDialogOpen = false;
        this.emit('ts-table-page-size-change', { detail: { pageSize: value } });
    };

    override render(): TemplateResult {
        const label = this.pageSizeLabel ?? this.i18n.pageSizeLabel;
        const suffix = this.pageSizeSuffix ?? this.i18n.pageSizeSuffix;
        const placeholder = this.searchPlaceholder ?? this.i18n.searchPlaceholder;

        return html`
            <div part="base" class="bar">
                <div part="left" class="left">
                    ${
                        this.showPageSize
                            ? html`
                                  <span class="page-size-label">${label}</span>

                                  <!-- Desktop: dropdown select -->
                                  <ts-select
                                      size="small"
                                      .ariaLabel=${this.i18n.pageSizeAriaLabel}
                                      value=${String(this.pageSize)}
                                      class="page-size-select"
                                      @ts-change=${this.handlePageSizeChange}
                                  >
                                      ${this.pageSizeOptions.map(
                                          opt => html` <ts-option value=${String(opt)}>${opt}</ts-option> `,
                                      )}
                                  </ts-select>

                                  <!-- Mobile: icon button that opens dialog -->
                                  <ts-icon-button
                                      name="list"
                                      library="system"
                                      size="20"
                                      label=${this.i18n.pageSizeAriaLabel}
                                      class="page-size-mobile-btn"
                                      variant="outline"
                                      @click=${this.handleMobilePageSizeButtonClick}
                                  ></ts-icon-button>

                                  <span class="page-size-suffix">${suffix}</span>

                                  <!-- Mobile: page size picker dialog -->
                                  <ts-dialog
                                      label=${label}
                                      no-header
                                      class="page-size-dialog"
                                      ?open=${this._pageSizeDialogOpen}
                                      @ts-request-close=${this.handleMobilePageSizeDialogClose}
                                  >
                                      <span>${label}</span>
                                      <ts-radio-group
                                          value=${String(this.pageSize)}
                                          @ts-change=${this.handleMobilePageSizeSelect}
                                      >
                                          ${this.pageSizeOptions.map(
                                              opt => html`
                                                  <ts-radio value=${String(opt)}>${opt + ' ' + suffix}</ts-radio>
                                              `,
                                          )}
                                      </ts-radio-group>
                                  </ts-dialog>
                              `
                            : nothing
                    }
                </div>
                <slot></slot>
                <div part="right" class="right">
                    ${
                        this.showSearch
                            ? html`
                                  <ts-input
                                      type="search"
                                      size="small"
                                      clearable
                                      placeholder=${placeholder}
                                      .ariaLabel=${this.i18n.searchAriaLabel}
                                      class="search-input"
                                      @ts-input=${this.handleSearchInput}
                                  >
                                      <ts-icon slot="prefix" library="system" name="search"></ts-icon>
                                  </ts-input>
                              `
                            : nothing
                    }
                </div>
            </div>
        `;
    }
}
