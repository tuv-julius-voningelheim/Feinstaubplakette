import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { CSSResultGroup, TemplateResult } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsCellStyles.js';

/**
 * @summary A table data cell. Use inside `<ts-row>` within `<ts-table>`.
 * In wrapping mode you can slot a native `<td>` inside `<ts-cell>` and the
 * component will become display:contents so the `<td>` participates directly
 * in the table layout.
 * @status experimental
 * @since 1.27
 *
 * @slot - The cell content, OR a native `<td>` in wrapping mode.
 *
 * @csspart base - The component's root element (`display: table-cell`).
 */
export default class TsCellComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    /** Cell text alignment. */
    @property({ reflect: true }) align?: 'left' | 'center' | 'right';

    /** Pin this cell to the left or right side of the scroll container. */
    @property({ reflect: true }) fixed?: 'left' | 'right';

    /** Optional fixed width (e.g. `120px`). */
    @property({ reflect: true }) width?: string;

    private detectNative(): void {
        const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
        const children = slot ? slot.assignedElements({ flatten: true }) : Array.from(this.children);
        const hasTd = children.some(el => el.tagName.toLowerCase() === 'td');
        if (hasTd) {
            this.setAttribute('has-td', '');
            this.removeAttribute('role'); // <td> already has implicit gridcell semantics inside a grid
        } else {
            this.removeAttribute('has-td');
            this.setAttribute('role', 'gridcell');
        }
    }

    private handleSlotChange = (): void => {
        this.detectNative();
    };

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute('role', 'gridcell');
        this.detectNative();
    }

    override render(): TemplateResult {
        if (this.hasAttribute('has-td')) {
            return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
        }
        const style = styleMap({ width: this.width ?? '' });
        return html`<slot part="base" style=${style} @slotchange=${this.handleSlotChange}></slot>`;
    }
}
