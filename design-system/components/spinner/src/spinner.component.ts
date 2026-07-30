import { html } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsSpinnerStyle.js';

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 * @documentation https://create.tuvsud.com/latest/components/spinner/develop-1YkpDe5b
 * @status stable
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
export default class TsSpinnerComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private readonly localize = new LocalizeController(this);

    /** A custom accessible label for the spinner. If omitted, `aria-label` defaults to the localized "Loading" term. */
    @property() label = '';

    override render() {
        const ariaLabel = this.label || this.localize.term('loading');

        return html`
            <svg part="base" class="spinner" viewBox="0 0 100 100" role="progressbar" aria-label=${ariaLabel}>
                <circle class="spinner__track" cx="50" cy="50" r="48"></circle>
                <circle class="spinner__indicator" cx="50" cy="50" r="48"></circle>
            </svg>
        `;
    }
}
