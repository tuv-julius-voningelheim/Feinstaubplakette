import { html } from 'lit';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsMenuLabelStyle.js';

/**
 * @summary Menu labels are used to describe a group of menu items.
 * @documentation https://create.tuvsud.com/latest/components/menu-label/develop-0G9yIGMt
 * @status stable
 * @since 1.0
 *
 * @slot - The menu label's content.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TsMenuLabelComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    override render() {
        return html` <slot part="base" class="menu-label"></slot> `;
    }
}
