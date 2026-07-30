import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { getFallbackLabels } from '@utils/date/calendar-i18n.js';
import {
    formatDateByLocale,
    getDatePattern,
    getDatePlaceholder,
    getDateSeparator,
    maskDateInput,
    parseByLocale,
} from '@utils/date/date-format.js';

import DateFieldRangeComponent from '@components/date-range/src/date-field-range.component.js';
import { TsInput } from '@components/input/index.js';

/**
 * @summary Internal masked date input for the **end** date in a range picker. Enforces
 * locale-aware formatting, character restrictions, and auto-validation on blur.
 * Used internally by `ts-date-dropdown-range` and `ts-date-dialog-range`.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-input
 *
 * @slot suffix - Slot for trailing content such as a calendar icon button.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Forwarded to the internal `ts-input`.
 *
 * @event input - Re-dispatched after masking the raw value. Detail: `{ value }`.
 * @event change - Re-dispatched after masking the raw value. Detail: `{ value }`.
 *
 * @csspart base - The component's base wrapper (inherited from DateFieldRangeComponent).
 */
export default class TsDateInputEnd extends DateFieldRangeComponent {
    static override dependencies = { 'ts-input': TsInput };

    @property({ type: String }) override valueEnd = '';

    private _cachedLocale = '';
    private _cachedSepRegex: RegExp = /^[0-9/]$/;
    private _cachedPlaceholder = '';
    private _cachedPattern = '';

    private ensureLocaleCache() {
        if (this._cachedLocale === this.locale) return;
        this._cachedLocale = this.locale;
        const sep = getDateSeparator(this.locale);
        this._cachedSepRegex = new RegExp(`^[0-9\\${sep}]$`);
        this._cachedPlaceholder = getDatePlaceholder(this.locale);
        this._cachedPattern = getDatePattern(this.locale);
    }

    private onBeforeInput(e: InputEvent) {
        if (e.inputType !== 'insertText') return;

        this.ensureLocaleCache();
        const ch = e.data ?? '';

        if (!this._cachedSepRegex.test(ch)) {
            e.preventDefault();
            return;
        }

        const path = e.composedPath();
        const input = path.find(n => n instanceof HTMLInputElement) as HTMLInputElement | undefined;
        if (!input) return;

        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const selectedLen = Math.max(0, end - start);

        const nextLen = input.value.length - selectedLen + ch.length;
        if (nextLen > 10) e.preventDefault();
    }

    private onNative(e: Event) {
        const path = e.composedPath?.() ?? [];
        const target = path.find(n => n instanceof HTMLInputElement) as HTMLInputElement | undefined;
        const raw = target?.value ?? '';

        const cleaned = maskDateInput(raw, this.locale);
        if (cleaned !== raw && target) target.value = cleaned;

        this.valueEnd = cleaned;

        this.dispatchEvent(
            new CustomEvent(e.type, {
                detail: { value: cleaned },
                bubbles: true,
                composed: false,
            }),
        );
    }

    private onFocusOut(e: FocusEvent) {
        const path = e.composedPath?.() ?? [];
        const input = path.find(n => n instanceof HTMLInputElement) as HTMLInputElement | undefined;

        const raw = input?.value ?? this.valueEnd ?? '';
        const d = parseByLocale(raw, this.locale);

        if (d) {
            const formatted = formatDateByLocale(d, this.locale);
            this.valueEnd = formatted;
            if (input) input.value = formatted;
        } else {
            this.valueEnd = raw;
        }
    }

    private localPlaceholder(): string {
        this.ensureLocaleCache();
        return this.placeholderEnd || this._cachedPlaceholder;
    }

    private localPattern(): string {
        this.ensureLocaleCache();
        return this._cachedPattern;
    }

    private localMaxLength(): number {
        return 10;
    }

    override updated(changed: Map<string, unknown>) {
        if (changed.has('locale')) {
            const oldLocale = changed.get('locale') as string | undefined;
            const parsed = parseByLocale(this.valueEnd, oldLocale ?? this.locale);
            if (parsed) this.valueEnd = formatDateByLocale(parsed, this.locale);
        }
    }

    override render() {
        // Show help text on end input in vertical layout (last item)
        // In horizontal layout, help text is shown on start input
        const showHelpText = this.inputsDirection === 'vertical' ? this.helpText : '';

        return html`
            <ts-input
                .value=${this.valueEnd}
                .size=${this.size}
                .label=${this.labelEnd || getFallbackLabels(this.locale).end}
                .helpText=${showHelpText}
                .helpTextVisuallyHidden=${this.helpTextVisuallyHidden}
                .ariaLabel=${this.ariaLabelEnd}
                ?clearable=${this.clearable}
                ?disabled=${this.disabled}
                .placeholder=${this.localPlaceholder()}
                ?readonly=${this.readonly}
                .lock=${this.lock}
                .name=${this.nameEnd}
                .form=${this.form}
                ?required=${this.required}
                .enterkeyhint=${this.enterkeyhint}
                ?pill=${this.pill}
                ?filled=${this.filled}
                .pattern=${this.localPattern()}
                .maxLength=${this.localMaxLength()}
                .inputMode=${'numeric'}
                .error=${this.errorEnd}
                .errorMessage=${this.errorMessageEnd}
                ?label-visually-hidden=${this.labelVisuallyHidden}
                @beforeinput=${this.onBeforeInput}
                @input=${this.onNative}
                @change=${this.onNative}
                @focusout=${this.onFocusOut}
            >
                <slot name="suffix" slot="suffix"></slot>
                <slot name="label-icon" slot="label-icon"></slot>
            </ts-input>
        `;
    }
}
