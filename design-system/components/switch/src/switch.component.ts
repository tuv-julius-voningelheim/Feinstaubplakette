import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { defaultValue } from '@utils/internal/default-value.js';
import { FormControlController } from '@utils/internal/form.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import styles from './TsSwitchStyle.js';

/**
 * @summary Switches allow the user to toggle an option on or off.
 * @documentation https://create.tuvsud.com/latest/components/switch/develop-WcVs6wvx
 * @status stable
 * @since 1.0
 *
 * @slot - The switch's label.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Use this together with the default slot label to show e.g. an info icon without wrapping markup.
 * @slot help-text - Text that describes how to use the switch. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-change - Emitted when the control's checked state changes.
 * @event ts-input - Emitted when the control receives input.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The control that houses the switch's thumb.
 * @csspart thumb - The switch's thumb.
 * @csspart label - The switch's label.
 * @csspart form-control-help-text - The help text's wrapper.
 *
 * @cssproperty --width - The width of the switch.
 * @cssproperty --height - The height of the switch.
 * @cssproperty --thumb-size - The size of the thumb.
 */
export default class TsSwitchComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];

    private readonly formControlController = new FormControlController(this, {
        value: (control: ComponentFormControl) =>
            (control as TsSwitchComponent).checked ? (control as TsSwitchComponent).value || 'on' : undefined,
        defaultValue: (control: ComponentFormControl) => control.defaultChecked,
        setValue: (control: ComponentFormControl, value: unknown) =>
            ((control as TsSwitchComponent).checked = Boolean(value)),
    });

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    private readonly hasSlotController = new HasSlotController(this, 'help-text', '[default]', 'label-icon');

    private static idCounter = 0;

    private readonly inputId = `ts-switch-${++TsSwitchComponent.idCounter}`;
    private readonly helpTextId = `ts-switch-help-text-${TsSwitchComponent.idCounter}`;
    private readonly errorTextId = `ts-switch-error-text-${TsSwitchComponent.idCounter}`;

    @query('input[type="checkbox"]') input!: HTMLInputElement;

    @state() private hasFocus = false;

    /** The input's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** A title to show on hover. An empty title prevents browser validation tooltips from appearing on hover. */
    @property() override title = '';

    /** The name of the switch, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the switch, submitted as a name/value pair with form data. */
    @property() value!: string;

    /** The switch's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Disables the switch. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Draws the switch in a checked state. */
    @property({ type: Boolean, reflect: true }) checked = false;

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue('checked') defaultChecked = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Makes the switch a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** The switch's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Indicates whether the input is in an error state. **/
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. **/
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /** The aria-label attribute provides an accessible name for the input when there is no visible label. */
    @property({ attribute: 'aria-label' }) override ariaLabel: string = '';

    /**
     * The label stays in the DOM and is accessible to screen readers, but becomes visually hidden.
     */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' })
    labelVisuallyHidden = false;

    /** Visually hides the help text but keeps it accessible to screen readers. */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' })
    helpTextVisuallyHidden = false;

    /** Gets the validity state object */
    get validity() {
        return this.input.validity;
    }

    /** Gets the validation message */
    get validationMessage() {
        return this.input.validationMessage;
    }

    override firstUpdated() {
        this.formControlController.updateValidity();
    }

    private handleBlur() {
        this.hasFocus = false;
        this.emit('ts-blur');
    }

    private handleInput() {
        this.emit('ts-input');
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private handleClick() {
        this.checked = !this.checked;
        this.emit('ts-change');
    }

    private handleFocus() {
        this.hasFocus = true;
        this.emit('ts-focus');
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.checked = false;
            this.emit('ts-change');
            this.emit('ts-input');
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.checked = true;
            this.emit('ts-change');
            this.emit('ts-input');
        }
    }

    @watch(['error', 'errorMessage'], { waitUntilFirstUpdate: true })
    async handleErrorChange() {
        await this.updateComplete;
        if (!this.input) return;

        if (this.error) {
            this.input.setCustomValidity(this.errorMessage || ' ');
        } else {
            this.input.setCustomValidity('');
        }

        this.formControlController.updateValidity();
    }

    @watch('checked', { waitUntilFirstUpdate: true })
    handleCheckedChange() {
        this.input.checked = this.checked; // force a sync update
        this.formControlController.updateValidity();
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(true);
    }

    /** Simulates a click on the switch. */
    override click() {
        this.input.click();
    }

    /** Sets focus on the switch. */
    override focus(options?: FocusOptions) {
        this.input.focus(options);
    }

    /** Removes focus from the switch. */
    override blur() {
        this.input.blur();
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        return this.input.checkValidity();
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.input.reportValidity();
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        this.input.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    override render() {
        const hasDefaultSlot = this.hasSlotController.test('[default]');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;
        const hasLabel = this.label ? true : hasDefaultSlot;
        const showErrorText = this.error && this.errorMessage.length > 0;
        const describedBy = showErrorText ? this.errorTextId : hasHelpText ? this.helpTextId : undefined;

        return html`
            <div
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--has-help-text':
                        (hasHelpText || showErrorText) && !(this.helpTextVisuallyHidden && !showErrorText),
                    'form-control--label-hidden': this.labelVisuallyHidden,
                })}
            >
                <label
                    part="base"
                    class=${classMap({
                        switch: true,
                        'switch--checked': this.checked,
                        'switch--disabled': this.disabled,
                        'switch--focused': this.hasFocus,
                        'switch--small': this.size === 'small',
                        'switch--medium': this.size === 'medium',
                        'switch--large': this.size === 'large',
                        'switch--error': this.error,
                    })}
                >
                    <input
                        class="switch__input"
                        type="checkbox"
                        title=${
                            this.title /* An empty title prevents browser validation tooltips from appearing on hover */
                        }
                        name=${this.name}
                        value=${ifDefined(this.value)}
                        .checked=${live(this.checked)}
                        .disabled=${this.disabled}
                        .required=${this.required}
                        role="switch"
                        aria-describedby=${ifDefined(describedBy)}
                        aria-invalid=${this.error ? 'true' : 'false'}
                        aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                        aria-label=${ifDefined(!hasLabel ? this.ariaLabel || undefined : undefined)}
                        @click=${this.handleClick}
                        @input=${this.handleInput}
                        @invalid=${this.handleInvalid}
                        @blur=${this.handleBlur}
                        @focus=${this.handleFocus}
                        @keydown=${this.handleKeyDown}
                    />

                    <span part="control" class="switch__control">
                        <span part="thumb" class="switch__thumb"></span>
                    </span>

                    ${
                        hasLabel
                            ? html`
                                  <label
                                      part="label"
                                      class="switch__label ${
                                          this.labelVisuallyHidden ? 'visually-hidden' : ''
                                      } ${hasLabelIconSlot ? 'switch__label--has-icon' : ''}"
                                  >
                                      <slot>${this.label}</slot>
                                      <slot name="label-icon"></slot>
                                  </label>
                              `
                            : ''
                    }
                </label>

                <div
                    part="form-control-help-text"
                    class=${classMap({
                        'form-control__help-text': true,
                        'form-control__help-text--error': showErrorText,
                        'visually-hidden': !showErrorText && this.helpTextVisuallyHidden,
                    })}
                    aria-hidden=${showErrorText || hasHelpText ? 'false' : 'true'}
                >
                    ${
                        showErrorText
                            ? html`<span id=${this.errorTextId} role="alert" aria-live="polite"
                                  >${this.errorMessage}</span
                              >`
                            : html`<span id=${this.helpTextId}><slot name="help-text">${this.helpText}</slot></span>`
                    }
                </div>
            </div>
        `;
    }
}
