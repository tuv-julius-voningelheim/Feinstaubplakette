import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import {
    customErrorValidityState,
    FormControlController,
    validValidityState,
    valueMissingValidityState,
} from '@utils/internal/form.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import { TsButtonGroup } from '@components/button-group/index.js';

import styles from './TsRadioGroupStyles.js';
import type { TsRadio } from '../../radio/index.js';
import type { TsRadioButton } from '../../radio-button/index.js';

/**
 * @summary Radio groups are used to group multiple [radios](/components/radio) or
 * [radio buttons](/components/radio-button) so they function as a single form control.
 * @documentation https://create.tuvsud.com/latest/components/radio-group/develop-OMlhElBt
 * @status stable
 * @since 1.0
 *
 * @dependency ts-button-group
 *
 * @slot - The default slot where `<ts-radio>` or `<ts-radio-button>` elements are placed.
 * @slot label - The radio group's label. Required for proper accessibility. Alternatively, you can use the `label`
 *  attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Use this together with the `label` attribute or `label` slot to show e.g. an info icon without wrapping markup.
 * @slot help-text - Text that describes how to use the radio group.
 * Alternatively, you can use the`help-text` attribute.
 *
 * @event ts-change - Emitted when the radio group's selected value changes.
 * @event ts-input - Emitted when the radio group receives user input.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart button-group - The button group that wraps radio buttons.
 * @csspart button-group__base - The button group's `base` part.
 */
