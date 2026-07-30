import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsSkeletonStyle.js';

/**
 * @summary Skeletons are used to provide a visual representation of where content will eventually be drawn.
 * @documentation https://create.tuvsud.com/latest/components/skeleton/develop-2VVV9ULB
 * @status stable
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The skeleton's indicator which is responsible for its color and animation.
 *
 * @cssproperty --border-radius - The skeleton's border radius.
 * @cssproperty --color - The color of the skeleton.
 * @cssproperty --sheen-color - The sheen color when the skeleton is in its loading state.
 */
export default class TsSkeletonComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    /** Determines which effect the skeleton will use. */
    @property() effect: 'pulse' | 'sheen' | 'none' = 'none';

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    skeleton: true,
                    'skeleton--pulse': this.effect === 'pulse',
                    'skeleton--sheen': this.effect === 'sheen',
                })}
            >
                <div part="indicator" class="skeleton__indicator"></div>
            </div>
        `;
    }
}
