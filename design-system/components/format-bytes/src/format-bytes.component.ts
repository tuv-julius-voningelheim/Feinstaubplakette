import { property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsFormatBytesStyle.js';

/**
 * @summary Formats a number as a human readable bytes value.
 * @documentation https://create.tuvsud.com/latest/components/format-bytes/develop-TanlcivU
 * @status stable
 * @since 1.0
 */
export default class TsFormatBytesComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    private readonly localize = new LocalizeController(this);

    /** The number to format in bytes. */
    @property({ type: Number }) value = 0;

    /** The type of unit to display. */
    @property() unit: 'byte' | 'bit' = 'byte';

    /** Determines how to display the result, e.g. "100 bytes", "100 b", or "100b". */
    @property() display: 'long' | 'short' | 'narrow' = 'short';

    override render() {
        if (isNaN(this.value)) {
            return '';
        }

        const bitPrefixes = ['', 'kilo', 'mega', 'giga', 'tera']; // petabit isn't a supported unit
        const bytePrefixes = ['', 'kilo', 'mega', 'giga', 'tera', 'peta'];
        const prefix = this.unit === 'bit' ? bitPrefixes : bytePrefixes;
        const index = Math.max(0, Math.min(Math.floor(Math.log10(this.value) / 3), prefix.length - 1));
        const unit = prefix[index] + this.unit;
        const valueToFormat = parseFloat((this.value / Math.pow(1000, index)).toPrecision(3));

        return this.localize.number(valueToFormat, {
            style: 'unit',
            unit,
            unitDisplay: this.display,
        });
    }
}
