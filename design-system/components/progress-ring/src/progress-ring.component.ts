import { html } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsProgressRingStyles.js';

/**
 * @summary Progress rings are used to show the progress of a determinate operation in a circular fashion.
 * @documentation https://create.tuvsud.com/latest/components/progress-ring/develop-TSsUbOqj
 * @status stable
 * @since 1.0
 *
 * @slot - A label to show inside the ring.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The progress ring label.
 *
 * @cssproperty --size - The diameter of the progress ring (cannot be a percentage).
 * @cssproperty --track-width - The width of the track in SVG user units (viewBox is 0 0 100 100).
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-width - The width of the indicator. Defaults to the track width.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --indicator-transition-duration - The duration of the indicator's transition when the value changes.
 */
export default class TsProgressRingComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    /**
     * All geometry lives in a fixed 100×100 viewBox.
     * stroke-width is set as SVG attribute (8 units) so it lives in the same
     * coordinate space as the path — no CSS geometry properties that get stripped
     * by clean-css / esbuild / lightningcss.
     *
     * r = 50 - strokeWidth/2  →  44
     * circumference = 2 * PI * 44  ≈  276.46
     */
    private static readonly STROKE_WIDTH = 8;
    private static readonly RADIUS = 50 - TsProgressRingComponent.STROKE_WIDTH / 2; // 46
    private static readonly CIRCUMFERENCE = 2 * Math.PI * TsProgressRingComponent.RADIUS;

    /** The current progress as a percentage, 0 to 100. */
    @property({ type: Number, reflect: true }) value = 0;

    /** A custom label for assistive devices. */
    @property() label = '';

    private get dashOffset(): number {
        const clamped = Math.min(100, Math.max(0, this.value));
        return TsProgressRingComponent.CIRCUMFERENCE * (1 - clamped / 100);
    }

    override render() {
        const { STROKE_WIDTH, RADIUS, CIRCUMFERENCE } = TsProgressRingComponent;

        return html`
            <div
                part="base"
                class="progress-ring"
                role="progressbar"
                aria-label=${this.label.length > 0 ? this.label : this.localize.term('progress')}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${this.value}"
            >
                <svg class="progress-ring__image" viewBox="0 0 100 100">
                    <!-- track: full circle, always visible -->
                    <circle
                        class="progress-ring__track"
                        cx="50"
                        cy="50"
                        r="${RADIUS}"
                        stroke-width="${STROKE_WIDTH}"
                    ></circle>

                    <!-- indicator: partial arc driven by value -->
                    <circle
                        class="progress-ring__indicator"
                        cx="50"
                        cy="50"
                        r="${RADIUS}"
                        stroke-width="${STROKE_WIDTH}"
                        stroke-dasharray="${CIRCUMFERENCE}"
                        stroke-dashoffset="${this.dashOffset}"
                    ></circle>
                </svg>

                <slot id="label" part="label" class="progress-ring__label"></slot>
            </div>
        `;
    }
}
