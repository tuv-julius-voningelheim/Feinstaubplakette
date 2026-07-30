import { html } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup, TemplateResult } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsRowStyles.js';

/**
 * @summary A table row. Use inside `<ts-table>` to group `<ts-column>` (header) or `<ts-cell>` (body) elements.
 * In wrapping mode you can slot a native `<tr>` inside `<ts-row>` and the component will
 * become display:contents so the `<tr>` participates directly in the table layout.
 * @status experimental
 * @since 1.27
 *
 * @slot - The cells of the row, OR a native `<tr>` in wrapping mode.
 *
 * @csspart base - The component's root element (`display: table-row`).
 */
export default class TsRowComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    /** Marks this row as the header row (applies the table's header-variant styling). */
    @property({ type: Boolean, reflect: true }) header = false;

    /** Pin the row to the top or bottom of the scroll container. */
    @property({ reflect: true }) fixed?: 'top' | 'bottom';

    /** Marks this row as clickable (shows pointer cursor). */
    @property({ type: Boolean, reflect: true }) clickable = false;

    /** Marks this row as selected (applies selected background). */
    @property({ type: Boolean, reflect: true }) selected = false;

    /** Applies the zebra-stripe background. Set by ts-table on even body rows when striped is enabled. */
    @property({ type: Boolean, reflect: true }) striped = false;

    private detectNative(): void {
        const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
        const children = slot ? slot.assignedElements({ flatten: true }) : Array.from(this.children);
        const hasTr = children.some(el => el.tagName.toLowerCase() === 'tr');
        if (hasTr) {
            this.setAttribute('has-tr', '');
            this.removeAttribute('role');
        } else {
            this.removeAttribute('has-tr');
            this.setAttribute('role', 'row');
        }
    }

    private handleSlotChange = (): void => {
        this.detectNative();
    };

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute('role', 'row');
        this.detectNative();
    }

    override render(): TemplateResult {
        return html`<slot part="base" @slotchange=${this.handleSlotChange}></slot>`;
    }
}
