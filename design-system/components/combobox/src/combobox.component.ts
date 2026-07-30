import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

import type { CSSResultGroup } from 'lit';

import { animateTo, stopAnimations } from '@utils/internal/animate.js';
import { getAnimation, setDefaultAnimation } from '@utils/internal/animation-registry.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { FormControlController } from '@utils/internal/form.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { scrollIntoView } from '@utils/internal/scroll.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';
import formControlStyles from '@utils/styles/form-control-styles.js';
import type { ComponentFormControl } from '@utils/internal/component-element.js';

import { TsIcon } from '@components/icon/index.js';
import { TsOption } from '@components/option/index.js';
import { TsPopup } from '@components/popup/index.js';
import { TsSpinner } from '@components/spinner/index.js';

import styles from './TsComboboxStyles.js';

/**
 * @summary A combobox combines a text input with a filterable dropdown list, letting users type to
 *   narrow options or pick directly from the list.
 * @documentation https://create.tuvsud.com/latest/components/combobox
 * @status stable
 * @since 1.28.0
 *
 * @dependency ts-icon
 * @dependency ts-popup
 * @dependency ts-spinner
 *
 * @slot - The listbox options. Must be `<ts-option>` elements. You can use `<ts-divider>` to group items visually.
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot label-icon - An icon (or any element) placed inline after the label text.
 * @slot prefix - Used to prepend a presentational icon or similar element to the combobox.
 * @slot suffix - Used to append a presentational icon or similar element to the combobox.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot expand-icon - The icon to show when the control is expanded and collapsed. Rotates on open and close.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 * @slot no-options - Content to show when no options match the current filter query (not shown while `loading` is true).
 *
 * @event ts-change - Emitted when the control's selected value changes.
 * @event ts-input - Emitted when the user types in the input field.
 * @event ts-combobox-filter - Emitted when the filter query changes, with detail `{ value: string }`.
 * @event ts-combobox-select - Emitted when an option is chosen, with detail `{ value: string; label: string }`.
 * @event ts-clear - Emitted when the control's value is cleared.
 * @event ts-focus - Emitted when the control gains focus.
 * @event ts-blur - Emitted when the control loses focus.
 * @event ts-show - Emitted when the combobox menu opens.
 * @event ts-after-show - Emitted after the combobox menu opens and all animations are complete.
 * @event ts-hide - Emitted when the combobox menu closes.
 * @event ts-after-hide - Emitted after the combobox menu closes and all animations are complete.
 * @event ts-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The combobox wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart combobox - The container that wraps the prefix, input, suffix, clear icon, and expand button.
 * @csspart prefix - The container that wraps the prefix slot.
 * @csspart suffix - The container that wraps the suffix slot.
 * @csspart display-input - The text input element where the user types, an `<input>` element.
 * @csspart listbox - The listbox container where options are slotted.
 * @csspart clear-button - The clear button.
 * @csspart expand-icon - The container that wraps the expand icon.
 * @csspart no-options - The empty-state container shown when no options match.
 */
export default class TsComboboxComponent extends ComponentElement implements ComponentFormControl {
    static override styles: CSSResultGroup = [componentStyles, formControlStyles, styles];
    static override dependencies = {
        'ts-icon': TsIcon,
        'ts-popup': TsPopup,
        'ts-spinner': TsSpinner,
    };

    private readonly formControlController = new FormControlController(this, {
        assumeInteractionOn: ['ts-blur', 'ts-input'],
    });
    private readonly hasSlotController = new HasSlotController(this, 'help-text', 'label', 'label-icon');
    private readonly localize = new LocalizeController(this);
    private closeWatcher: CloseWatcher | null = null;

    @query('.combobox') popup!: TsPopup;
    @query('.combobox__trigger') trigger!: HTMLDivElement;
    @query('.combobox__input') displayInput!: HTMLInputElement;
    @query('.combobox__value-input') valueInput!: HTMLInputElement;
    @query('.combobox__listbox') listbox!: HTMLDivElement;

    @state() private hasFocus = false;
    /** The text currently shown in the editable input (either the filter query or the selected label). */
    @state() inputValue = '';
    @state() displayLabel = '';
    @state() currentOption: TsOption | null = null;
    @state() selectedOptions: TsOption[] = [];
    @state() private valueHasChanged = false;
    @state() hasVisibleOptions = true;
    @state() private activeDescendant = '';
    /** Set when the dropdown opens as a result of the user typing, so the query isn't cleared. */
    private _openedByTyping = false;

