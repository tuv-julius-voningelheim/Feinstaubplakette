import { html } from 'lit';

import {
    formatDateByLocale,
    getDatePattern,
    getDatePlaceholder,
    getDateSeparator,
    maskDateInput,
    parseByLocale,
} from '@utils/date/date-format.js';

import DateFieldComponent from '@components/date-picker/src/date-field.component.js';
import { TsInput } from '@components/input/index.js';

/**
 * @summary Internal masked date input field that enforces locale-aware formatting, character
 * restrictions, and auto-validation on blur. Used internally by `ts-date-picker`.
 * @documentation https://create.tuvsud.com/latest/components/date-picker/develop-TSyJ1k6n
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
 * @csspart base - The component's base wrapper (inherited from DateFieldComponent).
 */
export default class TsDateInput extends DateFieldComponent {
    static override dependencies = { 'ts-input': TsInput };

    private onBeforeInput(e: InputEvent) {
        if (e.inputType !== 'insertText') return;

        const sep = getDateSeparator(this.locale);
        const ch = e.data ?? '';

        const re = new RegExp(`^[0-9\\${sep}]$`);
        if (!re.test(ch)) {
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

        this.value = cleaned;
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

        const raw = input?.value ?? this.value ?? '';
        const d = parseByLocale(raw, this.locale);

        if (d) {
            const formatted = formatDateByLocale(d, this.locale);
            this.value = formatted;
            if (input) input.value = formatted;
        } else {
            this.value = raw;
        }
    }

    private localPlaceholder(): string {
        if (this.placeholder) return this.placeholder;
        return getDatePlaceholder(this.locale);
    }

    private localPattern(): string {
        return getDatePattern(this.locale);
    }

    private localMaxLength(): number {
        return 10;
    }

    override render() {
        return html`
            <ts-input
                .value=${this.value}
                .size=${this.size}
                .label=${this.label || ''}
                .labelVisuallyHidden=${this.labelVisuallyHidden}
                .helpText=${this.helpText}
                .helpTextVisuallyHidden=${this.helpTextVisuallyHidden}
                .ariaLabel=${this.ariaLabel}
                .clearable=${this.clearable}
                ?disabled=${this.disabled}
                .placeholder=${this.localPlaceholder()}
                ?readonly=${this.readonly}
                .lock=${this.lock}
                .name=${this.name}
                .form=${this.form}
                ?required=${this.required}
                ?autofocus=${this.autofocus}
                .enterkeyhint=${this.enterkeyhint}
                ?pill=${this.pill}
                ?filled=${this.filled}
                .pattern=${this.localPattern()}
                .maxLength=${this.localMaxLength()}
                .inputMode=${'numeric'}
                .error=${this.dateError}
                .errorMessage=${this.dateErrorMessage}
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
