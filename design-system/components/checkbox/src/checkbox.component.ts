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

import { TsIcon } from '@components/icon/index.js';

import styles from './TsCheckboxStyle.js';

/**
 * @summary Checkboxes allow the user to toggle an option on or off.
 * @documentation https://create.tuvsud.com/latest/components/checkbox/develop-kpltcspA
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot - The checkbox's label.
 * @slot label-icon - An icon (or any element) placed inline after the label text.
 * @slot help-text - Text that describes how to use the checkbox. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the checkbox loses focus.
 * @event ts-change - Emitted when the checked state changes.
 * @event ts-focus - Emitted when the checkbox gains focus.
 * @event ts-input - Emitted when the checkbox receives input.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The square container that wraps the checkbox's checked state.
 * @csspart control--checked - Matches the control part when the checkbox is checked.
 * @csspart control--indeterminate - Matches the control part when the checkbox is indeterminate.
 * @csspart checked-icon - The checked icon, an `<ts-icon>` element.
 * @csspart indeterminate-icon - The indeterminate icon, an `<ts-icon>` element.
 * @csspart label - The container that wraps the checkbox's label.
 * @csspart form-control-help-text - The help text's wrapper.
 */
export default class TsCheckboxComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    private readonly formControlController = new FormControlController(this, {
        value: (control: ComponentFormControl) =>
            (control as TsCheckboxComponent).checked ? (control as TsCheckboxComponent).value || 'on' : undefined,
        defaultValue: (control: ComponentFormControl) => (control as TsCheckboxComponent).defaultChecked,
        setValue: (control: ComponentFormControl, value: unknown) =>
            ((control as TsCheckboxComponent).checked = Boolean(value)),
    });

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label-icon');

    private static idCounter = 0;

    private readonly helpTextId = `ts-checkbox-help-text-${++TsCheckboxComponent.idCounter}`;
    private readonly errorTextId = `ts-checkbox-error-text-${TsCheckboxComponent.idCounter}`;

    @query('input[type="checkbox"]') input!: HTMLInputElement;

    @state() private hasFocus = false;

    /** The title of the checkbox. This is primarily used for accessibility. */
    @property() override title = '';

    /** The name of the checkbox, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the checkbox, submitted as a name/value pair with form data. */
    @property() value!: string;

    /** The checkbox's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Disables the checkbox. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Draws the checkbox in a checked state. */
    @property({ type: Boolean, reflect: true }) checked = false;

    /**
     * Draws the checkbox in an indeterminate state. This is usually applied to checkboxes that represents a "select
     * all/none" behavior when associated checkboxes have a mix of checked and unchecked states.
     */
    @property({ type: Boolean, reflect: true }) indeterminate = false;

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue('checked') defaultChecked = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Makes the checkbox a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** The checkbox's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Indicates whether the input is in an error state. **/
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. **/
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /** The checkbox's aria-label. If the checkbox has a label (i.e. non-empty default slot), this attribute is ignored. */
    @property({ attribute: 'aria-label' }) override ariaLabel = '';

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

    private handleClick() {
        this.checked = !this.checked;
        this.indeterminate = false;
        // @ts-expect-error eslint doesn't like custom events
        this.emit('ts-change', {
            detail: { checked: this.checked, indeterminate: this.indeterminate, value: this.value ?? 'on' },
        });
    }

    private handleInputChange() {
        // @ts-expect-error eslint doesn't like custom events
        this.emit('ts-change', {
            detail: { checked: this.checked, indeterminate: this.indeterminate, value: this.value ?? 'on' },
        });
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

    private handleFocus() {
        this.hasFocus = true;
        this.emit('ts-focus');
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        this.formControlController.setValidity(this.disabled);
    }

    @watch(['checked', 'indeterminate'], { waitUntilFirstUpdate: true })
    handleStateChange() {
        this.input.checked = this.checked;
        this.input.indeterminate = this.indeterminate;
        this.formControlController.updateValidity();
    }

    /** Simulates a click on the checkbox. */
    override click() {
        this.input.click();
    }

    /** Sets focus on the checkbox. */
    override focus(options?: FocusOptions) {
        this.input.focus(options);
    }

    /** Removes focus from the checkbox. */
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

    /**
     * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
     * the custom validation message, call this method with an empty string.
     */
    setCustomValidity(message: string) {
        this.input.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    @watch(['error', 'errorMessage'], { waitUntilFirstUpdate: true })
    async handleErrorChange() {
        await this.updateComplete;
        if (!this.input) return;

        if (this.error) this.input.setCustomValidity(this.errorMessage || ' ');
        else this.input.setCustomValidity('');

        this.formControlController.updateValidity();
    }

    override render() {
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;

        const hasLabel = this.textContent!.trim().length > 0;
        const ariaLabel = hasLabel ? undefined : this.ariaLabel || this.title || undefined;

        const showErrorText = this.error && this.errorMessage.length > 0;
        const describedBy = showErrorText ? this.errorTextId : hasHelpText ? this.helpTextId : undefined;

        const hasBottomText = hasHelpText || showErrorText;

        return html`
            <div
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--has-help-text': hasBottomText && !(this.helpTextVisuallyHidden && !showErrorText),
                    'form-control--label-hidden': this.labelVisuallyHidden,
                })}
            >
                <label
                    part="base"
                    class=${classMap({
                        checkbox: true,
                        'checkbox--checked': this.checked,
                        'checkbox--disabled': this.disabled,
                        'checkbox--focused': this.hasFocus,
                        'checkbox--indeterminate': this.indeterminate,
                        'checkbox--small': this.size === 'small',
                        'checkbox--medium': this.size === 'medium',
                        'checkbox--large': this.size === 'large',
                        'checkbox--error': this.error,
                    })}
                >
                    <input
                        class="checkbox__input"
                        type="checkbox"
                        title=${this.title}
                        name=${this.name}
                        value=${ifDefined(this.value)}
                        .indeterminate=${live(this.indeterminate)}
                        .checked=${live(this.checked)}
                        .disabled=${this.disabled}
                        .required=${this.required}
                        aria-describedby=${ifDefined(describedBy)}
                        aria-invalid=${this.error ? 'true' : 'false'}
                        aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                        aria-label=${ifDefined(ariaLabel)}
                        @click=${this.handleClick}
                        @input=${this.handleInput}
                        @invalid=${this.handleInvalid}
                        @blur=${this.handleBlur}
                        @focus=${this.handleFocus}
                    />

                    <span
                        part="control${this.checked ? ' control--checked' : ''}${
                            this.indeterminate ? ' control--indeterminate' : ''
                        }"
                        class="checkbox__control"
                    >
                        ${
                            this.checked
                                ? html`
                                      <ts-icon
                                          part="checked-icon"
                                          class="checkbox__checked-icon"
                                          library="system"
                                          name="check"
                                      ></ts-icon>
                                  `
                                : ''
                        }
                        ${
                            !this.checked && this.indeterminate
                                ? html`
                                      <ts-icon
                                          part="indeterminate-icon"
                                          class="checkbox__indeterminate-icon"
                                          library="system"
                                          name="check_indeterminate_small"
                                      ></ts-icon>
                                  `
                                : ''
                        }
                    </span>

                    <div
                        part="label"
                        class="checkbox__label ${this.labelVisuallyHidden ? 'visually-hidden' : ''} ${
                            hasLabelIconSlot ? 'checkbox__label--has-icon' : ''
                        }"
                    >
                        <span><slot></slot></span><slot name="label-icon"></slot>
                    </div>
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
                              > `
                            : html`<span id=${this.helpTextId}><slot name="help-text">${this.helpText}</slot></span>`
                    }
                </div>
            </div>
        `;
    }
}
