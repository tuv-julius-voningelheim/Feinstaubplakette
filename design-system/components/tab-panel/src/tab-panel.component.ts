import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsTabPanelStyles.js';

let id = 0;

/**
 * @summary Tab panels are used inside [tab groups](/components/tab-group) to display tabbed content.
 * @documentation https://create.tuvsud.com/latest/components/tab-panel/develop-rQ20oVQK
 * @status stable
 * @since 1.0
 *
 * @slot - The tab panel's content.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --padding - The tab panel's padding.
 */
export default class TsTabPanelComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private readonly attrId = ++id;
    private readonly componentId = `ts-tab-panel-${this.attrId}`;

    /** The tab panel's name. */
    @property({ reflect: true }) name = '';

    /** When true, the tab panel will be shown. */
    @property({ type: Boolean, reflect: true }) active = false;

    override connectedCallback() {
        super.connectedCallback();
        this.id = this.id.length > 0 ? this.id : this.componentId;
        this.setAttribute('role', 'tabpanel');
    }

    @watch('active')
    handleActiveChange() {
        this.setAttribute('aria-hidden', this.active ? 'false' : 'true');
    }

    override render() {
        return html`
            <slot
                part="base"
                class=${classMap({
                    'tab-panel': true,
                    'tab-panel--active': this.active,
                })}
            ></slot>
        `;
    }
}
