import { html } from 'lit';
import { query, state } from 'lit/decorators.js';

import { formatDateByLocale, parseByLocale } from '@utils/date/date-format.js';
import { getShortcutRange } from '@utils/date/date-shortcuts-utils.js';
import { validateDateRangeField } from '@utils/date/date-validation.js';
import { forwardProps } from '@utils/directive/forward-props.directive.js';

import TsDateDialogRangeComponent from '@components/date-range/date-dialog-range/date-dialog-range.component.js';
import TsDateDropdownRangeComponent from '@components/date-range/date-dropdown-range/date-dropdown-range.component.js';
import TsTagComponent from '@components/tag/src/tag.component.js';

import DateFieldRangeComponent from './date-field-range.component.js';
import { fire } from './events-range.helpers.js';

/**
 * @summary Date range picker that allows users to select a start and end date. Uses a
 * dual-calendar dropdown on desktop viewports and a full-screen dialog on mobile. Inherits
 * all shared range-field properties from `DateFieldRangeComponent`.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access public
 *
 * @dependency ts-date-dropdown-range
 * @dependency ts-date-dialog-range
 * @dependency ts-tag
 *
 * @slot - Default slot inherited from the internal input components for suffix icons.
 * @slot label-icon - An icon (or any element) placed inline after the start date label text.
 * @slot label-icon-end - An icon (or any element) placed inline after the end date label text.
 *
 * @event ts-date-change - Emitted whenever the start or end date changes. Detail: `{ start, end, locale, meta }`.
 * @event ts-date-apply - Emitted when the user confirms the selection (OK button or shortcut). Detail: `{ start, end, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels the selection. Detail: `{ start, end, locale, meta }`.
 * @event ts-shortcut-select - Re-dispatched when a date shortcut tag is clicked. Detail: `{ index }`.
 * @event ts-prev-month-click - Emitted when the previous month navigation button is clicked. Detail: `{ focused, month, year }`.
 * @event ts-next-month-click - Emitted when the next month navigation button is clicked. Detail: `{ focused, month, year }`.
 *
 * @csspart base - The component's base wrapper (inherited from DateFieldRangeComponent).
 */
export default class TsDateRangeComponent extends DateFieldRangeComponent {
    static override dependencies = {
        'ts-date-dropdown-range': TsDateDropdownRangeComponent,
        'ts-date-dialog-range': TsDateDialogRangeComponent,
        'ts-tag': TsTagComponent,
    };

    @query('ts-date-dropdown-range') private dropdown!: TsDateDropdownRangeComponent;
    @state() private isSmall = false;

    private mql?: MediaQueryList;
    private onResize = () => (this.isSmall = this.mql ? this.mql.matches : false);

    private focused = new Date();
    private initializedFromProp = false;

    /** Last error message written by internal validation for the start field. */
    private _internalErrorMessageStart = '';
    /** Last error flag written by internal validation for the start field. */
    private _internalErrorStart = false;
    /** Last error message written by internal validation for the end field. */
    private _internalErrorMessageEnd = '';
    /** Last error flag written by internal validation for the end field. */
    private _internalErrorEnd = false;

    /**
     * Returns true when the developer has set an error on the given side
     * externally (i.e. the current state does not match what we last wrote).
     */
    private isDevErrorStart(): boolean {
        const msg = this.errorMessageStart ?? '';
        return (
            (!!msg && msg !== this._internalErrorMessageStart) ||
            (this.errorStart !== this._internalErrorStart && this.errorStart && !this._internalErrorStart)
        );
    }

    private isDevErrorEnd(): boolean {
        const msg = this.errorMessageEnd ?? '';
        return (
            (!!msg && msg !== this._internalErrorMessageEnd) ||
            (this.errorEnd !== this._internalErrorEnd && this.errorEnd && !this._internalErrorEnd)
        );
    }

    /**
     * Validates a date value and returns error message if invalid.
     * Returns empty string if valid.
     */
    private async getValidationError(value: string, fieldName: 'start' | 'end'): Promise<string> {
        // Skip if empty and not required
        if (!value && !this.required) {
            return '';
        }

        const other = fieldName === 'start' ? this.valueEnd : this.valueStart;
        const result = await validateDateRangeField(value, other, fieldName, {
            locale: this.locale,
            required: this.required,
        });

        return result.valid ? '' : (result.errors[0]?.message ?? '');
    }

    /**
     * Validates and updates error state for both fields.
     * Called on change events (input typing or calendar selection).
     *
     * Skips writing to a side whose error has been set by the developer
     * — developer-provided errors win.
     */
    private async validateBothFields(): Promise<void> {
        if (!this.isDevErrorStart()) {
            let errorMessage = '';
            if (this.valueStart) {
                errorMessage = await this.getValidationError(this.valueStart, 'start');
            } else if (this.required) {
                errorMessage = await this.getValidationError('', 'start');
            }
            this.errorStart = !!errorMessage;
            this.errorMessageStart = errorMessage;
            this._internalErrorStart = this.errorStart;
            this._internalErrorMessageStart = errorMessage;
        }

        if (!this.isDevErrorEnd()) {
            let errorMessage = '';
            if (this.valueEnd) {
                errorMessage = await this.getValidationError(this.valueEnd, 'end');
            } else if (this.required) {
                errorMessage = await this.getValidationError('', 'end');
            }
            this.errorEnd = !!errorMessage;
            this.errorMessageEnd = errorMessage;
            this._internalErrorEnd = this.errorEnd;
            this._internalErrorMessageEnd = errorMessage;
        }
    }

