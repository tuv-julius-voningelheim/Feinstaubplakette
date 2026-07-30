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
import { TsDialog } from '@components/dialog/index.js';
import { TsIconButton } from '@components/icon-button/index.js';
import { TsInput } from '@components/input/index.js';

import styles from './TsDateDialogStyle.js';

type SelectEvent = CustomEvent<{ value: Date; locale: string; meta: unknown }>;
type MonthChangeEvent = CustomEvent<{ focused: Date }>;

/**
 * @summary Internal mobile-oriented date dialog that wraps a full-screen dialog containing a
 * calendar and OK/Cancel footer actions. Used by `ts-date-picker` on small viewports.
 * @documentation https://create.tuvsud.com/latest/components/date-picker/develop-TSyJ1k6n
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 * @dependency ts-input
 * @dependency ts-date-input
 * @dependency ts-dialog
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
export default class TsDateDialogComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];
    static dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-input': TsInput,
        'ts-date-input': TsDateInput,
        'ts-dialog': TsDialog,
        'ts-date-calendar': TsDateCalendar,
        'ts-button': TsButton,
    };

    /** Indicates whether the dialog is currently open. */
    @property({ type: Boolean, reflect: true }) open = false;
    /** The formatted display value shown in the input. */
    @property() displayValue = '';
    /** The distance offset between the trigger and the popup. */
    @property({ type: Number }) distance = 4;
    /** The size variant of the input field (`'small'`, `'medium'`, or `'large'`). */
    @property() size: string | number | undefined;
    /** When `true`, disables the input and prevents interaction. */
    @property({ type: Boolean }) disabled = false;
    /** When `true`, makes the input read-only and disables the calendar icon. */
    @property({ type: Boolean }) readonly = false;
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
    /** The currently focused date determining the visible month. */
    @property({ attribute: false }) focused: Date = new Date();
    /** The currently selected date. */
    @property({ attribute: false }) selected?: Date;
    /** Properties forwarded to the internal `ts-date-input`. */
    @property({ attribute: false }) forwardedProps: Record<string, unknown> = {};
    /** Predicate function used to disable specific dates. */
    @property({ attribute: false }) isDateDisabled!: (d: Date) => boolean;
    /** Callback invoked after the dialog finishes showing. */
    @property({ attribute: false }) onAfterShow!: () => void;
    /** Callback invoked after the dialog finishes hiding. */
    @property({ attribute: false }) onAfterHide!: () => void;
    /** Callback invoked on input or change events from the date input. */
    @property({ attribute: false }) onInputOrChange!: (e: Event) => void;
    /** Callback invoked when the date input loses focus. */
    @property({ attribute: false }) onInputBlur!: () => void;
    /** Callback invoked when the calendar month changes. */
    @property({ attribute: false }) onMonthChange!: (e: MonthChangeEvent) => void;
    /** Callback invoked when the calendar year changes. */
    @property({ attribute: false }) onYearChange!: (e: MonthChangeEvent) => void;

    /** Callback invoked when a date is selected from the calendar. */
    @property({ attribute: false }) onSelect!: (e: SelectEvent) => void;
    /** Callback invoked when the user cancels the selection, with the snapshot display value. */
    @property({ attribute: false }) onCancel!: (snapshotDisplayValue: string) => void;

    /**
     * The first day of the week shown in the calendar.
     * `0` = Monday (default), `1` = Sunday.
     */
    @property({ type: Number }) firstDayOfWeek: 0 | 1 = 0;

    @query('ts-dialog') private dialog!: TsDialog;

    private snapshotSelected?: Date;
    private snapshotDisplayValue = '';

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }
    }
    private tempSelected?: Date;

    private handleCalendarIconClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.open = true;
    };

    private handleAfterShow = () => {
        this.snapshotSelected = this.selected;
        this.snapshotDisplayValue = this.displayValue;
        this.tempSelected = this.selected;
        this.onAfterShow?.();
    };

    private handleAfterHide = () => {
        const calendar = this.renderRoot.querySelector('ts-date-calendar') as TsDateCalendar | null;
        calendar?.resetView?.();
        this.open = false;
        this.onAfterHide?.();
    };

    private handleTempSelect = (e: SelectEvent) => {
        this.tempSelected = e.detail.value;
        this.requestUpdate();
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
            });

            // Forward select to parent (commits value + emits public ts-date-select)
            this.onSelect?.(ev);
        }

        // Emit ts-date-apply so consumers know the user confirmed
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

        if (this.dialog && typeof this.dialog.hide === 'function') this.dialog.hide();
        else this.open = false;
    };

    private handleCancelClick = () => {
        this.tempSelected = this.snapshotSelected;

        // Tell parent to revert its display value to the snapshot
        this.onCancel?.(this.snapshotDisplayValue);

        // Emit ts-date-cancel so consumers know the user cancelled
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

        if (this.dialog && typeof this.dialog.hide === 'function') this.dialog.hide();
        else this.open = false;
    };

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

    override render() {
        const aria = getCalendarAriaLabels(this.locale);
        return html`
            <ts-date-input
                .value=${this.displayValue}
                aria-haspopup="dialog"
                @input=${this.onInputOrChange}
                @change=${this.onInputOrChange}
                @blur=${this.onInputBlur}
                ${forwardProps(this.forwardedProps)}
            >
                <ts-icon-button
                    slot="suffix"
                    name="calendar_month"
                    library="system"
                    size=${this.iconSize}
                    ?disabled=${this.disabled || this.readonly}
                    @click=${this.handleCalendarIconClick}
                    label=${aria.openCalendar}
                ></ts-icon-button>
                <slot name="label-icon" slot="label-icon"></slot>
            </ts-date-input>

            <ts-dialog
                class="date-picker"
                hoist
                role="dialog"
                aria-modal="true"
                aria-live="polite"
                aria-label=${aria.calendarDateSelection}
                no-header="true"
                no-body-padding
                prevent-overlay-close="true"
                width="auto"
                .open=${this.open}
                @ts-after-show=${this.handleAfterShow}
                @ts-after-hide=${this.handleAfterHide}
            >
                <div class="content-footer-container">
                    <ts-date-calendar
                        id="calendar-panel"
                        .focusedDate=${this.focused}
                        .selectedDate=${this.tempSelected ?? this.selected}
                        .firstDayOfWeek=${this.firstDayOfWeek === 1 ? DaysOfWeek.Sunday : DaysOfWeek.Monday}
                        .locale=${this.locale}
                        .minYear=${this.minYear}
                        .maxYear=${this.maxYear}
                        .min=${this.min}
                        .max=${this.max}
                        .isDateDisabled=${this.isDateDisabled}
                        @ts-month-change=${this.onMonthChange}
                        @ts-year-change=${this.onYearChange}
                        @ts-date-select=${this.handleTempSelect}
                    ></ts-date-calendar>

                    <div class="footer-divider"></div>
                    <div class="date-picker__footer-actions">
                        <ts-button variant="text" @click=${this.handleCancelClick}>${this.labels.cancel}</ts-button>
                        <ts-button variant="text" @click=${this.handleOkClick}>${this.labels.ok}</ts-button>
                    </div>
                </div>
            </ts-dialog>
        `;
    }
}
