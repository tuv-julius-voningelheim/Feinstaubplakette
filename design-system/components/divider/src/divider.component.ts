import { property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsDividerStyle.js';

/**
 * @summary Dividers are used to visually separate or group elements.
 * @documentation https://create.tuvsud.com/latest/components/divider/develop-RApGHLad
 * @status stable
 * @since 1.0
 *
 * @cssproperty --color - The color of the divider.
 * @cssproperty --width - The width of the divider.
 * @cssproperty --spacing - The spacing of the divider.
 */
export default class TsDividerComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    /** Draws the divider in a vertical orientation. */
    @property({ type: Boolean, reflect: true }) vertical = false;

    @property({ type: Boolean, reflect: true }) decorative = true;

    override connectedCallback() {
        super.connectedCallback();
        this.updateAccessibility();
    }

    @watch('vertical')
    handleVerticalChange() {
        this.updateAccessibility();
    }

    @watch('decorative')
    handleDecorativeChange() {
        this.updateAccessibility();
    }

    private updateAccessibility() {
        if (this.decorative) {
            this.setAttribute('aria-hidden', 'true');
            this.removeAttribute('role');
        } else {
            this.removeAttribute('aria-hidden');
            this.setAttribute('role', 'separator');
        }

        this.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');
    }
}
