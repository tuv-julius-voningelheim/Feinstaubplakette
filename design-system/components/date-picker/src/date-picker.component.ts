import { html } from 'lit';
import { query, state } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { formatDateByLocale, parseByLocale } from '@utils/date/date-format.js';
import { clamp } from '@utils/date/date-utils.js';
import { validateDateValue } from '@utils/date/date-validation.js';

import TsDateCalendar from '@components/date-picker/date-calendar/date-calendar.component.js';
import TsDateDialogComponent from '@components/date-picker/date-dialog/date-dialog.component.js';
import TsDateDropdownComponent from '@components/date-picker/date-dropdown/date-dropdown.component.js';
import TsDateInput from '@components/date-picker/date-input/date-input.component.js';
import { TsDropdown } from '@components/dropdown/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';

import DateFieldComponent from './date-field.component.js';
import { buildDateValue, buildMeta } from './events-date.helpers.js';

type DateValidationProps = {
    disableWeekend?: boolean;
    disableDates?: string[];
};

/**
 * @summary Date picker component that allows users to select a single date via an input field with
 * a calendar dropdown (desktop) or dialog (mobile). Inherits all shared date-field properties from
 * `DateFieldComponent`.
 * @documentation https://create.tuvsud.com/latest/components/date-picker/develop-TSyJ1k6n
 * @status stable
 * @since 1.0
 * @access public
 *
 * @dependency ts-icon-button
 * @dependency ts-input
 * @dependency ts-date-input
 * @dependency ts-dropdown
 * @dependency ts-date-calendar
 * @dependency ts-date-dialog
 * @dependency ts-date-dropdown
 *
 * @slot - Default slot inherited from the internal `ts-date-input` for suffix icons.
 * @slot label-icon - An icon (or any element) placed inline after the label text.
 *
 * @event ts-date-change - Emitted whenever the selected date changes. Detail: `{ value, locale, meta }`.
 * @event ts-date-select - Emitted when a date is picked from the calendar. Detail: `{ value, locale, meta, isValid, errors, errorMessage }`.
 * @event ts-blur - Emitted when the input loses focus. Detail: `{ value, locale, meta, isValid, errors, errorMessage }`.
 * @event ts-date-change-month - Emitted when the visible month changes. Detail: `{ month, year, date }`.
 * @event ts-date-change-year - Emitted when the visible year changes. Detail: `{ year, date }`.
 * @event ts-year-change - Emitted when the user navigates to a different year. Detail: `{ focused }`.
 * @event ts-month-change - Emitted when the user navigates to a different month. Detail: `{ focused }`.
 * @event ts-date-apply - Emitted when the user confirms a selection (footer-action mode). Detail: `{ value, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels a selection (footer-action mode). Detail: `{ value, locale, meta }`.
 *
 * @property firstDayOfWeek - The first day of the week in the calendar. `0` = Monday (default), `1` = Sunday.
 *
 * @csspart base - The component's base wrapper (inherited from DateFieldComponent).
 */