    private _value = '';
    private static idCounter = 0;
    private readonly comboboxId = `ts-combobox-${++TsComboboxComponent.idCounter}`;
    private readonly helpTextId = `ts-combobox-help-text-${TsComboboxComponent.idCounter}`;
    private readonly errorTextId = `ts-combobox-error-text-${TsComboboxComponent.idCounter}`;
    private readonly listboxId = `ts-combobox-listbox-${TsComboboxComponent.idCounter}`;

    get value() {
        return this._value;
    }

    /**
     * The current value of the combobox, submitted as a name/value pair with form data.
     * Set programmatically to pre-select an option that matches a `<ts-option>` value.
     */
    @state()
    set value(val: string) {
        if (typeof val !== 'string') val = String(val);
        if (this._value === val) return;
        this.valueHasChanged = true;
        this._value = val;
    }

    /** The name of the combobox, submitted as a name/value pair with form data. */
    @property() name = '';

    /** The default value of the form control. Primarily used for resetting the form control. */
    @property({ attribute: 'value' }) defaultValue = '';

    /** The combobox size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Placeholder text to show as a hint when the combobox is empty. */
    @property() placeholder = '';

    /** Disables the combobox control. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /**
     * Makes the combobox readonly. Applies a locked visual style. The dropdown can still be opened
     * and browsed, but no value can be selected. When `readonly` is true, `lock` defaults to `true`
     * and a lock icon is shown. Set `lock=false` to suppress the icon.
     */
    @property({ type: Boolean, reflect: true }) readonly = false;

    /**
     * Only effective when `readonly` is true. When `readonly` is true, `lock` defaults to `true`
     * and displays a lock icon. Set `lock=false` to suppress the icon while keeping the readonly style.
     * Has no effect when `readonly` is false.
     */
    @property({ type: Boolean, reflect: true }) lock = true;

    /** Adds a clear button when the combobox is not empty. */
    @property({ type: Boolean }) clearable = false;

    /**
     * Indicates whether or not the combobox is open. You can toggle this attribute to show and hide the menu,
     * or use the `show()` and `hide()` methods and this attribute will reflect the open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * Enable this option to prevent the listbox from being clipped when the component is placed inside a container
     * with `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy.
     */
    @property({ type: Boolean }) hoist = false;

    /** Draws a filled combobox. */
    @property({ type: Boolean, reflect: true }) filled = false;

    /** Draws a pill-style combobox with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false;

    /** The combobox label. If you need to display HTML, use the `label` slot instead. */
    @property() label = '';

    /**
     * The preferred placement of the combobox menu. Note that the actual placement may vary as needed
     * to keep the listbox inside of the viewport.
     */
    @property({ reflect: true }) placement: 'top' | 'bottom' = 'bottom';

    /** The combobox help text. If you need to display HTML, use the `help-text` slot instead. */
    @property({ attribute: 'help-text' }) helpText = '';

