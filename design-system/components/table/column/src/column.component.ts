import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { CSSResultGroup, TemplateResult } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';
import type { TsColumnSortDirection } from '@utils/events/ts-table-types.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsColumnStyles.js';

/**
 * @summary A column header cell. Supports sorting, resizing, fixed positioning and alignment.
 * @status experimental
 * @since 1.27
 *
 * @slot - The column label.
 *
 * @event ts-column-sort - Emitted when the column header is clicked (only when `sortable`). Detail: `{ field, direction }`.
 * @event ts-column-resize - Emitted when the user finishes resizing the column. Detail: `{ field, width }`.
 *
 * @csspart base - The component's root element.
 * @csspart label - The label wrapper.
 * @csspart resize-handle - The drag handle on the right edge.
 */
export default class TsColumnComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-icon': TsIcon,
    };

    /** The field key this column represents (used for sort/resize events). */
    @property({ reflect: true }) field = '';

    /** Allow the user to sort by clicking the header. */
    @property({ type: Boolean, reflect: true }) sortable = false;

    /** Allow the user to drag the right edge to resize the column. */
    @property({ type: Boolean, reflect: true }) resizable = false;

    /** Pin the column to the left or right side of the scroll container. */
    @property({ reflect: true }) fixed?: 'left' | 'right';

    /** Current sort direction for this column. */
    @property({ reflect: true, attribute: 'sort-direction' })
    sortDirection: TsColumnSortDirection = 'none';

    /** Fixed / initial width (e.g. `200px`). */
    @property({ reflect: true }) width?: string;

    /** Header label alignment. */
    @property({ reflect: true }) align?: 'left' | 'center' | 'right';

    @state() private currentWidth: string | undefined;
    @state() private resizing = false;

    private resizeStartX = 0;
    private resizeStartWidth = 0;

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute('role', 'columnheader');
        if (this.width) this.currentWidth = this.width;
        this.detectNative();
    }

    private detectNative(): void {
        const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
        const children = slot ? slot.assignedElements({ flatten: true }) : Array.from(this.children);
        const hasTh = children.some(el => el.tagName.toLowerCase() === 'th');
        if (hasTh) {
            this.setAttribute('has-th', '');
            this.removeAttribute('role'); // <th> already carries columnheader semantics
        } else {
            this.removeAttribute('has-th');
            this.setAttribute('role', 'columnheader');
        }
    }

    private handleSlotChange = (): void => {
        this.detectNative();
    };

    override updated(changed: Map<string, unknown>): void {
        super.updated?.(changed);
        if (this.sortable) {
            const value =
                this.sortDirection === 'asc' ? 'ascending' : this.sortDirection === 'desc' ? 'descending' : 'none';
            this.setAttribute('aria-sort', value);
        } else if (this.hasAttribute('aria-sort')) {
            this.removeAttribute('aria-sort');
        }
    }

    private handleSortClick = (): void => {
        if (!this.sortable) return;
        const next: TsColumnSortDirection =
            this.sortDirection === 'none' ? 'asc' : this.sortDirection === 'asc' ? 'desc' : 'none';
        this.emit('ts-column-sort', { detail: { field: this.field, direction: next } });
    };

    private handleResizeDown = (event: PointerEvent): void => {
        if (!this.resizable) return;
        event.preventDefault();
        event.stopPropagation();
        this.resizing = true;
        this.resizeStartX = event.clientX;
        this.resizeStartWidth = this.getBoundingClientRect().width;
        window.addEventListener('pointermove', this.handleResizeMove);
        window.addEventListener('pointerup', this.handleResizeUp, { once: true });
    };

    private handleResizeMove = (event: PointerEvent): void => {
        if (!this.resizing) return;
        const delta = event.clientX - this.resizeStartX;
        const newWidth = Math.max(40, this.resizeStartWidth + delta);
        this.currentWidth = `${newWidth}px`;
    };

    private handleResizeUp = (): void => {
        if (!this.resizing) return;
        this.resizing = false;
        window.removeEventListener('pointermove', this.handleResizeMove);
        this.emit('ts-column-resize', { detail: { field: this.field, width: this.currentWidth } });
    };

    private renderSortIndicator(): TemplateResult | typeof nothing {
        if (!this.sortable) return nothing;
        const isActive = this.sortDirection !== 'none';
        const iconName =
            this.sortDirection === 'asc'
                ? 'keyboard_arrow_up'
                : this.sortDirection === 'desc'
                  ? 'keyboard_arrow_down'
                  : 'unfold_more';
        return html`
            <ts-icon
                name=${iconName}
                library="system"
                size="16"
                class=${classMap({
                    'sort-indicator': true,
                    'sort-indicator--active': isActive,
                })}
                aria-hidden="true"
            ></ts-icon>
        `;
    }

    override render(): TemplateResult {
        if (this.hasAttribute('has-th')) {
            return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
        }

        const hostStyle = styleMap({ width: this.currentWidth ?? '' });
        if (this.currentWidth && this.style.width !== this.currentWidth) {
            this.style.width = this.currentWidth;
        }

        const content = html`
            <span class="label" part="label"><slot @slotchange=${this.handleSlotChange}></slot></span>
            ${this.renderSortIndicator()}
        `;

        return html`
            <div class="column" part="base" style=${hostStyle}>
                ${
                    this.sortable
                        ? html`
                              <button type="button" class="sort-button" @click=${this.handleSortClick}>
                                  ${content}
                              </button>
                          `
                        : content
                }
            </div>
            ${
                this.resizable
                    ? html`
                          <span
                              part="resize-handle"
                              class=${classMap({
                                  'resize-handle': true,
                                  'resize-handle--active': this.resizing,
                              })}
                              @pointerdown=${this.handleResizeDown}
                          ></span>
                      `
                    : nothing
            }
        `;
    }
}
