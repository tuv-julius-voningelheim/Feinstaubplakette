import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsButtonGroupStyles.js';

/**
 * @summary Button groups can be used to group related buttons into sections.
 * @documentation https://create.tuvsud.com/latest/components/button-group/develop-vsbU6zld
 * @status stable
 * @since 1.0
 *
 * @slot - One or more `<ts-button>` elements to display in the button group.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TsButtonGroupComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    @query('slot') defaultSlot!: HTMLSlotElement;

    @state() disableRole = false;

    /**
     * A label to use for the button group. This won't be displayed on the screen, but it will be announced by assistive
     * devices when interacting with the control and is strongly recommended.
     */
    @property() label = '';

    private handleFocus(event: Event) {
        const button = findButton(event.target as HTMLElement);
        button?.toggleAttribute('data-ts-button-group__button--focus', true);
    }

    private handleBlur(event: Event) {
        const button = findButton(event.target as HTMLElement);
        button?.toggleAttribute('data-ts-button-group__button--focus', false);
    }

    private handleMouseOver(event: Event) {
        const button = findButton(event.target as HTMLElement);
        button?.toggleAttribute('data-ts-button-group__button--hover', true);
    }

    private handleMouseOut(event: Event) {
        const button = findButton(event.target as HTMLElement);
        button?.toggleAttribute('data-ts-button-group__button--hover', false);
    }

    private handleSlotChange() {
        const slottedElements = [...this.defaultSlot.assignedElements({ flatten: true })] as HTMLElement[];

        slottedElements.forEach(el => {
            const index = slottedElements.indexOf(el);
            const button = findButton(el);

            if (button) {
                button.toggleAttribute('data-ts-button-group__button', true);
                button.toggleAttribute('data-ts-button-group__button--first', index === 0);
                button.toggleAttribute(
                    'data-ts-button-group__button--inner',
                    index > 0 && index < slottedElements.length - 1,
                );
                button.toggleAttribute('data-ts-button-group__button--last', index === slottedElements.length - 1);
                button.toggleAttribute(
                    'data-ts-button-group__button--radio',
                    button.tagName.toLowerCase() === 'ts-radio-button',
                );
            }
        });
    }

    override render() {
        return html`
            <div
                part="base"
                class="button-group"
                role="${this.disableRole ? 'presentation' : 'group'}"
                aria-label=${this.label}
                @focusout=${this.handleBlur}
                @focusin=${this.handleFocus}
                @mouseover=${this.handleMouseOver}
                @mouseout=${this.handleMouseOut}
            >
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }
}

function findButton(el: HTMLElement) {
    const selector = 'ts-button, ts-radio-button';

    // The button could be the target element or a child of it (e.g. a dropdown or tooltip anchor)
    return el.closest(selector) ?? el.querySelector(selector);
}
