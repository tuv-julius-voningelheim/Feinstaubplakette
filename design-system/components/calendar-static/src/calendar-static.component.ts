import { type CSSResultGroup, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { getCalendarButtons, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { parseByLocale } from '@utils/date/date-format.js';
import { inRange } from '@utils/date/date-utils.js';
import { DaysOfWeek } from '@utils/date/model.js';

import { TsButton } from '@components/button/index.js';
import TsDateCalendar from '@components/date-picker/date-calendar/date-calendar.component.js';
import { buildDateValue, buildMeta } from '@components/date-picker/src/events-date.helpers.js';

import styles from './TsCalendarStaticStyle.js';

type SelectEvent = CustomEvent<{ value: Date; locale: string; meta: unknown }>;
type MonthChangeEvent = CustomEvent<{ focused: Date }>;

/**
 * @summary A standalone calendar component that allows users to select a single date.
 * It includes optional OK/Cancel footer actions.
 * @documentation https://create.tuvsud.com/latest/components/calendar-static/develop
 * @status stable
 * @since 1.0
 * @access public
 *
 * @dependency ts-date-calendar
 * @dependency ts-button
 *
 * @event ts-date-select - Emitted when a date is picked from the calendar. Detail: `{ date, value, locale, meta }`.
 * @event ts-date-apply - Emitted when the user confirms a selection (footer-action mode). Detail: `{ value, locale, meta }`.
 * @event ts-date-cancel - Emitted when the user cancels a selection (footer-action mode). Detail: `{ value, locale, meta }`.
 * @event ts-date-change-month - Emitted when the visible month changes. Detail: `{ focused, month, year, date }`.
 * @event ts-year-change - Emitted when the user navigates to a different year. Detail: `{ focused }`.
 * @event ts-month-change - Emitted when the user navigates to a different month. Detail: `{ focused }`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart calendar - The calendar container.
 * @csspart footer - The footer actions container.
 */
export default class TsCalendarStaticComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];
    static dependencies = {
        'ts-date-calendar': TsDateCalendar,
        'ts-button': TsButton,
    };

    /** The active locale for date formatting and localization. */
    @property() locale = 'en';

    /** Minimum selectable year in date pickers. */
    @property({ type: Number }) minYear = 1900;

    /** Maximum selectable year in date pickers. */
    @property({ type: Number }) maxYear = 2100;

    /** The currently selected date in `YYYY-MM-DD` format. */
    @property({ type: String, reflect: true }) value?: string;

    /** The currently focused date (visible month anchor) in `YYYY-MM-DD` format. */
    @property({ type: String, reflect: true, attribute: 'focused-date' }) focusedDate?: string;

    /** When `true`, dates are handled in UTC rather than the local timezone. */
    @property({ type: Boolean, reflect: true }) utc = true;

    /** Disables selection of past dates when true. */
    @property({ type: Boolean, reflect: true, attribute: 'disable-past' }) disablePast = false;

    /** Disables selection of future dates when true. */
    @property({ type: Boolean, reflect: true, attribute: 'disable-future' }) disableFuture = false;

    /** The minimum selectable date in `YYYY-MM-DD` format. */
    @property({ type: String, reflect: true, attribute: 'min-date' }) minDate?: string;

    /** The maximum selectable date in `YYYY-MM-DD` format. */
    @property({ type: String, reflect: true, attribute: 'max-date' }) maxDate?: string;

    /** Disables selection of weekend dates when true. */
    @property({ type: Boolean, reflect: true, attribute: 'disable-weekend' }) disableWeekend = false;

    /** An array of specific dates to disable in `YYYY-MM-DD` format. */
    @property({ type: Array, attribute: 'disable-dates' }) disableDates: string[] = [];

    /** Shows OK/Cancel footer actions. The selection is only confirmed on OK click. */
    @property({ type: Boolean, reflect: true, attribute: 'footer-action' }) footerAction = true;

    /**
     * The first day of the week shown in the calendar.
     * `0` = Monday (default), `1` = Sunday.
     */
    @property({ type: Number, reflect: true, attribute: 'first-day-of-week' }) firstDayOfWeek: 0 | 1 = 0;

    private snapshotValue?: string;
    private tempSelected?: Date;

    protected override willUpdate(changed: PropertyValues) {
        super.willUpdate(changed);
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }
    }

    private parseDate(value?: string): Date | undefined {
        if (!value) return undefined;
        const parsed = parseByLocale(value, this.locale);
        return parsed ? this.toDay(parsed) : undefined;
    }

    private get selectedDate(): Date | undefined {
        return this.parseDate(this.value);
    }

    private get focusedDateObj(): Date | undefined {
        return this.parseDate(this.focusedDate);
    }

    private toDay(d: Date) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    private get todayStart() {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }

    private get minBound(): Date | undefined {
        const parsed = this.minDate ? parseByLocale(this.minDate, this.locale) : undefined;
        if (this.disablePast) return this.todayStart;
        if (parsed) return this.toDay(parsed);
        return undefined;
    }

    private get maxBound(): Date | undefined {
        const parsed = this.maxDate ? parseByLocale(this.maxDate, this.locale) : undefined;
        if (this.disableFuture) return this.todayStart;
        if (parsed) return this.toDay(parsed);
        return undefined;
    }

    private coerceFocused() {
        const base = this.focusedDateObj ?? this.selectedDate ?? new Date();
        const d = new Date(base.getFullYear(), base.getMonth(), 1);
        const min = this.minBound;
        const max = this.maxBound;
        if (min || max) {
            const first = new Date(d.getFullYear(), d.getMonth(), 1);
            const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            if (!inRange(first, min, max) && !inRange(last, min, max)) {
                const clamp = min && (!max || min > last) ? min : (max ?? d);
                return new Date(clamp.getFullYear(), clamp.getMonth(), 1);
            }
        }
        return d;
    }

    private isDateDisabled = (d: Date): boolean => {
        const day = this.toDay(d);

        if (this.disableWeekend && (day.getDay() === 0 || day.getDay() === 6)) return true;

        if (this.disableDates?.length) {
            const ds = this.disableDates
                .map(s => parseByLocale(s, this.locale))
                .filter(Boolean)
                .map(x => this.toDay(x!));
            if (ds.some(x => x.getTime() === day.getTime())) return true;
        }

        return false;
    };

    private handleTempSelect = (e: SelectEvent) => {
        if (this.footerAction) {
            this.tempSelected = e.detail.value;
            this.requestUpdate();
        } else {
            // Immediately apply selection when footerAction is false
            const val = e.detail.value;
            this.value = buildDateValue(val);
            this.snapshotValue = this.value;
            this.dispatchEvent(
                new CustomEvent('ts-date-select', {
                    detail: {
                        date: val,
                        value: buildDateValue(val),
                        locale: this.locale,
                        meta: buildMeta(val, this.locale, this.utc),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );
            this.requestUpdate();
        }
    };

    private handleOkClick = () => {
        const val = this.tempSelected ?? this.selectedDate;
        if (val) {
            this.value = buildDateValue(val);
            this.snapshotValue = this.value;

            this.dispatchEvent(
                new CustomEvent('ts-date-select', {
                    detail: {
                        date: val,
                        value: buildDateValue(val),
                        locale: this.locale,
                        meta: buildMeta(val, this.locale, this.utc),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );

            this.dispatchEvent(
                new CustomEvent('ts-date-apply', {
                    detail: {
                        value: buildDateValue(val),
                        locale: this.locale,
                        meta: buildMeta(val, this.locale, this.utc),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );

            this.requestUpdate();
        }
    };

    private handleCancelClick = () => {
        this.tempSelected = this.snapshotValue ? this.parseDate(this.snapshotValue) : this.selectedDate;

        this.dispatchEvent(
            new CustomEvent('ts-date-cancel', {
                detail: {
                    value: buildDateValue(this.tempSelected),
                    locale: this.locale,
                    meta: buildMeta(this.tempSelected, this.locale, this.utc),
                },
                bubbles: true,
                composed: true,
            }),
        );

        this.requestUpdate();
    };

    private handleMonthChange = (e: MonthChangeEvent) => {
        const prev = this.focusedDateObj;
        const next = e.detail.focused;
        this.focusedDate = buildDateValue(next);

        // Emit ts-month-change
        this.dispatchEvent(
            new CustomEvent('ts-month-change', {
                detail: { focused: next },
                bubbles: true,
                composed: true,
            }),
        );

        // Emit ts-year-change if year changed
        if (!prev || next.getFullYear() !== prev.getFullYear()) {
            this.dispatchEvent(
                new CustomEvent('ts-year-change', {
                    detail: { focused: next },
                    bubbles: true,
                    composed: true,
                }),
            );
        }

        // Emit ts-date-change-month if month changed
        if (!prev || next.getMonth() !== prev.getMonth() || next.getFullYear() !== prev.getFullYear()) {
            this.dispatchEvent(
                new CustomEvent('ts-date-change-month', {
                    detail: {
                        focused: next,
                        month: next.getMonth() + 1,
                        year: next.getFullYear(),
                        date: buildMeta(next, this.locale, this.utc),
                    },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    };

    private get labels() {
        return getCalendarButtons(this.locale);
    }

    protected override firstUpdated() {
        this.snapshotValue = this.value;
    }

    protected override updated(changed: Map<string, unknown>) {
        // When value is changed externally (the new value differs from snapshot),
        // reset tempSelected so the calendar reflects the new value immediately.
        if (changed.has('value') && this.value !== this.snapshotValue) {
            this.tempSelected = undefined;
            this.snapshotValue = this.value;
        }
    }

    override render() {
        const focusedDate = this.coerceFocused();
        return html`
            <div part="base" class="calendar-static">
                <ts-date-calendar
                    part="calendar"
                    id="calendar-panel"
                    .focusedDate=${focusedDate}
                    .selectedDate=${this.tempSelected ?? this.selectedDate}
                    .firstDayOfWeek=${this.firstDayOfWeek === 1 ? DaysOfWeek.Sunday : DaysOfWeek.Monday}
                    .locale=${this.locale}
                    .minYear=${this.minYear}
                    .maxYear=${this.maxYear}
                    .min=${this.minBound}
                    .max=${this.maxBound}
                    .isDateDisabled=${this.isDateDisabled}
                    @ts-month-change=${this.handleMonthChange}
                    @ts-date-select=${this.handleTempSelect}
                ></ts-date-calendar>
                ${
                    this.footerAction
                        ? html`
                              <div class="footer-divider"></div>
                              <div part="footer" class="date-picker__footer-actions">
                                  <ts-button variant="text" @click=${this.handleCancelClick}
                                      >${this.labels.cancel}</ts-button
                                  >
                                  <ts-button variant="text" @click=${this.handleOkClick}>${this.labels.ok}</ts-button>
                              </div>
                          `
                        : ''
                }
            </div>
        `;
    }
}
