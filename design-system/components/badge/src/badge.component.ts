import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsBadgeStyle.js';

/**
 * @summary Badges are used to draw attention and display statuses or counts.
 * @documentation https://create.tuvsud.com/latest/components/badge/develop-xrxmJ3oI
 * @status stable
 * @since 1.0
 *
 * @slot - The badge's content.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TsBadgeComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    /** The badge's theme variant. */
    @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary';

    /** The badge's size variant. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws a pill-style badge with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false;

    /** Makes the badge pulsate to draw attention. */
    @property({ type: Boolean, reflect: true }) pulse = false;

    override render() {
        return html`
            <span
                part="base"
                class=${classMap({
                    badge: true,
                    'badge--primary': this.variant === 'primary',
                    'badge--success': this.variant === 'success',
                    'badge--neutral': this.variant === 'neutral',
                    'badge--warning': this.variant === 'warning',
                    'badge--danger': this.variant === 'danger',
                    'badge--small': this.size === 'small',
                    'badge--medium': this.size === 'medium',
                    'badge--large': this.size === 'large',
                    'badge--pill': this.pill,
                    'badge--pulse': this.pulse,
                })}
                role="status"
            >
                <slot></slot>
            </span>
        `;
    }
}