    /** When true, the help text is visually hidden but remains accessible to screen readers. */
    @property({ type: Boolean, reflect: true, attribute: 'help-text-visually-hidden' })
    helpTextVisuallyHidden = false;

    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`.
     */
    @property({ reflect: true }) form = '';

    /** The combobox required attribute. */
    @property({ type: Boolean, reflect: true }) required = false;

    /** Indicates whether the input is in an error state. */
    @property({ type: Boolean }) error = false;

    /** The error message to display when the input is in an error state. */
    @property({ type: String, reflect: true, attribute: 'error-message' }) errorMessage = '';

    /**
     * The combobox aria-label. If the combobox has a label (i.e. label prop or slot), this attribute is ignored.
     */
    @property({ attribute: 'aria-label' }) override ariaLabel = '';

    /** The label stays in the DOM and is accessible to screen readers, but becomes visually hidden. */
    @property({ type: Boolean, reflect: true, attribute: 'label-visually-hidden' })
    labelVisuallyHidden = false;

    /** Text to display in the listbox when no options match the current filter query. Uses the locale string `noOptionsFound` by default. */
    @property({ attribute: 'no-options-text' }) noOptionsText = '';

    /** Puts the combobox into a loading state. Shows a spinner in the input suffix and a loading indicator in the listbox when no options are present. */
    @property({ type: Boolean, reflect: true }) loading = false;

    /** The text displayed next to the spinner inside the listbox while `loading` is true. Defaults to the locale "Loading" string. */
    @property({ attribute: 'loading-text' }) loadingText = '';

    /** Gets the validity state object. */
    get validity() {
        return this.valueInput.validity;
    }

    /** Gets the validation message. */
    get validationMessage() {
        return this.valueInput.validationMessage;
    }

    override connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.handleDefaultSlotChange();
        });
    }

    protected override firstUpdated() {
        if (this.open && !this.disabled) {
            this.handleOpenChange();
        }
    }

    private addOpenListeners() {
        document.addEventListener('focusin', this.handleDocumentFocusIn);
        document.addEventListener('keydown', this.handleDocumentKeyDown);
        document.addEventListener('mousedown', this.handleDocumentMouseDown);

        if (this.getRootNode() !== document) {
            this.getRootNode().addEventListener('focusin', this.handleDocumentFocusIn);
        }

        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy();
            this.closeWatcher = new CloseWatcher();
            this.closeWatcher.onclose = () => {
                if (this.open) {
                    this.hide();
                    this.displayInput.focus({ preventScroll: true });
                }
            };
        }
    }

    private removeOpenListeners() {
        document.removeEventListener('focusin', this.handleDocumentFocusIn);
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        document.removeEventListener('mousedown', this.handleDocumentMouseDown);

        if (this.getRootNode() !== document) {
            this.getRootNode().removeEventListener('focusin', this.handleDocumentFocusIn);
        }

        this.closeWatcher?.destroy();
    }

    private handleFocus() {
        this.hasFocus = true;
        this.emit('ts-focus');
    }

    private handleBlur(event: FocusEvent) {
        const relatedTarget = event.relatedTarget as Node | null;
        if (relatedTarget && this.contains(relatedTarget)) {
            return;
        }
        this.hasFocus = false;
        this.commitOrResetOnBlur();
        if (this.open) this.hide();
        this.emit('ts-blur');
    }

    private commitOrResetOnBlur() {
        const typed = this.inputValue.trim();

        // Case 1: user cleared the input → clear the selection.
        if (typed === '') {
            const hadValue = this.value !== '';
            this.setSelectedOptions([]);
            this.valueHasChanged = true;
            this.inputValue = '';
            if (hadValue) {
                this.updateComplete.then(() => this.emit('ts-change'));
            }
            return;
        }

        const allOptions = this.getAllOptions();
        const exactMatch = allOptions.find(
            o => !o.disabled && o.getTextLabel().trim().toLowerCase() === typed.toLowerCase(),
        );

        if (exactMatch) {
            // Case 2: exact label match — commit (also normalises casing to the canonical label).
            const changed = exactMatch !== this.selectedOptions[0];
            this.setSelectedOptions(exactMatch);
            this.valueHasChanged = true;
            this.inputValue = exactMatch.getTextLabel();
            if (changed) {
                this.updateComplete.then(() => {
                    this.emit('ts-input');
                    this.emit('ts-change');
                });
            }
        } else {
            this.inputValue = this.displayLabel;
        }
    }

    private handleDocumentFocusIn = (event: Event) => {
        const path = event.composedPath();
        if (path.includes(this)) {
            return;
        }
        if (this.open) {
            this.hide();
        }
    };

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        const isClearButton = target.closest('.combobox__clear') !== null;
        if (isClearButton) return;

        if (event.key === 'Escape' && this.open && !this.closeWatcher) {
            event.preventDefault();
            event.stopPropagation();
            this.hide();
            this.displayInput.focus({ preventScroll: true });
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (!this.open) {
                this.show();
                return;
            }

            if (this.currentOption && !this.currentOption.disabled && !this.readonly) {
                this.selectOption(this.currentOption);
            }
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();

            const visibleOptions = this.getVisibleOptions();
            if (visibleOptions.length === 0) return;

            if (!this.open) {
                this.show();
            }

            const currentIndex = this.currentOption ? visibleOptions.indexOf(this.currentOption) : -1;
            let newIndex = currentIndex;

            if (event.key === 'ArrowDown') {
                newIndex = currentIndex < visibleOptions.length - 1 ? currentIndex + 1 : 0;
            } else if (event.key === 'ArrowUp') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : visibleOptions.length - 1;
            } else if (event.key === 'Home') {
                newIndex = 0;
            } else if (event.key === 'End') {
                newIndex = visibleOptions.length - 1;
            }

            this.setCurrentOption(visibleOptions[newIndex] ?? null);
        }
    };

    private handleDocumentMouseDown = (event: MouseEvent) => {
        const path = event.composedPath();
        if (this && !path.includes(this)) {
            this.hide();
        }
    };

    private handleLabelClick() {
        this.displayInput.focus();
    }

    private handleLabelSlotChange(event: Event) {
        const slot = event.target as HTMLSlotElement;
        const assignedNodes = slot.assignedElements({ flatten: true });

        const findLabels = (elements: Element[]): HTMLLabelElement[] => {
            const labels: HTMLLabelElement[] = [];
            for (const el of elements) {
                if (el.tagName === 'LABEL') labels.push(el as HTMLLabelElement);
                labels.push(...findLabels(Array.from(el.children)));
            }
            return labels;
        };

        const slottedLabels = findLabels(assignedNodes);
        for (const label of slottedLabels) {
            if (!label.htmlFor) label.htmlFor = this.comboboxId;
        }
    }

    private handleTriggerMouseDown(event: MouseEvent) {
        if (this.disabled) return;

        const path = event.composedPath();

        // The clear button manages its own mousedown/click and stops propagation.
        if (path.some(el => el instanceof Element && el.classList?.contains('combobox__clear'))) {
            return;
        }

        const isInput = path.some(el => el === this.displayInput);
        const isExpandIcon = path.some(el => el instanceof Element && el.classList?.contains('combobox__expand-icon'));

        if (isExpandIcon) {
            // The expand icon toggles the dropdown. preventDefault keeps focus on the input.
            event.preventDefault();
            this.displayInput.focus({ preventScroll: true });
            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
            return;
        }

        if (isInput) {
            // Let the browser focus the input and place the caret naturally, then open the dropdown.
            if (!this.open) this.show();
            return;
        }

        event.preventDefault();
        this.displayInput.focus({ preventScroll: true });
        if (!this.open) this.show();
    }

    /** Keeps focus on the input when interacting with the listbox so the user can keep typing. */
    private handleListboxMouseDown(event: MouseEvent) {
        event.preventDefault();
    }

    private handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this.inputValue = input.value;

        if (!this.open) {
            this._openedByTyping = true;
            this.open = true;
        }
        const allOptions = this.getAllOptions();
        if (this.inputValue === '') {
            allOptions.forEach(el => (el.selected = false));
        } else {
            allOptions.forEach(el => (el.selected = this.selectedOptions.includes(el)));
        }

        this.filterOptions(this.inputValue);

        this.emit('ts-input');
        this.emit('ts-combobox-filter', { detail: { value: this.inputValue } });
    }

    private handleClearClick(event: MouseEvent) {
        event.stopPropagation();
        this.valueHasChanged = true;
        this.inputValue = '';
        this.displayLabel = '';
        this.setSelectedOptions([]);
        this.filterOptions('');
        this.displayInput.focus({ preventScroll: true });

        this.updateComplete.then(() => {
            this.emit('ts-clear');
            this.emit('ts-input');
            this.emit('ts-change');
        });
    }

    private handleClearMouseDown(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    private handleOptionClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const option = target.closest('ts-option') as TsOption | null;

        if (option && !option.disabled && !this.readonly) {
            this.selectOption(option);
        }
    }

    private selectOption(option: TsOption) {
        const oldValue = this.value;
        this.valueHasChanged = true;
        this.setSelectedOptions(option);

        this.updateComplete.then(() => {
            this.displayInput.focus({ preventScroll: true });
            if (this.value !== oldValue) {
                this.emit('ts-input');
                this.emit('ts-change');
            }
            this.emit('ts-combobox-select', { detail: { value: option.value, label: option.getTextLabel() } });
        });

        this.hide();
    }

    /** @internal - Handles slot changes in the listbox. */
    public handleDefaultSlotChange() {
        if (!customElements.get('ts-option')) {
            customElements.whenDefined('ts-option').then(() => this.handleDefaultSlotChange());
            return;
        }

        const allOptions = this.getAllOptions();
        const val = this.valueHasChanged ? this.value : this.defaultValue;

        this.setSelectedOptions(allOptions.filter(el => el.value === val));
    }

    private filterOptions(query: string) {
        const allOptions = this.getAllOptions();
        const trimmed = query.trim().toLowerCase();
        let visibleCount = 0;

        for (const option of allOptions) {
            const label = option.getTextLabel().toLowerCase();
            const matches = trimmed === '' || label.includes(trimmed);
            option.hidden = !matches;
            if (matches) visibleCount++;
        }

        this.hasVisibleOptions = visibleCount > 0;

        const visible = this.getVisibleOptions();
        this.setCurrentOption(visible[0] ?? null);
    }

    /** Returns all `<ts-option>` elements that are not hidden. */
    private getVisibleOptions() {
        return this.getAllOptions().filter(option => !option.hidden && !option.disabled);
    }

    private getAllOptions() {
        return [...this.querySelectorAll<TsOption>('ts-option')];
    }

    private setCurrentOption(option: TsOption | null) {
        const allOptions = this.getAllOptions();

        allOptions.forEach(el => {
            el.current = false;
            el.tabIndex = -1;
        });

        if (option) {
            this.currentOption = option;
            option.current = true;

            if (!option.id) option.id = `${this.comboboxId}-option-${++TsComboboxComponent.idCounter}`;
            this.activeDescendant = option.id;

            if (this.open && this.listbox && !this.listbox.hidden) {
                scrollIntoView(option, this.listbox, 'vertical', 'auto');
            }
        } else {
            this.currentOption = null;
            this.activeDescendant = '';
        }
    }

    private setSelectedOptions(option: TsOption | TsOption[]) {
        const allOptions = this.getAllOptions();
        const newSelectedOptions = Array.isArray(option) ? option : [option];

        allOptions.forEach(el => (el.selected = false));
        newSelectedOptions.forEach(el => (el.selected = true));

        this.selectionChanged();
    }

    private selectionChanged() {
        const options = this.getAllOptions();
        this.selectedOptions = options.filter(el => el.selected);

        const cachedValueHasChanged = this.valueHasChanged;
        const selectedOption = this.selectedOptions[0];
        this.value = selectedOption?.value ?? '';
        this.displayLabel = selectedOption?.getTextLabel?.() ?? '';

        if (!this.open) {
            this.inputValue = this.displayLabel;
        }
        this.valueHasChanged = cachedValueHasChanged;

        this.updateComplete.then(() => {
            this.formControlController.updateValidity();
        });
    }

    private handleInvalid(event: Event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
    }

    @watch('disabled', { waitUntilFirstUpdate: true })
    handleDisabledChange() {
        if (this.disabled) {
            this.open = false;
            this.handleOpenChange();
        }
    }

    override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
        super.attributeChangedCallback(name, oldVal, newVal);

        if (name === 'value') {
            const cachedValueHasChanged = this.valueHasChanged;
            this.value = this.defaultValue;
            this.valueHasChanged = cachedValueHasChanged;
        }
    }

    @watch(['defaultValue', 'value'], { waitUntilFirstUpdate: true })
    handleValueChange() {
        if (!this.valueHasChanged) {
            const cachedValueHasChanged = this.valueHasChanged;
            this.value = this.defaultValue;
            this.valueHasChanged = cachedValueHasChanged;
        }

        const allOptions = this.getAllOptions();
        this.setSelectedOptions(allOptions.filter(el => el.value === this.value));
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open && !this.disabled) {
            if (this._openedByTyping) {
                this._openedByTyping = false;
                this.filterOptions(this.inputValue);
            } else {
                this.inputValue = this.displayLabel;
                this.filterOptions('');
            }

            const visible = this.getVisibleOptions();
            this.setCurrentOption(
                this.selectedOptions[0] && !this.selectedOptions[0].hidden
                    ? this.selectedOptions[0]
                    : (visible[0] ?? null),
            );

            this.emit('ts-show', { bubbles: false });
            this.addOpenListeners();

            await stopAnimations(this);
            this.listbox.hidden = false;
            this.popup.active = true;

            requestAnimationFrame(() => {
                this.setCurrentOption(this.currentOption);
                // Place the caret at the end of the input so the user can edit from there.
                const len = this.displayInput.value.length;
                this.displayInput.setSelectionRange(len, len);
            });

            const { keyframes, options } = getAnimation(this, 'combobox.show', { dir: this.localize.dir() });
            await animateTo(this.popup.popup, keyframes, options);

            if (this.currentOption) {
                scrollIntoView(this.currentOption, this.listbox, 'vertical', 'auto');
            }

            this.emit('ts-after-show', { bubbles: false });
        } else {
            if (this.inputValue !== '') {
                this.inputValue = this.displayLabel;
            }
            this.filterOptions('');

            this.emit('ts-hide', { bubbles: false });
            this.removeOpenListeners();

            await stopAnimations(this);
            const { keyframes, options } = getAnimation(this, 'combobox.hide', { dir: this.localize.dir() });
            await animateTo(this.popup.popup, keyframes, options);
            this.listbox.hidden = true;
            this.popup.active = false;

            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    /** Shows the listbox. */
    async show() {
        if (this.open || this.disabled) {
            return undefined;
        }
        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    /** Hides the listbox. */
    async hide() {
        if (!this.open) {
            return undefined;
        }
        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity() {
        return this.valueInput.checkValidity();
    }

    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null {
        return this.formControlController.getForm();
    }

    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity() {
        return this.valueInput.reportValidity();
    }

    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string) {
        this.valueInput.setCustomValidity(message);
        this.formControlController.updateValidity();
    }

    /** Sets focus on the control. */
    override focus(options?: FocusOptions) {
        this.displayInput.focus(options);
    }

    /** Removes focus from the control. */
    override blur() {
        this.displayInput.blur();
    }

    override render() {
        const hasLabelSlot = this.hasSlotController.test('label');
        const hasLabelIconSlot = this.hasSlotController.test('label-icon');
        const hasHelpTextSlot = this.hasSlotController.test('help-text');
        const hasLabel = this.label ? true : hasLabelSlot || hasLabelIconSlot;
        const hasHelpText = this.helpText ? true : hasHelpTextSlot;
        const hasClearIcon = this.clearable && !this.disabled && !this.readonly && this.value.length > 0;
        const showErrorText = this.error && this.errorMessage.length > 0;

        const describedByIds: string[] = [];
        if (!showErrorText && hasHelpText && !this.helpTextVisuallyHidden) describedByIds.push(this.helpTextId);
        if (showErrorText) describedByIds.push(this.errorTextId);
        const describedBy = describedByIds.length ? describedByIds.join(' ') : undefined;

        const isInvalid = this.error;

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
                <label
                    id="label"
                    part="form-control-label"
                    class="form-control__label ${this.labelVisuallyHidden ? 'visually-hidden' : ''} ${
                        hasLabelIconSlot ? 'form-control__label--has-icon' : ''
                    }"
                    aria-hidden=${hasLabel ? 'false' : 'true'}
                    @click=${this.handleLabelClick}
                >
                    <slot name="label" @slotchange=${this.handleLabelSlotChange}>${this.label}</slot
                    ><slot name="label-icon"></slot>
                </label>

                <div part="form-control-input" class="form-control-input">
                    <ts-popup
                        class=${classMap({
                            combobox: true,
                            'combobox--standard': !this.filled,
                            'combobox--filled': this.filled,
                            'combobox--pill': this.pill,
                            'combobox--open': this.open,
                            'combobox--disabled': this.disabled,
                            'combobox--focused': this.hasFocus,
                            'combobox--top': this.placement === 'top',
                            'combobox--bottom': this.placement === 'bottom',
                            'combobox--small': this.size === 'small',
                            'combobox--medium': this.size === 'medium',
                            'combobox--large': this.size === 'large',
                            'combobox--error': this.error,
                            'combobox--locked': this.readonly,
                        })}
                        placement=${this.placement}
                        strategy=${this.hoist ? 'fixed' : 'absolute'}
                        flip
                        shift
                        sync="width"
                        auto-size="vertical"
                        auto-size-padding="10"
                    >
                        <div
                            part="combobox"
                            class="combobox__trigger"
                            slot="anchor"
                            @mousedown=${this.handleTriggerMouseDown}
                        >
                            <slot part="prefix" name="prefix" class="combobox__prefix"></slot>

                            <input
                                id=${this.comboboxId}
                                part="display-input"
                                class="combobox__input"
                                type="text"
                                placeholder=${this.placeholder}
                                ?disabled=${this.disabled}
                                ?readonly=${this.readonly}
                                .value=${live(this.inputValue)}
                                autocomplete="off"
                                spellcheck="false"
                                autocapitalize="off"
                                aria-expanded=${this.open ? 'true' : 'false'}
                                aria-haspopup="listbox"
                                aria-labelledby="label"
                                aria-disabled=${this.disabled ? 'true' : 'false'}
                                aria-describedby=${ifDefined(describedBy)}
                                aria-invalid=${isInvalid ? 'true' : 'false'}
                                aria-errormessage=${ifDefined(showErrorText ? this.errorTextId : undefined)}
                                aria-label=${ifDefined(!hasLabel ? this.ariaLabel || undefined : undefined)}
                                aria-autocomplete="list"
                                aria-controls=${this.listboxId}
                                aria-activedescendant=${ifDefined(this.activeDescendant || undefined)}
                                role="combobox"
                                tabindex="0"
                                @focus=${this.handleFocus}
                                @blur=${this.handleBlur}
                                @input=${this.handleInputChange}
                                @keydown=${(e: KeyboardEvent) => {
                                    // Let document-level handler manage navigation, but stop propagation here
                                    // so the combobox trigger mousedown doesn't interfere
                                    e.stopPropagation();
                                    this.handleDocumentKeyDown(e);
                                }}
                            />

                            <input
                                class="combobox__value-input"
                                type="text"
                                ?disabled=${this.disabled}
                                ?required=${this.required}
                                .value=${this.value}
                                tabindex="-1"
                                aria-hidden="true"
                                @focus=${() => this.focus()}
                                @invalid=${this.handleInvalid}
                            />

                            ${
                                hasClearIcon
                                    ? html`
                                          <button
                                              part="clear-button"
                                              class="combobox__clear"
                                              type="button"
                                              aria-label=${this.localize.term('clearEntry')}
                                              @mousedown=${this.handleClearMouseDown}
                                              @click=${this.handleClearClick}
                                              tabindex="-1"
                                          >
                                              <slot name="clear-icon">
                                                  <ts-icon name="cancel" library="system"></ts-icon>
                                              </slot>
                                          </button>
                                      `
                                    : ''
                            }

                            <slot name="suffix" part="suffix" class="combobox__suffix"></slot>

                            ${
                                this.loading
                                    ? html`<ts-spinner
                                          class="combobox__loading-spinner"
                                          aria-label=${this.loadingText || this.localize.term('loading')}
                                      ></ts-spinner>`
                                    : ''
                            }
                            ${
                                this.readonly && this.lock && !this.disabled
                                    ? html`
                                          <span class="combobox__clear combobox__lock-icon" aria-hidden="true">
                                              <ts-icon
                                                  name="lock"
                                                  library="system"
                                                  size="20"
                                                  style="--icon-color: var(--ts-semantic-color-icon-neutral-default)"
                                              ></ts-icon>
                                          </span>
                                      `
                                    : ''
                            }

                            <slot name="expand-icon" part="expand-icon" class="combobox__expand-icon">
                                <ts-icon library="system" size="20" name="keyboard_arrow_down"></ts-icon>
                            </slot>
                        </div>

                        <div
                            id=${this.listboxId}
                            role="listbox"
                            aria-labelledby="label"
                            part="listbox"
                            class="combobox__listbox"
                            tabindex="-1"
                            @mousedown=${this.handleListboxMouseDown}
                            @mouseup=${this.handleOptionClick}
                            @slotchange=${this.handleDefaultSlotChange}
                        >
                            <slot style=${this.loading ? 'display:none' : ''}></slot>
                            ${
                                this.loading
                                    ? html`
                                          <div
                                              part="no-options"
                                              class="combobox__no-options"
                                              role="status"
                                              aria-live="polite"
                                          >
                                              <div class="combobox__loading-options">
                                                  <ts-spinner></ts-spinner>
                                                  ${this.loadingText || this.localize.term('loading')}
                                              </div>
                                          </div>
                                      `
                                    : !this.hasVisibleOptions
                                      ? html`
                                            <div
                                                part="no-options"
                                                class="combobox__no-options"
                                                role="option"
                                                aria-disabled="true"
                                                aria-live="polite"
                                            >
                                                <slot name="no-options"
                                                    >${this.noOptionsText || this.localize.term('noOptionsFound')}</slot
                                                >
                                            </div>
                                        `
                                      : ''
                            }
                        </div>
                    </ts-popup>
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

setDefaultAnimation('combobox.show', {
    keyframes: [
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 100, easing: 'ease' },
});

setDefaultAnimation('combobox.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 },
    ],
    options: { duration: 100, easing: 'ease' },
});
