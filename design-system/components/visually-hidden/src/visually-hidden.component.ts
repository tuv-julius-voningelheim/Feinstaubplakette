import { html } from 'lit';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsVisuallyHiddenStyle.js';

/**
 * @summary The visually hidden utility makes content accessible to assistive devices without displaying it on the screen.
 * @documentation https://create.tuvsud.com/latest/components/visually-hidden/develop-AIQ8uHFJ
 * @status stable
 * @since 1.0
 *
 * @slot - The content to be visually hidden.
 */
export default class TsVisuallyHiddenComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    override render() {
        return html` <slot></slot> `;
    }
}