    private emitUnified() {
        fire(this, 'ts-date-change', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);
    }

    private emitApply() {
        fire(this, 'ts-date-apply', this.valueStart || '', this.valueEnd || '', this.locale, this.utc);
    }

    private onInternalUpdate() {
        this.emitUnified();
    }

    private onMonthChange = (e: CustomEvent<{ focused: Date }>) => {
        const newFocused = e.detail.focused;
        if (newFocused?.getTime() !== this.focused?.getTime()) {
            this.focused = newFocused;
            this.requestUpdate();
        }
    };

    private onRangeSelect = async (
        e: CustomEvent<{
            start?: string;
            end?: string;
            clearEnd?: boolean;
            clearStart?: boolean;
            preset?: string;
            apply?: boolean;
        }>,
    ) => {
        const { start, end, clearEnd, clearStart, apply } = e.detail;

        const parsedStart = start ? parseByLocale(start, this.locale) : undefined;
        const parsedEnd = end ? parseByLocale(end, this.locale) : undefined;

        if (clearStart) {
            this.valueStart = '';
        } else if (parsedStart) {
            this.valueStart = formatDateByLocale(parsedStart, this.locale);
        }

        if (clearEnd) {
            this.valueEnd = '';
        } else if (parsedEnd) {
            this.valueEnd = formatDateByLocale(parsedEnd, this.locale);
        }

        // Validate after calendar selection
        await this.validateBothFields();

        this.onInternalUpdate();

        if (apply) {
            this.emitApply();
        }
    };

    private onInputOrChangeStart = (e: Event | CustomEvent<{ value: string }>) => {
        this.valueStart = (e as CustomEvent).detail?.value ?? (e.currentTarget as HTMLInputElement | null)?.value ?? '';

        this.onInternalUpdate();
    };

    private onInputOrChangeEnd = (e: Event | CustomEvent<{ value: string }>) => {
        this.valueEnd = (e as CustomEvent).detail?.value ?? (e.currentTarget as HTMLInputElement | null)?.value ?? '';

        this.onInternalUpdate();
    };

    private onBlurStart = async () => {
        await this.validateBothFields();
    };

    private onBlurEnd = async () => {
        await this.validateBothFields();
    };

    private onShortcutApply = (e: CustomEvent<{ index: number }>) => {
        const index = e.detail.index;
        const { start, end } = getShortcutRange(index, this.locale);
        this.valueStart = start;
        this.valueEnd = end;
        this.emitUnified();
        this.emitApply();
    };

    override connectedCallback() {
        super.connectedCallback();
        this.mql = window.matchMedia('(max-width: 1024px)');
        this.isSmall = this.mql.matches;
        this.mql.addEventListener('change', this.onResize);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.mql?.removeEventListener('change', this.onResize);
    }

    override willUpdate() {
        if (!this.initializedFromProp) {
            this.initializedFromProp = true;
        }
    }

    override render() {
        return this.isSmall
            ? html`<ts-date-dialog-range
                  .valueStart=${this.valueStart}
                  .valueEnd=${this.valueEnd}
                  .focused=${this.focused}
                  .locale=${this.locale}
                  .size=${this.size}
                  .disabled=${this.disabled}
                  .forwardedProps=${this.forwardedProps}
                  .onInputOrChangeStart=${this.onInputOrChangeStart}
                  .onInputOrChangeEnd=${this.onInputOrChangeEnd}
                  .onMonthChange=${this.onMonthChange}
                  .onSelect=${this.onRangeSelect}
                  .onBlurStart=${this.onBlurStart}
                  .onBlurEnd=${this.onBlurEnd}
                  @ts-shortcut-select=${this.onShortcutApply}
                  .readonly=${this.readonly}
                  .clearable=${this.clearable}
                  .firstDayOfWeek=${this.firstDayOfWeek}
                  ${forwardProps(this.forwardedProps)}
                  ><slot name="label-icon" slot="label-icon"></slot
                  ><slot name="label-icon-end" slot="label-icon-end"></slot
              ></ts-date-dialog-range>`
            : html`<ts-date-dropdown-range
                  .valueStart=${this.valueStart}
                  .valueEnd=${this.valueEnd}
                  .focused=${this.focused}
                  .locale=${this.locale}
                  .size=${this.size}
                  .disabled=${this.disabled}
                  .forwardedProps=${this.forwardedProps}
                  .onInputOrChangeStart=${this.onInputOrChangeStart}
                  .onInputOrChangeEnd=${this.onInputOrChangeEnd}
                  .onMonthChange=${this.onMonthChange}
                  .onSelect=${this.onRangeSelect}
                  .closeOnSelect=${this.closeOnSelect}
                  .readonly=${this.readonly}
                  .clearable=${this.clearable}
                  .footerAction=${this.footerAction}
                  .onBlurStart=${this.onBlurStart}
                  .onBlurEnd=${this.onBlurEnd}
                  @ts-shortcut-select=${this.onShortcutApply}
                  .firstDayOfWeek=${this.firstDayOfWeek}
                  ${forwardProps(this.forwardedProps)}
                  ><slot name="label-icon" slot="label-icon"></slot
                  ><slot name="label-icon-end" slot="label-icon-end"></slot
              ></ts-date-dropdown-range>`;
    }
}