export default class TsRadioGroupComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = { 'ts-button-group': TsButtonGroup };

    protected readonly formControlController = new FormControlController(this);
    private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label', 'label-icon');
    private customValidityMessage = '';
    private validationTimeout!: number;

    private static idCounter = 0;

    private readonly labelId = `ts-radio-group-label-${++TsRadioGroupComponent.idCounter}`;
    private readonly helpTextId = `ts-radio-group-help-text-${TsRadioGroupComponent.idCounter}`;
    private readonly errorTextId = `ts-radio-group-error-text-${TsRadioGroupComponent.idCounter}`;

    @query('slot:not([name])') defaultSlot!: HTMLSlotElement;
    @query('.radio-group__validation-input') validationInput!: HTMLInputElement;

    @state() private hasButtonGroup = false;
    @state() private customErrorMessage = '';
    @state() defaultValue = '';

    /**
     * The direction of the radio group.
     * - vertical: radios are stacked (default)
     * - horizontal: radios are placed in a row
     */
    @property({ reflect: true }) direction: 'vertical' | 'horizontal' = 'vertical';

    /**
     * The radio group's label. Required for proper accessibility. If you need to display HTML, use the `label` slot
     * instead.
     */
    @property() label = '';

    /** The radio groups's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** The name of the radio group, submitted as a name/value pair with form data. */
    @property() name = 'option';

    /** The current value of the radio group, submitted as a name/value pair with form data. */
    @property({ reflect: true }) value = '';

    /** The radio group's size. This size will be applied to all child radios and radio buttons. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`.
     * The form must be in the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Ensures a child radio is checked before allowing the containing form to submit. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** Indicates whether the input is in an error state. **/
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. **/
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /** The radio group's aria-label. If the group has a label (i.e. label prop or slot), this attribute is ignored. */
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
        const isRequiredAndEmpty = this.required && !this.value;
        const hasCustomValidityMessage = this.customValidityMessage !== '';
        const hasError = this.error;

        if (hasError || hasCustomValidityMessage) {
            return customErrorValidityState;
        } else if (isRequiredAndEmpty) {
            return valueMissingValidityState;
        }

        return validValidityState;
    }

    /** Gets the validation message */
    get validationMessage() {
        const isRequiredAndEmpty = this.required && !this.value;
        const hasCustomValidityMessage = this.customValidityMessage !== '';
        const hasError = this.error;

        if (hasError) {
            return this.errorMessage || ' ';
        } else if (hasCustomValidityMessage) {
            return this.customValidityMessage;
        } else if (isRequiredAndEmpty) {
            return this.validationInput.validationMessage;
        }

        return '';
    }

    override connectedCallback() {
        super.connectedCallback();
        this.defaultValue = this.value;
    }

    override firstUpdated() {
        this.syncValidationInputState();
        this.syncChildErrorState();
        this.formControlController.updateValidity();
    }

    private syncValidationInputState() {
        if (!this.validationInput) return;

        this.validationInput.required = this.required;
        this.validationInput.value = this.value || '';

        if (this.error) {
            this.validationInput.setCustomValidity(this.errorMessage || ' ');
        } else {
            this.validationInput.setCustomValidity(this.customValidityMessage);
        }
    }

    private getAllRadios() {
        return [...this.querySelectorAll<TsRadio | TsRadioButton>('ts-radio, ts-radio-button')];
    }

    private syncChildErrorState() {
        const radios = this.getAllRadios();
        radios.forEach(radio => {
            (radio as unknown as { error?: boolean }).error = this.error;
        });
    }

    private handleRadioClick(event: MouseEvent) {
        const target = (event.target as HTMLElement).closest<TsRadio | TsRadioButton>('ts-radio, ts-radio-button')!;
        const radios = this.getAllRadios();
        const oldValue = this.value;

        if (!target || target.disabled) {
            return;
        }

        this.value = target.value;
        radios.forEach(radio => (radio.checked = radio === target));

        if (this.value !== oldValue) {
            this.emit('ts-change');
            this.emit('ts-input');
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            return;
        }

        const radios = this.getAllRadios().filter(radio => !radio.disabled);
        if (radios.length === 0) return;

        const checkedRadio = radios.find(radio => radio.checked) ?? radios[0];
        const isVertical = this.direction === 'vertical';

        const isPrevKey = isVertical ? event.key === 'ArrowUp' : event.key === 'ArrowLeft';
        const isNextKey = isVertical ? event.key === 'ArrowDown' : event.key === 'ArrowRight';

        if (!isPrevKey && !isNextKey) return;

        const incr = isPrevKey ? -1 : 1;
        const oldValue = this.value;
        let index = radios.indexOf(checkedRadio!) + incr;

        if (index < 0) index = radios.length - 1;
        if (index > radios.length - 1) index = 0;

        this.getAllRadios().forEach(radio => {
            radio.checked = false;
            if (!this.hasButtonGroup) {
                radio.setAttribute('tabindex', '-1');
            }
        });

        this.value = radios[index]!.value;
        radios[index]!.checked = true;

        if (!this.hasButtonGroup) {
            radios[index]!.setAttribute('tabindex', '0');
            radios[index]!.focus();
        } else {
            radios[index]!.shadowRoot!.querySelector('button')!.focus();
        }

        if (this.value !== oldValue) {
            this.emit('ts-change');
            this.emit('ts-input');
        }

        event.preventDefault();
    }

    private handleLabelClick() {
        this.focus();
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private async syncRadioElements() {
        const radios = this.getAllRadios();

        await Promise.all(
            radios.map(async radio => {
                await radio.updateComplete;
                radio.checked = radio.value === this.value;
                radio.size = this.size;
            }),
        );

        this.syncChildErrorState();

        this.hasButtonGroup = radios.some(radio => radio.tagName.toLowerCase() === 'ts-radio-button');

        if (radios.length > 0 && !radios.some(radio => radio.checked)) {
            if (this.hasButtonGroup) {
                const buttonRadio = radios[0]!.shadowRoot?.querySelector('button');

                if (buttonRadio) {
                    buttonRadio.setAttribute('tabindex', '0');
                }
            } else {
                radios[0]!.setAttribute('tabindex', '0');
            }
        }

        if (this.hasButtonGroup) {
            const buttonGroup = this.shadowRoot?.querySelector('ts-button-group');

            if (buttonGroup) {
                (buttonGroup as unknown as { disableRole: boolean }).disableRole = true;
            }
        }

        this.syncValidationInputState();
        this.formControlController.updateValidity();
    }

    private syncRadios() {
        if (customElements.get('ts-radio') && customElements.get('ts-radio-button')) {
            this.syncRadioElements();
            return;
        }

        if (customElements.get('ts-radio')) {
            this.syncRadioElements();
        } else {
            customElements.whenDefined('ts-radio').then(() => this.syncRadios());
        }

        if (customElements.get('ts-radio-button')) {
            this.syncRadioElements();
        } else {
            customElements.whenDefined('ts-radio-button').then(() => this.syncRadios());
        }
    }

    private updateCheckedRadio() {
        const radios = this.getAllRadios();
        radios.forEach(radio => (radio.checked = radio.value === this.value));

        this.syncChildErrorState();

        this.syncValidationInputState();
        this.formControlController.setValidity(this.validity.valid);
    }

    @watch('size', { waitUntilFirstUpdate: true })
    handleSizeChange() {
        this.syncRadios();
    }

    @watch('required', { waitUntilFirstUpdate: true })
    handleRequiredChange() {
        this.syncValidationInputState();
        this.formControlController.updateValidity();
    }

    @watch('value')
    handleValueChange() {
        if (this.hasUpdated) {
            this.updateCheckedRadio();
        }
    }

    @watch(['error', 'errorMessage'], { waitUntilFirstUpdate: true })
    async handleErrorChange() {
        await this.updateComplete;
        if (!this.validationInput) return;

        const message = this.error ? this.errorMessage || ' ' : this.customValidityMessage;

        this.customErrorMessage = this.error ? this.errorMessage : this.customValidityMessage;
        this.validationInput.setCustomValidity(message);
        this.formControlController.updateValidity();
        this.syncChildErrorState();
    }

    @watch('labelVisuallyHidden', { waitUntilFirstUpdate: true })
    handleLabelVisuallyHiddenChange() {
        this.requestUpdate();
    }

    /** Checks for validity but does not show a validation message.
     * Returns `true` when valid and `false` when invalid.
     */
    checkValidity() {
        this.syncValidationInputState();

        const isRequiredAndEmpty = this.required && !this.value;
        const hasCustomValidityMessage = this.customValidityMessage !== '';
        const hasError = this.error;

        if (hasError || isRequiredAndEmpty || hasCustomValidityMessage) {
            this.formControlController.emitInvalidEvent();
            return false;
        }

        return true;
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean {
        this.syncValidationInputState();

        const isValid = this.validity.valid;

        if (this.error) {
            this.customErrorMessage = this.errorMessage;
        } else if (this.customValidityMessage) {
            this.customErrorMessage = this.customValidityMessage;
        } else {
            this.customErrorMessage = isValid ? '' : this.validationInput.validationMessage;
        }

        this.formControlController.setValidity(isValid);
        this.validationInput.hidden = true;
        clearTimeout(this.validationTimeout);

        if (!isValid) {
            this.validationInput.hidden = false;
            this.validationInput.reportValidity();
            this.validationTimeout = setTimeout(() => (this.validationInput.hidden = true), 10000) as unknown as number;
        }

        return isValid;
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message = '') {
        this.customValidityMessage = message;

        if (!this.validationInput) return;

        if (this.error) {
            const errorValidityMessage = this.errorMessage || ' ';
            this.customErrorMessage = this.errorMessage;
            this.validationInput.setCustomValidity(errorValidityMessage);
        } else {
            this.customErrorMessage = message;
            this.validationInput.setCustomValidity(message);
        }

        this.formControlController.updateValidity();
    }

    /** Sets focus on the radio-group. */
    public override focus(options?: FocusOptions) {
        const radios = this.getAllRadios();
        const checked = radios.find(radio => radio.checked);
        const firstEnabledRadio = radios.find(radio => !radio.disabled);
        const radioToFocus = checked || firstEnabledRadio;

        if (radioToFocus) {
            radioToFocus.focus(options);
        }
    }

    private getAriaLabelledBy(hasLabel: boolean) {
        return hasLabel ? this.labelId : undefined;
    }

    private getAriaLabel(hasLabel: boolean) {
        return hasLabel ? undefined : this.ariaLabel || undefined;
    }

    private getAriaDescribedBy(hasHelpText: boolean, showErrorText: boolean) {
        const ids: string[] = [];
        if (hasHelpText) ids.push(this.helpTextId);
        if (showErrorText) ids.push(this.errorTextId);
        return ids.length ? ids.join(' ') : undefined;
    }

    override render() {
        const hasLabelSlot = this.hasSlotController.test('label');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasLabel = this.label ? true : hasLabelSlot || hasLabelIconSlot;
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;

        const showErrorText = this.error && this.errorMessage.length > 0;

        const ariaLabelledBy = this.getAriaLabelledBy(hasLabel);
        const ariaLabel = this.getAriaLabel(hasLabel);
        const ariaDescribedBy = this.getAriaDescribedBy(hasHelpText, showErrorText);

        const defaultSlot = html` <slot @slotchange=${this.syncRadios} @click=${this.handleRadioClick}></slot> `;

        return html`
            <fieldset
                part="form-control"
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--radio-group': true,
                    'form-control--has-label': hasLabel,
                    'form-control--has-help-text':
                        (hasHelpText || showErrorText) && !(this.helpTextVisuallyHidden && !showErrorText),
                    'form-control--direction-horizontal': this.direction === 'horizontal',
                    'form-control--direction-vertical': this.direction === 'vertical',
                    'form-control--label-hidden': this.labelVisuallyHidden,
                })}
                role="radiogroup"
                aria-labelledby=${ifDefined(ariaLabelledBy)}
                aria-label=${ifDefined(ariaLabel)}
                aria-describedby=${ifDefined(ariaDescribedBy)}
                aria-invalid=${this.error ? 'true' : 'false'}
                aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                @keydown=${this.handleKeyDown}
            >
                <legend
                    part="form-control-label"
                    id=${this.labelId}
                    class=${classMap({
                        'form-control__label': true,
                        'form-control__label--has-icon': hasLabelIconSlot,
                        'visually-hidden': this.labelVisuallyHidden,
                    })}
                    aria-hidden=${hasLabel ? 'false' : 'true'}
                    @click=${this.handleLabelClick}
                >
                    <slot name="label">${this.label}</slot><slot name="label-icon"></slot>
                </legend>

                <div
                    part="form-control-input"
                    class=${classMap({
                        'form-control-input': true,
                        'radio-group__items': true,
                        'radio-group__items--horizontal': this.direction === 'horizontal',
                        'radio-group__items--horizontal--small': this.size === 'small',
                        'radio-group__items--horizontal--medium': this.size === 'medium',
                        'radio-group__items--horizontal--large': this.size === 'large',
                        'radio-group__items--vertical': this.direction === 'vertical',
                        'radio-group__items--vertical--small': this.size === 'small',
                        'radio-group__items--vertical--medium': this.size === 'medium',
                        'radio-group__items--vertical--large': this.size === 'large',
                    })}
                >
                    <div class="visually-hidden">
                        <label class="radio-group__validation">
                            <input
                                type="text"
                                class="radio-group__validation-input"
                                ?required=${this.required}
                                tabindex="-1"
                                hidden
                                @invalid=${this.handleInvalid}
                            />
                        </label>
                    </div>

                    ${
                        this.hasButtonGroup
                            ? html`
                                  <ts-button-group
                                      part="button-group"
                                      exportparts="base:button-group__base"
                                      role="presentation"
                                  >
                                      <slot @slotchange=${this.syncRadios} @click=${this.handleRadioClick}></slot>
                                  </ts-button-group>
                              `
                            : defaultSlot
                    }
                </div>

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
            </fieldset>
        `;
    }
}
