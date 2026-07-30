import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { defaultValue } from '@utils/internal/default-value.js';
import { FormControlController } from '@utils/internal/form.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsInputStyles.js';

/**
 * @summary Inputs collect data from the user.
 * @documentation https://create.tuvsud.com/latest/components/input/develop-ExOPGUyM
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Use this together with the `label` attribute or `label` slot to show e.g. an info icon without wrapping markup.
 * @slot prefix - Used to prepend a presentational icon or similar element to the input.
 * @slot suffix - Used to append a presentational icon or similar element to the input.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot show-password-icon - An icon to use in lieu of the default show password icon.
 * @slot hide-password-icon - An icon to use in lieu of the default hide password icon.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-change - Emitted when an alteration to the control's value is committed by the user.
 * @event ts-clear - Emitted when the clear button is activated.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-input - Emitted when the control receives input.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal `<input>` control.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart clear-button - The clear button.
 * @csspart password-toggle-button - The password toggle button.
 * @csspart suffix - The container that wraps the suffix.
 */
export default class TsInputComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    private readonly formControlController = new FormControlController(this, {
        assumeInteractionOn: ['ts-blur', 'ts-input'],
    });
    private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label', 'label-icon');
    private readonly localize = new LocalizeController(this);

    private __numberInput = Object.assign(document.createElement('input'), {
        type: 'number',
    });
    private __dateInput = Object.assign(document.createElement('input'), {
        type: 'date',
    });

    private static idCounter = 0;

    private readonly inputId = `ts-input-${++TsInputComponent.idCounter}`;
    private readonly helpTextId = `ts-input-help-text-${TsInputComponent.idCounter}`;
    private readonly errorTextId = `ts-input-error-text-${TsInputComponent.idCounter}`;

    @query('.input__control') input!: HTMLInputElement;

    /** The title attribute to apply to the input element. **/
    @property() override title = '';

    /** Indicates whether the input is in an error state. **/
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. **/
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /** Indicates whether the input is in a success state. **/
    @property({ type: Boolean, reflect: true }) success = false;

    /** Indicates whether the input is in a warning state. **/
    @property({ type: Boolean, reflect: true }) warning = false;

    /**
     * The type of input. Works the same as a native `<input>` element, but only a subset of types
     * are supported. Defaults to `text`.
     */
    @property({ reflect: true }) type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' =
        'text';

    /** The name of the input, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the input, submitted as a name/value pair with form data. */
    @property() value = '';

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue() defaultValue = '';

    /** The input's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws a filled input. */
    @property({ type: Boolean, reflect: true }) filled = false;

    /** Draws a pill-style input with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false;

    /** The input's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** The input's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** Adds a clear button when the input is not empty. */
    @property({ type: Boolean }) clearable = false;

    /** Disables the input. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Placeholder text to show as a hint when the input is empty. */
    @property() placeholder = '';

    /** Makes the input readonly. Applies a locked visual style. */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /**
     * Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true`
     * and displays a lock icon. Set `lock=false` to suppress the icon while keeping the readonly style.
     * Has no effect when `readonly` is false.
     */
    @property({ type: Boolean, reflect: true }) lock = true;

    /** Adds a button to toggle the password's visibility. Only applies to password types. */
    @property({ attribute: 'password-toggle', type: Boolean }) passwordToggle = false;

    /** Determines whether or not the password is currently visible. Only applies to password input types. */
    @property({ attribute: 'password-visible', type: Boolean }) passwordVisible = false;

    /** Hides the browser's built-in increment/decrement spin buttons for number inputs. */
    @property({ attribute: 'no-spin-buttons', type: Boolean }) noSpinButtons = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`.
     * The form must be in the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Makes the input a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** A regular expression pattern to validate input against. */
    @property() pattern!: string;

    /** The minimum length of input that will be considered valid. */
    @property({ type: Number }) minlength!: number;

    /** The maximum length of input that will be considered valid. */
    @property({ type: Number }) maxlength!: number;

    /** The input's minimum value. Only applies to date and number input types. */
    @property() min!: number | string;

    /** The input's maximum value. Only applies to date and number input types. */
    @property() max!: number | string;

    /**
     * Specifies the granularity that the value must adhere to, or the special value `any` which means no stepping is
     * implied, allowing any numeric value. Only applies to date and number input types.
     */
    @property() step!: number | 'any';

    /** Controls whether and how text input is automatically capitalized as it is entered by the user. */
    @property() override autocapitalize!: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';

    /** Indicates whether the browser's autocorrect feature is on or off. */
    @property({
        type: Boolean,
        converter: {
            fromAttribute: value => value !== 'off' && value !== null && value !== 'false',
            toAttribute: value => (value ? 'on' : 'off'),
        },
    })
    override autocorrect!: boolean;

    /**
     * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
     * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
     */
    @property() autocomplete!: string;

    /** Indicates that the input should receive focus on page load. */
    @property({ type: Boolean }) override autofocus!: boolean;

    /** Used to customize the label or icon of the Enter key on virtual keyboards. */
    @property() enterkeyhint!: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

    /** Enables spell checking on the input. */
    @property({
        type: Boolean,
        converter: {
            // Allow "true|false" attribute values but keep the property boolean
            fromAttribute: value => !(!value || value === 'false'),
            toAttribute: value => (value ? 'true' : 'false'),
        },
    })
    override spellcheck = true;

    /**
     * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
     * keyboard on supportive devices.
     */
    @property() inputmode!: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

    /**
     * The label stays in the DOM and is accessible to screen readers, but becomes visually hidden.
     */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' })
    labelVisuallyHidden = false;

    /**
     * The help text stays in the DOM and is accessible to screen readers, but becomes visually hidden.
     */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' })
    helpTextVisuallyHidden = false;

    /** The aria-label attribute provides an accessible name for the input when there is no visible label. */
    @property({ attribute: 'aria-label' }) override ariaLabel: string = '';

    /**
     * Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted.
     * This will use the native `<input type="{{type}}">` implementation and may result in an error.
     */
    get valueAsDate() {
        this.__dateInput.type = this.type;
        this.__dateInput.value = this.value;
        return this.input?.valueAsDate || this.__dateInput.valueAsDate;
    }

    set valueAsDate(newValue: Date | null) {
        this.__dateInput.type = this.type;
        this.__dateInput.valueAsDate = newValue;
        this.value = this.__dateInput.value;
    }

    /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
    get valueAsNumber() {
        this.__numberInput.value = this.value;
        return this.input?.valueAsNumber || this.__numberInput.valueAsNumber;
    }

    set valueAsNumber(newValue: number) {
        this.__numberInput.valueAsNumber = newValue;
        this.value = this.__numberInput.value;
    }

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
        void this.handleErrorChange();
    }

    private handleBlur() {
        this.emit('ts-blur');
    }

    private handleChange() {
        this.value = this.input.value;
        this.emit('ts-change');
    }

    private handleClearClick(event: MouseEvent) {
        event.preventDefault();

        if (this.value !== '') {
            this.value = '';
            this.emit('ts-clear');
            this.emit('ts-input');
            this.emit('ts-change');
        }

        this.input.focus();
    }

    private handleFocus() {
        this.emit('ts-focus');
    }

    private handleInput() {
        this.value = this.input.value;
        this.formControlController.updateValidity();
        this.emit('ts-input');
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private handleKeyDown(event: KeyboardEvent) {
        const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

        // Pressing enter when focused on an input should submit the form like a native input, but we wait a tick before
        // submitting to allow users to cancel the keydown event if they need to
        if (event.key === 'Enter' && !hasModifier) {
            setTimeout(() => {
                //
                // When using an Input Method Editor (IME), pressing enter will cause the form to submit unexpectedly.
                // One way to check for this is to look at event.isComposing, which will be true when the IME is open.
                //
                //
                if (!event.defaultPrevented && !event.isComposing) {
                    this.formControlController.submit();
                }
            });
        }
    }

    private handlePasswordToggle() {
        this.passwordVisible = !this.passwordVisible;
    }

    private handleLabelSlotChange(event: Event) {
        const slot = event.target as HTMLSlotElement;
        const assignedNodes = slot.assignedElements({ flatten: true });

        // Find any <label> elements in the slotted content (direct or nested)
        const findLabels = (elements: Element[]): HTMLLabelElement[] => {
            const labels: HTMLLabelElement[] = [];
            for (const el of elements) {
                if (el.tagName === 'LABEL') {
                    labels.push(el as HTMLLabelElement);
                }
                labels.push(...findLabels(Array.from(el.children)));
            }
            return labels;
        };

        const slottedLabels = findLabels(assignedNodes);
        for (const label of slottedLabels) {
            if (!label.htmlFor) {
                label.htmlFor = this.inputId;
            }
        }
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        // Disabled form controls are always valid
        this.formControlController.setValidity(this.disabled);
    }

    @watch('step', { waitUntilFirstUpdate: true })
    handleStepChange() {
        // If step changes, the value may become invalid so we need to recheck after the update. We set the new step
        // imperatively so we don't have to wait for the next render to report the updated validity.
        this.input.step = String(this.step);
        this.formControlController.updateValidity();
    }

    @watch('value', { waitUntilFirstUpdate: true })
    async handleValueChange() {
        await this.updateComplete;
        // Only call updateValidity here for external/programmatic value changes.
        // Typed input already calls updateValidity() synchronously in handleInput().
        if (document.activeElement !== this && this.shadowRoot?.activeElement !== this.input) {
            this.formControlController.updateValidity();
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

    /** Sets focus on the input. */
    override focus(options?: FocusOptions) {
        this.input.focus(options);
    }

    /** Removes focus from the input. */
    override blur() {
        this.input.blur();
    }

    /** Selects all the text in the input. */
    select() {
        this.input.select();
    }

    /** Sets the start and end positions of the text selection (0-based). */
    setSelectionRange(
        selectionStart: number,
        selectionEnd: number,
        selectionDirection: 'forward' | 'backward' | 'none' = 'none',
    ) {
        this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }

    /** Replaces a range of text with a new string. */
    setRangeText(
        replacement: string,
        start?: number,
        end?: number,
        selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve',
    ) {
        const selectionStart = start ?? this.input.selectionStart!;
        const selectionEnd = end ?? this.input.selectionEnd!;

        this.input.setRangeText(replacement, selectionStart, selectionEnd, selectMode);

        if (this.value !== this.input.value) {
            this.value = this.input.value;
        }
    }

    /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
    showPicker() {
        if ('showPicker' in HTMLInputElement.prototype) {
            this.input.showPicker();
        }
    }

    /** Increments the value of a numeric input type by the value of the step attribute. */
    stepUp() {
        this.input.stepUp();
        if (this.value !== this.input.value) {
            this.value = this.input.value;
        }
    }

    /** Decrements the value of a numeric input type by the value of the step attribute. */
    stepDown() {
        this.input.stepDown();
        if (this.value !== this.input.value) {
            this.value = this.input.value;
        }
    }

    /** Checks for validity but does not show a validation message.
     * Returns `true` when valid and `false` when invalid.
     */
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
        const hasLabelSlot = this.hasSlotController.test('label');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasLabel = this.label ? true : hasLabelSlot || hasLabelIconSlot;
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;
        const hasClearIcon = this.clearable && !this.readonly;
        const isClearIconVisible = hasClearIcon && this.value.length > 0;
        const isSuccessIconVisible = this.success && !this.error && !isClearIconVisible;
        const isWarningIconVisible = this.warning && !this.error && !this.success && !isClearIconVisible;
        const iconSize = this.size === 'small' ? 16 : this.size === 'medium' ? 20 : 24;
        const showErrorText = this.error && this.errorMessage.length > 0;
        const describedBy = showErrorText ? this.errorTextId : hasHelpText ? this.helpTextId : undefined;

        return html`
            <div
                part="form-control"
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--has-label': hasLabel,
                    'form-control--has-help-text': hasHelpText || showErrorText,
                    'form-control--label-hidden': this.labelVisuallyHidden,
                })}
            >
                ${
                    hasLabel
                        ? html`
                              <label
                                  part="form-control-label"
                                  class="form-control__label ${
                                      this.labelVisuallyHidden ? 'visually-hidden' : ''
                                  } ${hasLabelIconSlot ? 'form-control__label--has-icon' : ''}"
                                  for=${this.inputId}
                              >
                                  <slot name="label" @slotchange=${this.handleLabelSlotChange}>${this.label}</slot
                                  ><slot name="label-icon"></slot>
                              </label>
                          `
                        : ''
                }

                <div part="form-control-input" class="form-control-input">
                    <div
                        part="base"
                        class=${classMap({
                            input: true,
                            'input--small': this.size === 'small',
                            'input--medium': this.size === 'medium',
                            'input--large': this.size === 'large',
                            'input--pill': this.pill,
                            'input--standard': !this.filled,
                            'input--filled': this.filled,
                            'input--disabled': this.disabled,
                            'input--empty': !this.value,
                            'input--no-spin-buttons': this.noSpinButtons,
                            'input--error': this.error,
                            'input--success': this.success && !this.error,
                            'input--warning': this.warning && !this.error && !this.success,
                            'input--locked': this.readonly,
                        })}
                    >
                        <span part="prefix" class="input__prefix">
                            <slot name="prefix"></slot>
                        </span>

                        <input
                            part="input"
                            id=${this.inputId}
                            class="input__control"
                            type=${this.type === 'password' && this.passwordVisible ? 'text' : this.type}
                            title=${this.title}
                            name=${ifDefined(this.name)}
                            ?disabled=${this.disabled}
                            ?readonly=${this.readonly}
                            ?required=${this.required}
                            placeholder=${ifDefined(this.placeholder)}
                            minlength=${ifDefined(this.minlength)}
                            maxlength=${ifDefined(this.maxlength)}
                            min=${ifDefined(this.min)}
                            max=${ifDefined(this.max)}
                            step=${ifDefined(this.step)}
                            .value=${live(this.value)}
                            autocapitalize=${ifDefined(this.autocapitalize)}
                            autocomplete=${ifDefined(this.autocomplete)}
                            .autocorrect=${this.autocorrect}
                            ?autofocus=${this.autofocus}
                            spellcheck=${this.spellcheck}
                            pattern=${ifDefined(this.pattern)}
                            enterkeyhint=${ifDefined(this.enterkeyhint)}
                            inputmode=${ifDefined(this.inputmode)}
                            aria-describedby=${ifDefined(describedBy)}
                            aria-invalid=${this.error ? 'true' : 'false'}
                            aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                            aria-label=${ifDefined(!hasLabel ? this.ariaLabel || undefined : undefined)}
                            @change=${this.handleChange}
                            @input=${this.handleInput}
                            @invalid=${this.handleInvalid}
                            @keydown=${this.handleKeyDown}
                            @focus=${this.handleFocus}
                            @blur=${this.handleBlur}
                        />

                        ${
                            isClearIconVisible
                                ? html`
                                      <button
                                          part="clear-button"
                                          class="input__clear"
                                          type="button"
                                          aria-label=${this.localize.term('clearEntry')}
                                          @click=${this.handleClearClick}
                                          tabindex="-1"
                                      >
                                          <slot name="clear-icon">
                                              <ts-icon name="close" library="system" size=${iconSize}></ts-icon>
                                          </slot>
                                      </button>
                                  `
                                : ''
                        }
                        ${
                            this.passwordToggle && !this.disabled && !this.readonly
                                ? html`
                                      <button
                                          part="password-toggle-button"
                                          class="input__password-toggle"
                                          type="button"
                                          aria-label=${this.localize.term(
                                              this.passwordVisible ? 'hidePassword' : 'showPassword',
                                          )}
                                          @click=${this.handlePasswordToggle}
                                          tabindex="-1"
                                      >
                                          ${
                                              this.passwordVisible
                                                  ? html`
                                                        <slot name="show-password-icon">
                                                            <ts-icon name="visibility_off" library="system"></ts-icon>
                                                        </slot>
                                                    `
                                                  : html`
                                                        <slot name="hide-password-icon">
                                                            <ts-icon name="visibility" library="system"></ts-icon>
                                                        </slot>
                                                    `
                                          }
                                      </button>
                                  `
                                : ''
                        }
                        ${
                            isSuccessIconVisible
                                ? html`
                                      <span class="input__clear input__success-icon" aria-hidden="true">
                                          <ts-icon
                                              name="check"
                                              library="system"
                                              size=${iconSize}
                                              style="--icon-color: var(--ts-semantic-color-border-success-default)"
                                          ></ts-icon>
                                      </span>
                                  `
                                : ''
                        }
                        ${
                            isWarningIconVisible
                                ? html`
                                      <span class="input__clear input__warning-icon" aria-hidden="true">
                                          <ts-icon
                                              name="warning"
                                              library="system"
                                              size=${iconSize}
                                              style="--icon-color: var(--ts-semantic-color-border-warning-default)"
                                          ></ts-icon>
                                      </span>
                                  `
                                : ''
                        }
                        ${
                            this.readonly && this.lock && !this.disabled
                                ? html`
                                      <span class="input__clear input__lock-icon" aria-hidden="true">
                                          <ts-icon
                                              name="lock"
                                              library="system"
                                              size=${iconSize}
                                              style="--icon-color: var(--ts-semantic-color-icon-neutral-default)"
                                          ></ts-icon>
                                      </span>
                                  `
                                : ''
                        }

                        <span part="suffix" class="input__suffix">
                            <slot name="suffix"></slot>
                        </span>
                    </div>
                </div>

                <div
                    part="form-control-help-text"
                    class=${classMap({
                        'form-control__help-text': true,
                        'form-control__help-text--error': showErrorText,
                        'visually-hidden': this.helpTextVisuallyHidden && !showErrorText,
                    })}
                    aria-hidden=${showErrorText || hasHelpText ? 'false' : 'true'}
                >
                    ${
                        showErrorText
                            ? html`<span id=${this.errorTextId}>${this.errorMessage}</span>`
                            : html`<span id=${this.helpTextId}><slot name="help-text">${this.helpText}</slot></span>`
                    }
                </div>
            </div>
        `;
    }
}
