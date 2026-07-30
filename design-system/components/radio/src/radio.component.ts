import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsRadioStyles.js';

/**
 * @summary Radios allow the user to select a single option from a group.
 * @documentation https://create.tuvsud.com/latest/components/radio/develop-Au37Zh40
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot - The radio's label.
 * @slot help-text - Text that describes how to use the radio. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-focus - Emitted when the control gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The circular container that wraps the radio's checked state.
 * @csspart control--checked - The radio control when the radio is checked.
 * @csspart checked-icon - The checked icon, an `<ts-icon>` element.
 * @csspart label - The container that wraps the radio's label.
 * @csspart help-text - The help text's wrapper.
 * @csspart error-message - The error message's wrapper.
 */
export default class TsRadioComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    private readonly hasSlotController = new HasSlotController(this, 'help-text');

    private static idCounter = 0;
    private readonly helpTextId = `ts-radio-help-text-${++TsRadioComponent.idCounter}`;
    private readonly errorTextId = `ts-radio-error-text-${TsRadioComponent.idCounter}`;

    @state() checked = false;
    @state() protected hasFocus = false;

    /** Indicates whether the radio is in an error state. */
    @property({ type: Boolean, reflect: true }) error = false;

    /** The error message to display when the radio is in an error state. */
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /** The radio's aria-label. If the radio has a label (i.e. non-empty default slot), this attribute is ignored. */
    @property({ attribute: 'aria-label' }) override ariaLabel = '';

    /** The radio's value. When selected, the radio group will receive this value. */
    @property() value!: string;

    /**
     * The radio's size. When used inside a radio group, the size will be determined by the radio group's size so this
     * attribute can typically be omitted.
     */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Disables the radio. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** The radio's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Visually hides the help text but keeps it accessible to screen readers. */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' })
    helpTextVisuallyHidden = false;

    constructor() {
        super();
        this.addEventListener('focusin', this.handleFocusIn);
        this.addEventListener('focusout', this.handleFocusOut);
        this.addEventListener('click', this.handleClick);
        this.addEventListener('keydown', this.handleKeyDown);
    }

    override connectedCallback() {
        super.connectedCallback();
        this.setInitialAttributes();
    }

    override firstUpdated() {
        this.syncA11y();
    }

    private handleFocusIn = () => {
        if (this.disabled) return;
        this.hasFocus = true;
        this.emit('ts-focus');
    };

    private handleFocusOut = () => {
        this.hasFocus = false;
        this.emit('ts-blur');
    };

    private handleClick = () => {
        if (this.disabled) return;
        this.checked = true;
    };

    private handleKeyDown = (event: KeyboardEvent) => {
        if (this.disabled) return;

        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            this.checked = true;
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            this.checked = true;
        }
    };

    private setInitialAttributes() {
        this.setAttribute('role', 'radio');
        this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
        this.setAttribute('aria-invalid', this.error ? 'true' : 'false');
        this.setAttribute('tabindex', this.computeTabIndex());
    }

    private computeTabIndex() {
        if (this.disabled) return '-1';
        return this.checked ? '0' : '-1';
    }

    private syncA11y() {
        const hasLabel = (this.textContent ?? '').trim().length > 0;
        const ariaLabel = hasLabel ? undefined : this.ariaLabel || undefined;

        if (hasLabel) {
            this.removeAttribute('aria-labelledby');
            this.removeAttribute('aria-label');
        } else {
            this.removeAttribute('aria-labelledby');
            if (ariaLabel) this.setAttribute('aria-label', ariaLabel);
            else this.removeAttribute('aria-label');
        }

        this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
        this.setAttribute('aria-invalid', this.error ? 'true' : 'false');
        this.removeAttribute('aria-errormessage');

        this.setAttribute('tabindex', this.computeTabIndex());
    }

    @watch('checked')
    handleCheckedChange() {
        this.syncA11y();
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        this.syncA11y();
    }

    @watch(['error', 'errorMessage'], { waitUntilFirstUpdate: true })
    handleErrorChange() {
        this.syncA11y();
    }

    @watch('ariaLabel', { waitUntilFirstUpdate: true })
    handleAriaLabelChange() {
        this.syncA11y();
    }

    override render() {
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;
        const showErrorText = this.error && this.errorMessage.length > 0;
        const describedBy = showErrorText ? this.errorTextId : hasHelpText ? this.helpTextId : undefined;

        return html`
            <span
                part="base"
                class=${classMap({
                    radio: true,
                    'radio--checked': this.checked,
                    'radio--disabled': this.disabled,
                    'radio--focused': this.hasFocus,
                    'radio--error': this.error,
                    'radio--small': this.size === 'small',
                    'radio--medium': this.size === 'medium',
                    'radio--large': this.size === 'large',
                    'radio--has-help-text': hasHelpText || showErrorText,
                })}
                aria-describedby=${ifDefined(describedBy)}
            >
                <span part="${`control${this.checked ? ' control--checked' : ''}`}" class="radio__control">
                    ${
                        this.checked
                            ? html`
                                  <ts-icon
                                      part="checked-icon"
                                      class="radio__checked-icon"
                                      library="system"
                                      name="radio"
                                  ></ts-icon>
                              `
                            : ''
                    }
                </span>

                <span part="label" class="radio__label"><slot></slot></span>
            </span>

            ${
                showErrorText
                    ? html`
                          <div
                              part="error-message"
                              class="radio__error-message"
                              id=${this.errorTextId}
                              role="alert"
                              aria-live="polite"
                          >
                              ${this.errorMessage}
                          </div>
                      `
                    : hasHelpText
                      ? html`
                            <div
                                part="help-text"
                                id=${this.helpTextId}
                                class=${classMap({
                                    radio__help_text: true,
                                    'visually-hidden': this.helpTextVisuallyHidden,
                                })}
                            >
                                <slot name="help-text">${this.helpText}</slot>
                            </div>
                        `
                      : ''
            }
        `;
    }
}
