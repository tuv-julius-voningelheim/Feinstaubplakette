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
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsTextareaStyles.js';

/**
 * @summary Textareas collect data from the user and allow multiple lines of text.
 * @documentation https://create.tuvsud.com/latest/components/textarea/develop-0Md7H9El
 * @status stable
 * @since 1.0
 *
 * @slot label - The textarea's label. Alternatively, you can use the `label` attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Use this together with the `label` attribute or `label` slot to show e.g. an info icon without wrapping markup.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-change - Emitted when an alteration to the control's value is committed by the user.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-input - Emitted when the control receives input.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and  help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart textarea - The internal `<textarea>` control.
 */
export default class TsTextareaComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    private readonly formControlController = new FormControlController(this, {
        assumeInteractionOn: ['ts-blur', 'ts-input'],
    });
    private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label', 'label-icon');
    private resizeObserver!: ResizeObserver;

    private static idCounter = 0;

    private readonly textareaId = `ts-textarea-${++TsTextareaComponent.idCounter}`;
    private readonly helpTextId = `ts-textarea-help-text-${TsTextareaComponent.idCounter}`;
    private readonly errorTextId = `ts-textarea-error-text-${TsTextareaComponent.idCounter}`;

    @query('.textarea__control') input!: HTMLTextAreaElement;
    @query('.textarea__size-adjuster') sizeAdjuster!: HTMLTextAreaElement;

    @state() private hasFocus = false;

    /** An advisory title for the textarea. An empty title prevents browser validation tooltips from appearing on hover. */
    @property() override title = '';

    /** The name of the textarea, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The current value of the textarea, submitted as a name/value pair with form data. */
    @property() value = '';

    /** The textarea's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws a filled textarea. */
    @property({ type: Boolean, reflect: true }) filled = false;

    /** The textarea's label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /** The textarea's help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /**
     * When true, the help text is visually hidden but remains accessible to screen readers.
     */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' })
    helpTextVisuallyHidden = false;

    /** Placeholder text to show as a hint when the input is empty. */
    @property() placeholder = '';

    /** The number of rows to display by default. */
    @property({ type: Number }) rows = 4;

    /** Controls how the textarea can be resized. */
    @property() resize: 'none' | 'vertical' | 'auto' = 'vertical';

    /** Disables the textarea. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Makes the textarea readonly. Applies a locked visual style. When `readonly` is true, `lock` defaults to `true` and a lock icon is shown. Set `lock=false` to suppress the icon. */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /**
     * Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true`
     * and displays a lock icon. Set `lock=false` to suppress the icon while keeping the readonly style.
     * Has no effect when `readonly` is false.
     */
    @property({ type: Boolean, reflect: true }) lock = true;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    @property({ reflect: true }) form = '';

    /** Makes the textarea a required field. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** The minimum length of input that will be considered valid. */
    @property({ type: Number }) minlength!: number;

    /** The maximum length of input that will be considered valid. */
    @property({ type: Number }) maxlength!: number;

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

    /** Enables spell checking on the textarea. */
    @property({
        type: Boolean,
        converter: {
            fromAttribute: value => (!value || value === 'false' ? false : true),
            toAttribute: value => (value ? 'true' : 'false'),
        },
    })
    override spellcheck = true;

    /**
     * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
     * keyboard on supportive devices.
     */
    @property() inputmode!: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

    /** The default value of the form control. Primarily used for resetting the form control. */
    @defaultValue() defaultValue = '';

    /** Indicates whether the input is in an error state. **/
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. **/
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /**
     * The textarea's aria-label. If the textarea has a label (i.e. label prop or slot), this attribute is ignored.
     */
    @property({ attribute: 'aria-label' }) override ariaLabel = '';

    /**
     * The label stays in the DOM and is accessible to screen readers, but becomes visually hidden.
     */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' })
    labelVisuallyHidden = false;

    /** Gets the validity state object */
    get validity() {
        return this.input?.validity ?? { valid: true };
    }

    /** Gets the validation message */
    get validationMessage() {
        return this.input?.validationMessage ?? '';
    }

    override connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight());

        this.updateComplete.then(() => {
            if (!this.input) return;
            this.setTextareaHeight();
            this.resizeObserver.observe(this.input);
        });
    }

    override firstUpdated() {
        this.formControlController.updateValidity();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (this.input) {
            this.resizeObserver?.unobserve(this.input);
        }
    }

    private handleBlur() {
        this.hasFocus = false;
        this.emit('ts-blur');
    }

    private handleChange() {
        if (!this.input) return;
        this.value = this.input.value;
        this.setTextareaHeight();
        this.emit('ts-change');
    }

    private handleFocus() {
        this.hasFocus = true;
        this.emit('ts-focus');
    }

    private handleInput() {
        if (!this.input) return;
        this.value = this.input.value;
        this.setTextareaHeight();
        this.emit('ts-input');
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    private handleLabelSlotChange(event: Event) {
        const slot = event.target as HTMLSlotElement;
        const assignedNodes = slot.assignedElements({ flatten: true });

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
                label.htmlFor = this.textareaId;
            }
        }
    }

    private setTextareaHeight() {
        if (!this.input || !this.sizeAdjuster) return;

        if (this.resize !== 'auto') return;

        // Unobserve before mutating height to prevent a ResizeObserver feedback loop
        this.resizeObserver.unobserve(this.input);
        this.sizeAdjuster.style.height = `${this.input.clientHeight}px`;
        this.input.style.height = 'auto';
        this.input.style.height = `${this.input.scrollHeight}px`;
        this.resizeObserver.observe(this.input);
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        this.formControlController.setValidity(this.disabled);
    }

    @watch('resize', { waitUntilFirstUpdate: true })
    handleResizeChange() {
        if (!this.input) return;
        if (this.resize === 'auto') {
            this.setTextareaHeight();
        } else {
            // Clear any inline height left over from auto-resize mode
            this.input.style.height = '';
        }
    }

    @watch('rows', { waitUntilFirstUpdate: true })
    handleRowsChange() {
        this.setTextareaHeight();
    }

    @watch('value', { waitUntilFirstUpdate: true })
    async handleValueChange() {
        await this.updateComplete;
        this.formControlController.updateValidity();
        this.setTextareaHeight();
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

    /** Sets focus on the textarea. */
    override focus(options?: FocusOptions) {
        this.input?.focus(options);
    }

    /** Removes focus from the textarea. */
    override blur() {
        this.input?.blur();
    }

    /** Selects all the text in the textarea. */
    select() {
        this.input?.select();
    }

    /** Gets or sets the textarea's scroll position. */
    scrollPosition(position?: { top?: number; left?: number }): { top: number; left: number } | undefined {
        if (!this.input) return undefined;

        if (position) {
            if (typeof position.top === 'number') this.input.scrollTop = position.top;
            if (typeof position.left === 'number') this.input.scrollLeft = position.left;
            return undefined;
        }

        return {
            top: this.input.scrollTop,
            left: this.input.scrollTop,
        };
    }

    /** Sets the start and end positions of the text selection (0-based). */
    setSelectionRange(
        selectionStart: number,
        selectionEnd: number,
        selectionDirection: 'forward' | 'backward' | 'none' = 'none',
    ) {
        this.input?.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }

    /** Replaces a range of text with a new string. */
    setRangeText(
        replacement: string,
        start?: number,
        end?: number,
        selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve',
    ) {
        if (!this.input) return;

        const selectionStart = start ?? this.input.selectionStart;
        const selectionEnd = end ?? this.input.selectionEnd;

        this.input.setRangeText(replacement, selectionStart, selectionEnd, selectMode);

        if (this.value !== this.input.value) {
            this.value = this.input.value;
            this.setTextareaHeight();
        }
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        return this.input?.checkValidity() ?? true;
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.input?.reportValidity() ?? true;
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        if (!this.input) return;
        this.input.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    override render() {
        const hasLabelSlot = this.hasSlotController.test('label');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');

        const hasLabel = this.label ? true : hasLabelSlot || hasLabelIconSlot;
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;

        const showErrorText = this.error && this.errorMessage.length > 0;

        const describedByIds: string[] = [];
        if (hasHelpText && !this.helpTextVisuallyHidden) describedByIds.push(this.helpTextId);
        if (showErrorText) describedByIds.push(this.errorTextId);

        const describedBy = describedByIds.length ? describedByIds.join(' ') : undefined;

        const nativeInvalid = this.input ? !this.input.validity.valid : false;
        const isInvalid = this.error || nativeInvalid;
        const iconSize = this.size === 'small' ? 16 : this.size === 'medium' ? 20 : 24;

        return html`
            <div
                part="form-control"
                class=${classMap({
                    'form-control': true,
                    'form-control--small': this.size === 'small',
                    'form-control--medium': this.size === 'medium',
                    'form-control--large': this.size === 'large',
                    'form-control--has-label': hasLabel,
                    'form-control--has-help-text':
                        (hasHelpText || showErrorText) && !(this.helpTextVisuallyHidden && !showErrorText),
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
                                  for=${this.textareaId}
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
                            textarea: true,
                            'textarea--small': this.size === 'small',
                            'textarea--medium': this.size === 'medium',
                            'textarea--large': this.size === 'large',
                            'textarea--standard': !this.filled,
                            'textarea--filled': this.filled,
                            'textarea--disabled': this.disabled,
                            'textarea--focused': this.hasFocus,
                            'textarea--empty': !this.value,
                            'textarea--resize-none': this.resize === 'none',
                            'textarea--resize-vertical': this.resize === 'vertical',
                            'textarea--resize-auto': this.resize === 'auto',
                            'textarea--error': this.error,
                            'textarea--locked': this.readonly,
                        })}
                    >
                        <textarea
                            part="textarea"
                            id=${this.textareaId}
                            class="textarea__control"
                            title=${this.title}
                            name=${ifDefined(this.name)}
                            .value=${live(this.value)}
                            ?disabled=${this.disabled}
                            ?readonly=${this.readonly}
                            ?required=${this.required}
                            placeholder=${ifDefined(this.placeholder)}
                            rows=${ifDefined(this.rows)}
                            minlength=${ifDefined(this.minlength)}
                            maxlength=${ifDefined(this.maxlength)}
                            autocapitalize=${ifDefined(this.autocapitalize)}
                            .autocorrect=${this.autocorrect}
                            ?autofocus=${this.autofocus}
                            spellcheck=${ifDefined(this.spellcheck)}
                            enterkeyhint=${ifDefined(this.enterkeyhint)}
                            inputmode=${ifDefined(this.inputmode)}
                            aria-describedby=${ifDefined(describedBy)}
                            aria-invalid=${isInvalid ? 'true' : 'false'}
                            aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                            aria-label=${ifDefined(!hasLabel ? this.ariaLabel || undefined : undefined)}
                            @change=${this.handleChange}
                            @input=${this.handleInput}
                            @invalid=${this.handleInvalid}
                            @focus=${this.handleFocus}
                            @blur=${this.handleBlur}
                        ></textarea>

                        ${
                            this.readonly && this.lock && !this.disabled
                                ? html`
                                      <span class="textarea__lock-icon" aria-hidden="true">
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

                        <div
                            part="textarea-adjuster"
                            class="textarea__size-adjuster"
                            ?hidden=${this.resize !== 'auto'}
                        ></div>
                    </div>
                </div>

                <div
                    part="form-control-help-text"
                    class=${classMap({
                        'form-control__help-text': true,
                        'form-control__help-text--error': showErrorText,
                    })}
                    aria-hidden=${showErrorText || hasHelpText ? 'false' : 'true'}
                >
                    ${
                        showErrorText
                            ? html`
                                  <span id=${this.errorTextId} role="alert" aria-live="polite"
                                      >${this.errorMessage}</span
                                  >
                              `
                            : html`
                                  <span
                                      id=${this.helpTextId}
                                      class=${this.helpTextVisuallyHidden ? 'visually-hidden' : ''}
                                  >
                                      <slot name="help-text">${this.helpText}</slot>
                                  </span>
                              `
                    }
                </div>
            </div>
        `;
    }
}
