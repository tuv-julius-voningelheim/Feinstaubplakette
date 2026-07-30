import { type CSSResultGroup, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { getCalendarAriaLabels, getCalendarButtons, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { DaysOfWeek } from '@utils/date/model.js';
import { forwardProps } from '@utils/directive/forward-props.directive.js';

import { TsButton } from '@components/button/index.js';
import TsDateCalendar from '@components/date-picker/date-calendar/date-calendar.component.js';
import TsDateInput from '@components/date-picker/date-input/date-input.component.js';
import { buildDateValue, buildMeta } from '@components/date-picker/src/events-date.helpers.js';
import { TsDropdown } from '@components/dropdown/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';

import styles from './TsDateDropdownStyle.js';

type SelectEvent = CustomEvent<{ value: Date; locale: string; meta: unknown }>;

/**
 * @summary Internal desktop dropdown variant for the date picker. Wraps a `ts-dropdown` that
 * contains the calendar panel with optional OK/Cancel footer actions. Used by `ts-date-picker`
 * on larger viewports.
 * @documentation https://create.tuvsud.com/latest/components/date-picker/develop-TSyJ1k6n
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 * @dependency ts-input
 * @dependency ts-date-input
 * @dependency ts-dropdown
 * @dependency ts-date-calendar
 * @dependency ts-button
 *
 * @slot suffix - Suffix slot forwarded to the internal `ts-date-input` for a calendar icon.
 * @slot label-icon - An icon (or any element) placed inline after the label text. Forwarded to the internal `ts-date-input`.
 *
 * @event ts-date-apply - Emitted when the user confirms the selection via OK. Detail: `{ value, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels via Cancel button. Detail: `{ value, locale, meta }`.
 *
 * @csspart base - The component's root wrapper.
 */
export default class TsDateDropdownComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];

    static dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-input': TsInput,
        'ts-date-input': TsDateInput,
        'ts-dropdown': TsDropdown,
        'ts-date-calendar': TsDateCalendar,
        'ts-button': TsButton,
    };

    /** The formatted display value shown in the input. */
    @property() displayValue = '';
    /** The distance offset between the trigger and the dropdown popup. */
    @property({ type: Number }) distance = 4;
    /** The size variant of the input field (`'small'`, `'medium'`, or `'large'`). */
    @property() size: string | number | undefined;
    /** When `true`, disables the input and prevents interaction. */
    @property({ type: Boolean }) disabled = false;
    /** When `true`, makes the input read-only and disables the calendar icon. */
    @property({ type: Boolean }) readonly = false;
    /** Shows OK/Cancel footer actions. The selection is only confirmed on OK click. */
    @property({ type: Boolean, reflect: true, attribute: 'footer-action' }) footerAction = false;
    /** Closes the dropdown immediately when a date is selected (only when `footerAction` is `false`). */
    @property({ type: Boolean, reflect: true, attribute: 'close-on-select' }) closeOnSelect = true;
    /** When `true`, dates are handled in UTC rather than the local timezone. */
    @property({ type: Boolean }) utc = true;
    /** The active locale for date formatting and localization. */
    @property() locale = 'en';
    /** The minimum selectable year. */
    @property({ type: Number }) minYear = 1900;
    /** The maximum selectable year. */
    @property({ type: Number }) maxYear = 2100;
    /** The minimum selectable date boundary. */
    @property({ attribute: false }) min?: Date;
    /** The maximum selectable date boundary. */
    @property({ attribute: false }) max?: Date;
    /** The currently focused date determining the visible month in the calendar. */
    @property({ attribute: false }) focused!: Date;
    /** The currently selected date. */
    @property({ attribute: false }) selected?: Date;
    /** Properties forwarded to the internal `ts-date-input`. */
    @property({ attribute: false }) forwardedProps: Record<string, unknown> = {};
    /** Predicate function used to disable specific dates. */
    @property({ attribute: false }) isDateDisabled!: (d: Date) => boolean;
    /** Callback invoked after the dropdown finishes showing. */
    @property({ attribute: false }) onAfterShow!: () => void;
    /** Callback invoked after the dropdown finishes hiding. */
    @property({ attribute: false }) onAfterHide!: () => void;
    /** Callback invoked on input or change events from the date input. */
    @property({ attribute: false }) onInputOrChange!: (e: Event) => void;
    /** Callback invoked when the date input loses focus. */
    @property({ attribute: false }) onInputBlur!: () => void;
    /** Callback invoked when the trigger input is clicked. */
    @property({ attribute: false }) onTriggerClick!: (e: Event) => void;
    /** Callback invoked when the calendar month changes. */
    @property({ attribute: false }) onMonthChange!: (e: CustomEvent<{ focused: Date }>) => void;
    /** Callback invoked when the calendar year changes. */
    @property({ attribute: false }) onYearChange!: (e: CustomEvent<{ focused: Date }>) => void;
    /** Callback invoked when a date is selected from the calendar. */
    @property({ attribute: false }) onSelect!: (e: SelectEvent) => void;
    /** Callback invoked when the user cancels the selection, with the snapshot display value. */
    @property({ attribute: false }) onCancel!: (snapshotDisplayValue: string) => void;

    /**
     * The first day of the week shown in the calendar.
     * `0` = Monday (default), `1` = Sunday.
     */
    @property({ type: Number }) firstDayOfWeek: 0 | 1 = 0;

    @query('ts-dropdown') private dropdown!: TsDropdown;
    @query('ts-date-calendar') private monthEl!: TsDateCalendar;
    @query('ts-date-input') private trigger!: TsDateInput;

    /** Snapshot of selected date when dropdown opens (for cancel revert). */
    private snapshotSelected?: Date;
    /** Snapshot of display value when dropdown opens (for cancel revert). */
    private snapshotDisplayValue = '';
    /** Temp selected date while footerAction is true (not yet confirmed). */
    private tempSelected?: Date;

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }
    }

    private get labels() {
        return getCalendarButtons(this.locale);
    }

    private get iconSize() {
        switch (this.size) {
            case 'small':
                return '16';
            case 'large':
                return '24';
            default:
                return '20';
        }
    }

    private handleAfterShow = () => {
        // Snapshot current state for cancel revert
        this.snapshotSelected = this.selected;
        this.snapshotDisplayValue = this.displayValue;
        this.tempSelected = this.selected;
        this.onAfterShow?.();
    };

    private handleAfterHide = () => {
        this.monthEl?.resetView?.();
        this.onAfterHide?.();
    };

    private handleSelect = (e: SelectEvent) => {
        if (this.footerAction) {
            this.tempSelected = e.detail.value;

            this.onSelect?.(e);
        } else {
            this.onSelect?.(e);

            if (this.closeOnSelect) {
                this.dropdown?.hide();
                this.trigger?.focus();
            }
        }
    };

    private handleOkClick = () => {
        if (this.tempSelected) {
            const ev = new CustomEvent('ts-date-select', {
                detail: {
                    value: this.tempSelected,
                    locale: this.locale,
                    meta: buildMeta(this.tempSelected, this.locale),
                },
                bubbles: true,
                composed: false,
            }) as SelectEvent;

            this.onSelect?.(ev);
        }

        this.dispatchEvent(
            new CustomEvent('ts-date-apply', {
                detail: {
                    value: buildDateValue(this.tempSelected),
                    locale: this.locale,
                    meta: buildMeta(this.tempSelected, this.locale, this.utc),
                },
                bubbles: true,
                composed: true,
            }),
        );

        this.dropdown?.hide();
        this.trigger?.focus();
    };

    private handleCancelClick = () => {
        this.tempSelected = this.snapshotSelected;
        this.onCancel?.(this.snapshotDisplayValue);

        this.dispatchEvent(
            new CustomEvent('ts-date-cancel', {
                detail: {
                    value: buildDateValue(this.snapshotSelected),
                    locale: this.locale,
                    meta: buildMeta(this.snapshotSelected, this.locale, this.utc),
                },
                bubbles: true,
                composed: true,
            }),
        );

        this.dropdown?.hide();
        this.trigger?.focus();
    };

    override render() {
        const aria = getCalendarAriaLabels(this.locale);
        return html`
            <ts-dropdown
                class="date-picker"
                hoist
                role="dialog"
                aria-modal="true"
                aria-live="polite"
                aria-label=${aria.calendarDateSelection}
                distance=${this.distance}
                placement="bottom-start"
                @ts-after-show=${this.handleAfterShow}
                @ts-after-hide=${this.handleAfterHide}
            >
                <ts-date-input
                    slot="trigger"
                    .value=${this.displayValue}
                    aria-haspopup="dialog"
                    @input=${this.onInputOrChange}
                    @change=${this.onInputOrChange}
                    @blur=${this.onInputBlur}
                    @click=${this.onTriggerClick}
                    ${forwardProps(this.forwardedProps)}
                >
                    <ts-icon-button
                        slot="suffix"
                        name="calendar_month"
                        library="system"
                        size=${this.iconSize}
                        ?disabled=${this.disabled || this.readonly}
                        label=${aria.openCalendar}
                    <slot name="label-icon" slot="label-icon"></slot>
                </ts-date-input>

                <div class="content-footer-container">
                    <ts-date-calendar
                        id="calendar-panel"
                        .focusedDate=${this.focused}
                        .selectedDate=${this.footerAction ? (this.tempSelected ?? this.selected) : this.selected}
                        .firstDayOfWeek=${this.firstDayOfWeek === 1 ? DaysOfWeek.Sunday : DaysOfWeek.Monday}
                        .locale=${this.locale}
                        .minYear=${this.minYear}
                        .maxYear=${this.maxYear}
                        .min=${this.min}
                        .max=${this.max}
                        .isDateDisabled=${this.isDateDisabled}
                        .footerAction=${this.footerAction}
                        @ts-month-change=${this.onMonthChange}
                        @ts-year-change=${this.onYearChange}
                        @ts-date-select=${this.handleSelect}
                    ></ts-date-calendar>

                    ${
                        this.footerAction
                            ? html`
                                  <div class="footer-divider"></div>
                                  <div class="date-picker__footer-actions">
                                      <ts-button variant="text" @click=${this.handleCancelClick}
                                          >${this.labels.cancel}</ts-button
                                      >
                                      <ts-button variant="text" @click=${this.handleOkClick}
                                          >${this.labels.ok}</ts-button
                                      >
                                  </div>
                              `
                            : ''
                    }
                </div>
            </ts-dropdown>
        `;
    }
}