export default class TsDatePickerComponent extends DateFieldComponent {
    static override dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-input': TsInput,
        'ts-date-input': TsDateInput,
        'ts-dropdown': TsDropdown,
        'ts-date-calendar': TsDateCalendar,
        'ts-date-dialog': TsDateDialogComponent,
        'ts-date-dropdown': TsDateDropdownComponent,
    };

    @query('ts-dropdown') private dropdown!: TsDropdown;
    @query('ts-date-calendar') private monthEl!: TsDateCalendar;
    @state() private isSmall = false;

    private _distance = 4;

    private focused = new Date();
    private selected?: Date;
    private initializedFromProp = false;
    private mql?: MediaQueryList;

    /**
     * Tracks whether the current error state was set externally by the consumer
     * (via the `date-error` attribute / property). When true, internal validation
     * and editing will NOT clear the error — only the consumer can do that.
     */
    private _externalError = false;

    /** Flag set before internal code changes `dateError` so willUpdate can
     *  distinguish internal vs external changes. */
    private _internalErrorUpdate = false;

    /** Sets dateError / dateErrorMessage from internal validation, marking the
     *  change so willUpdate won't treat it as an external consumer change. */
    private setInternalError(error: boolean, message: string) {
        this._internalErrorUpdate = true;
        this.dateError = error;
        this.dateErrorMessage = message;
    }

    private onResize = () => {
        this.isSmall = this.mql ? this.mql.matches : false;
    };

    private toDay(d: Date) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    private isIsoDate(s: string) {
        return /^\d{4}-\d{2}-\d{2}$/.test((s ?? '').trim());
    }

    private get todayStart() {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }

    private get minBound(): Date | undefined {
        const parsed = parseByLocale(this.minDate ?? '', this.locale);
        if (this.disablePast) return this.todayStart;
        return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : undefined;
    }

    private get maxBound(): Date | undefined {
        const parsed = parseByLocale(this.maxDate ?? '', this.locale);
        if (this.disableFuture) return this.todayStart;
        return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : undefined;
    }

    private applyBounds(source?: 'input' | 'calendar') {
        const min = this.minBound;
        const max = this.maxBound;
        if (this.selected) {
            const next = clamp(this.selected, min, max);
            if (next.getTime() !== this.selected.getTime()) {
                if (source === 'input' && min && this.selected.getTime() < min.getTime()) {
                    this.requestUpdate();
                    return;
                }
                this.selected = this.toDay(next);
                this.value = formatDateByLocale(this.selected!, this.locale);
            }
        }
        this.requestUpdate();
    }

    private async emitDateChange() {
        this.dispatchEvent(
            new CustomEvent('ts-date-change', {
                detail: {
                    value: buildDateValue(this.selected),
                    locale: this.locale,
                    meta: buildMeta(this.selected, this.locale, this.utc),
                },

                bubbles: true,
                composed: true,
            }),
        );
    }

    private async emitBlur() {
        const { disableWeekend, disableDates } = this as unknown as DateValidationProps;
        const result = await validateDateValue(this.value, {
            locale: this.locale,
            required: this.required,
            minDate: this.minDate,
            maxDate: this.maxDate,
            minYear: this.minYear,
            maxYear: this.maxYear,
            disableWeekend,
            disableDates,
            disablePast: this.disablePast,
            disableFuture: this.disableFuture,
        });

        // Only set error on validation failure, and only if the error
        // is not controlled externally by the consumer.
        if (!result.valid && !this._externalError) {
            this.setInternalError(true, result.errors[0]?.message ?? '');
        }

        this.dispatchEvent(
            new CustomEvent('ts-blur', {
                detail: {
                    value: buildDateValue(this.selected),
                    locale: this.locale,
                    meta: buildMeta(this.selected, this.locale, this.utc),
                    isValid: result.valid,
                    errors: result.errors,
                    errorMessage: result.valid ? '' : (result.errors[0]?.message ?? ''),
                },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private syncFromValue(val?: string) {
        const raw = (val ?? '').trim();
        const parsed = parseByLocale(raw, this.locale);

        if (parsed) {
            const day = this.toDay(parsed);
            this.selected = day;
            this.focused = day;

            if (this.utc && this.isIsoDate(raw)) {
                const nextDisplay = formatDateByLocale(day, this.locale);
                if (this.value !== nextDisplay) this.value = nextDisplay;
            }
        } else {
            this.selected = undefined;
            this.focused = new Date();
        }

        this.applyBounds('input');
        this.requestUpdate();
    }

    override willUpdate(changed: PropertyValues) {
        // Track whether dateError is being controlled externally.
        // When the consumer sets date-error via attribute/property, we mark it
        // as external so internal handlers won't override it.
        if (changed.has('dateError')) {
            // If internal code set dateError, _internalErrorUpdate is true and
            // we skip flagging it as external. Otherwise it came from the consumer.
            if (this._internalErrorUpdate) {
                this._internalErrorUpdate = false;
            } else {
                this._externalError = this.dateError;
            }
        }

        if (!this.initializedFromProp) {
            this.syncFromValue(this.value);
            this.initializedFromProp = true;
        }

        if (changed.has('value')) this.syncFromValue(this.value);

        if (changed.has('locale') && this.selected && this.value) {
            this.value = formatDateByLocale(this.selected, this.locale);
        }

        if (
            changed.has('disablePast') ||
            changed.has('disableFuture') ||
            changed.has('minDate') ||
            changed.has('maxDate')
        ) {
            this.applyBounds('calendar');
        }
    }

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

    private emitViewMontChange(next: Date, prev?: Date) {
        if (!prev || next.getMonth() !== prev.getMonth()) {
            this.dispatchEvent(
                new CustomEvent('ts-date-change-month', {
                    detail: {
                        month: next.getMonth() + 1,
                        year: next.getFullYear(),
                        date: buildMeta(next, this.locale, this.utc),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    private emitViewYearChange(next: Date, prev?: Date) {
        if (!prev || next.getFullYear() !== prev.getFullYear()) {
            this.dispatchEvent(
                new CustomEvent('ts-date-change-year', {
                    detail: { year: next.getFullYear(), date: buildMeta(next, this.locale, this.utc) },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    private onYearChange = (e: CustomEvent<{ focused: Date }>) => {
        const prev = this.focused;
        const next = this.toDay(e.detail.focused);
        this.focused = next;
        this.requestUpdate();

        this.dispatchEvent(
            new CustomEvent('ts-year-change', {
                detail: { focused: next },
                bubbles: true,
                composed: true,
            }),
        );

        this.emitViewYearChange(next, prev);
    };

    private onMonthChange = (e: CustomEvent<{ focused: Date }>) => {
        const prev = this.focused;
        const next = this.toDay(e.detail.focused);
        this.focused = next;
        this.requestUpdate();

        this.dispatchEvent(
            new CustomEvent('ts-month-change', {
                detail: { focused: next },
                bubbles: true,
                composed: true,
            }),
        );

        this.emitViewMontChange(next, prev);
    };

    private onSelect = async (e: CustomEvent<{ value: Date }>) => {
        this.selected = this.toDay(e.detail.value);
        this.applyBounds('calendar');
        this.value = formatDateByLocale(this.selected!, this.locale);
        this.requestUpdate();

        const { disableWeekend, disableDates } = this as unknown as DateValidationProps;
        const result = await validateDateValue(this.value, {
            locale: this.locale,
            required: this.required,
            minDate: this.minDate,
            maxDate: this.maxDate,
            minYear: this.minYear,
            maxYear: this.maxYear,
            disableWeekend,
            disableDates,
            disablePast: this.disablePast,
            disableFuture: this.disableFuture,
        });

        // Only update error state from validation if the error is not
        // controlled externally by the consumer.
        if (!this._externalError) {
            this.setInternalError(!result.valid, result.valid ? '' : (result.errors[0]?.message ?? ''));
        }

        this.dispatchEvent(
            new CustomEvent('ts-date-select', {
                detail: {
                    value: buildDateValue(this.selected),
                    locale: this.locale,
                    meta: buildMeta(this.selected, this.locale, this.utc),
                    isValid: result.valid,
                    errors: result.errors,
                    errorMessage: this.dateErrorMessage,
                },
                bubbles: true,
                composed: true,
            }),
        );

        this.emitDateChange();

        // When footerAction is true, the dropdown manages its own close on OK/Cancel.
        // Otherwise, close based on closeOnSelect (default true).
        if (!this.footerAction && this.closeOnSelect) {
            this.dropdown?.hide();
            const trigger = this.renderRoot.querySelector('ts-date-input');
            (trigger as HTMLElement)?.focus();
        }
    };

    private onTriggerClick = (e: Event) => {
        const path = e.composedPath();
        const clickedIcon = path.some(el => el instanceof HTMLElement && el.tagName.toLowerCase() === 'ts-icon-button');
        if (!clickedIcon) {
            e.preventDefault();
            e.stopPropagation();
            if (this.dropdown?.open) this.dropdown.hide();
        }
    };

    private onInputOrChange = (e: Event) => {
        const target = e.currentTarget as TsDateInput | null;
        const next = target?.value ?? '';

        // Clear error state when user starts editing, but only if the error
        // is not controlled externally by the consumer.
        if (this.dateError && !this._externalError) {
            this.setInternalError(false, '');
        }

        this.value = next;
        this.syncFromValue(next);
        this.emitDateChange();
    };

    private onInputBlur = () => {
        this.emitBlur();
    };

    private onDropdownShow = () => {
        this.monthEl?.resetView?.();
        this.dropdown?.setAttribute('aria-expanded', 'true');
    };

    private onDropdownHide = () => {
        this.monthEl?.resetView?.();
        if (!this.value || this.value.trim() === '') {
            const min = this.minBound;
            const max = this.maxBound;
            const now = this.todayStart;
            const next = clamp(now, min, max);
            this.focused = this.toDay(next);
            if (this.monthEl) this.monthEl.focusedDate = this.focused;
            this.requestUpdate();
        }
        this.dropdown?.setAttribute('aria-expanded', 'false');
    };

    private onCancel = (snapshotDisplayValue: string) => {
        // Revert to the value that was showing when the dropdown opened
        this.value = snapshotDisplayValue;
        this.syncFromValue(snapshotDisplayValue);
        this.requestUpdate();
    };

    private isDateDisabled = (d: Date): boolean => {
        const { disableWeekend, disableDates } = this as unknown as DateValidationProps;
        const day = this.toDay(d);

        if (disableWeekend && (day.getDay() === 0 || day.getDay() === 6)) return true;

        if (disableDates?.length) {
            const ds = disableDates
                .map(s => parseByLocale(s, this.locale))
                .filter(Boolean)
                .map(x => this.toDay(x!));
            if (ds.some(x => x.getTime() === day.getTime())) return true;
        }

        return false;
    };

    override render() {
        const displayValue = this.value ? this.value : '';
        const min = this.minBound;
        const max = this.maxBound;
        return this.isSmall
            ? html`<ts-date-dialog
                  .displayValue=${displayValue}
                  .distance=${this._distance}
                  .size=${this.size}
                  .disabled=${this.disabled}
                  .readonly=${this.readonly}
                  .locale=${this.locale}
                  .utc=${this.utc}
                  .minYear=${this.minYear}
                  .maxYear=${this.maxYear}
                  .min=${min}
                  .max=${max}
                  .focused=${this.focused}
                  .selected=${this.selected}
                  .isDateDisabled=${this.isDateDisabled}
                  .forwardedProps=${this.forwardedProps}
                  .onAfterShow=${this.onDropdownShow}
                  .onAfterHide=${this.onDropdownHide}
                  .onInputOrChange=${this.onInputOrChange}
                  .onInputBlur=${this.onInputBlur}
                  .onTriggerClick=${this.onTriggerClick}
                  .onMonthChange=${this.onMonthChange}
                  .onYearChange=${this.onYearChange}
                  .onSelect=${this.onSelect}
                  .onCancel=${this.onCancel}
                  .firstDayOfWeek=${this.firstDayOfWeek}
                  ><slot name="label-icon" slot="label-icon"></slot
              ></ts-date-dialog>`
            : html`<ts-date-dropdown
                  .displayValue=${displayValue}
                  .distance=${this._distance}
                  .size=${this.size}
                  .disabled=${this.disabled}
                  .readonly=${this.readonly}
                  .locale=${this.locale}
                  .utc=${this.utc}
                  .minYear=${this.minYear}
                  .maxYear=${this.maxYear}
                  .min=${min}
                  .max=${max}
                  .focused=${this.focused}
                  .selected=${this.selected}
                  .isDateDisabled=${this.isDateDisabled}
                  .forwardedProps=${this.forwardedProps}
                  .footerAction=${this.footerAction}
                  .closeOnSelect=${this.closeOnSelect}
                  .onAfterShow=${this.onDropdownShow}
                  .onAfterHide=${this.onDropdownHide}
                  .onInputOrChange=${this.onInputOrChange}
                  .onInputBlur=${this.onInputBlur}
                  .onTriggerClick=${this.onTriggerClick}
                  .onMonthChange=${this.onMonthChange}
                  .onYearChange=${this.onYearChange}
                  .onSelect=${this.onSelect}
                  .onCancel=${this.onCancel}
                  .firstDayOfWeek=${this.firstDayOfWeek}
                  ><slot name="label-icon" slot="label-icon"></slot
              ></ts-date-dropdown>`;
    }
}
