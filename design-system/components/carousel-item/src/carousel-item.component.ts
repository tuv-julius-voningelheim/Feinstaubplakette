import { html } from 'lit';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsCarouselItemStyles.js';

/**
 * @summary A carousel item represent a slide within a [carousel](/components/carousel).
 * @documentation https://create.tuvsud.com/latest/components/carousel/develop-FIEg6jtw
 * @status stable
 * @since 1.0
 *
 * @slot - The carousel item's content.
 *
 * @cssproperty --aspect-ratio - The slide's aspect ratio. Inherited from the carousel by default.
 *
 */
export default class TsCarouselItemComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    override render() {
        return html` <slot></slot> `;
    }
}
