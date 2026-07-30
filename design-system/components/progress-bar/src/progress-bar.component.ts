import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsProgressBarStyles.js';

/**
 * @summary Progress bars are used to show the status of an ongoing operation.
 * @documentation https://create.tuvsud.com/latest/components/progress-bar/develop-RpOOoBXT
 * @status stable
 * @since 1.0
 *
 * @slot - A label to show inside the progress indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The progress bar's indicator.
 * @csspart label - The progress bar's label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --label-color - The color of the label.
 */
export default class TsProgressBarComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    /** The current progress as a percentage, 0 to 100. */
    @property({ type: Number, reflect: true }) value = 0;

    /** When true, percentage is ignored, the label is hidden, and the progress bar is drawn in an indeterminate state. */
    @property({ type: Boolean, reflect: true }) indeterminate = false;

    /** A custom label for assistive devices. */
    @property() label = '';

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    'progress-bar': true,
                    'progress-bar--indeterminate': this.indeterminate,
                    'progress-bar--rtl': this.localize.dir() === 'rtl',
                })}
                role="progressbar"
                title=${ifDefined(this.title)}
                aria-label=${this.label.length > 0 ? this.label : this.localize.term('progress')}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${this.indeterminate ? 0 : this.value}
            >
                <div part="indicator" class="progress-bar__indicator" style=${styleMap({ width: `${this.value}%` })}>
                    ${!this.indeterminate ? html` <slot part="label" class="progress-bar__label"></slot> ` : ''}
                </div>
            </div>
        `;
    }
}
