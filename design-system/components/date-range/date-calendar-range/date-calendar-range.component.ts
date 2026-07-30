import { html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';
import type { PropertyValues } from 'lit';

import { getCalendarAriaLabels, getCalendarLocale, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { formatDateByLocale } from '@utils/date/date-format.js';
import { addMonths, getViewOfMonth, isBetween, isEqual, isEqualMonth } from '@utils/date/date-utils.js';
import { normalizeLocale } from '@utils/date/locale.js';
import { DaysOfWeek } from '@utils/date/model.js';

import {
    type CalendarNavigationKey,
    DateRangeFocusManager,
} from '@components/date-range/src/date-range-focus-manager.js';
import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsDateCalendarRangeStyle.js';

type CalendarI18n = { monthsShort: string[]; months: string[]; weekdaysShort: string[] };

/**
 * @summary Dual-month desktop calendar for selecting a date range, used by dropdown-based range pickers.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 *
 * @slot - No user-provided slots. The calendar structure is fully internal.
 *
 * @event ts-date-range-select - Emitted when the user selects a date or completes a range. Provides `{ start, end }`.
 * @event ts-month-change - Emitted when navigating months. Provides `{ focused }`.
 *
 * @csspart base - The root calendar wrapper.
 * @csspart header-left - Left month header containing navigation and label.
 * @csspart header-right - Right month header containing navigation and label.
 * @csspart calendar-left - The full calendar grid for the left month.
 * @csspart calendar-right - The full calendar grid for the right month.
 * @csspart day - Individual day cell within the calendar.
 *
 * @animation date-range-calendar.show - Optional appear animation when the calendar becomes visible.
 * @animation date-range-calendar.hide - Optional disappear animation when the calendar hides.
 *
 * @property startDate - The beginning of the selected range.
 * @property endDate - The end of the selected range.
 * @property focusedDate - The primary month displayed on the left side.
 * @property firstDayOfWeek - The first day of the week (`DaysOfWeek` enum).
 * @property locale - Active locale used for month and weekday labels.
 * @property activeField - Indicates which side the user is setting: `'start'` or `'end'`.
 */
export default class TsDateCalendarRange extends LitElement {
    static override styles: CSSResultGroup = [styles];
    static dependencies = { 'ts-icon-button': TsIconButton };

    /** The beginning of the selected range. */
    @property({ type: Object }) startDate?: Date;
    /** The end of the selected range. */
    @property({ type: Object }) endDate?: Date;
    /** The primary month displayed on the left side of the dual-month view. */
    @property({ type: Object }) focusedDate: Date = new Date();
    /** The first day of the week (0 = Sunday, 1 = Monday, etc.). */
    @property({ type: Number }) firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
    /** BCP 47 locale tag used for month and weekday labels. */
    @property({ type: String }) locale = 'en';
    /** Indicates which side the user is currently setting: `'start'` or `'end'`. */
    @property({ type: String }) activeField: 'start' | 'end' = 'start';

    /** Focus manager instance for handling keyboard navigation. */
    @property({ attribute: false }) focusManager?: DateRangeFocusManager;

    @state() private hoverDate?: Date;

    @state() private keyboardFocusDate?: Date;

    private _today: Date = new Date();
    private _todayStamp = 0;

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }
        // Initialize/refresh the keyboard focus date *before* the update completes
        // so that assigning to `keyboardFocusDate` (a @state) doesn't schedule a
        // second update cycle (which triggers Lit's "scheduled an update after an
        // update completed" warning).
        if (
            changed.has('focusedDate') ||
            changed.has('startDate') ||
            changed.has('endDate') ||
            changed.has('activeField')
        ) {
            this.ensureKeyboardFocusInitialized();
        }
    }

    private getToday(): Date {
        const now = Date.now();
        if (now - this._todayStamp > 1000) {
            this._today = new Date();
            this._todayStamp = now;
        }
        return this._today;
    }

    private _cachedWeekdays: string[] = [];
    private _cachedWeekdayStart = -1;
    private _cachedWeekdaysSource: string[] | null = null;

    private orderedWeekdays(weekdaysShort: string[]): string[] {
        if (
            this._cachedWeekdayStart === this.firstDayOfWeek &&
            this._cachedWeekdaysSource === weekdaysShort &&
            this._cachedWeekdays.length
        ) {
            return this._cachedWeekdays;
        }
        const start = this.firstDayOfWeek;
        this._cachedWeekdays = [...weekdaysShort.slice(start), ...weekdaysShort.slice(0, start)];
        this._cachedWeekdayStart = start;
        this._cachedWeekdaysSource = weekdaysShort;
        return this._cachedWeekdays;
    }

    private _ariaLabelCache = new WeakMap<Date, string>();

    private getAriaLabel(d: Date): string {
        if (this._ariaLabelCache.has(d)) return this._ariaLabelCache.get(d)!;
        const label = d.toLocaleDateString(normalizeLocale(this.locale), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        this._ariaLabelCache.set(d, label);
        return label;
    }

    private _isoDayCache = new WeakMap<Date, string>();

    private isoDay(d: Date): string {
        if (this._isoDayCache.has(d)) return this._isoDayCache.get(d)!;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const iso = `${y}-${m}-${day}`;
        this._isoDayCache.set(d, iso);
        return iso;
    }

    private emitRange(start?: Date, end?: Date) {
        const startFormatted = start ? formatDateByLocale(start, this.locale) : undefined;
        const endFormatted = end ? formatDateByLocale(end, this.locale) : undefined;

        this.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { start: startFormatted, end: endFormatted },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private emitMonth(date: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-month-change', { detail: { focused: date }, bubbles: true, composed: true }),
        );
    }

    private emitNavClick(eventName: 'ts-prev-month-click' | 'ts-next-month-click', date: Date) {
        this.dispatchEvent(
            new CustomEvent(eventName, {
                detail: { focused: date, month: date.getMonth() + 1, year: date.getFullYear() },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private startOfMonth(d: Date) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    private sameMonth(a: Date, b: Date) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    }

    private daysInMonth(d: Date) {
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    }

    private clampDayInMonth(monthDate: Date, day: number) {
        const max = this.daysInMonth(monthDate);
        const dd = Math.min(Math.max(day, 1), max);
        return new Date(monthDate.getFullYear(), monthDate.getMonth(), dd);
    }

    private isInVisibleMonths(date: Date) {
        const left = this.startOfMonth(this.focusedDate);
        const right = this.startOfMonth(addMonths(left, 1));
        const target = this.startOfMonth(date);
        return this.sameMonth(target, left) || this.sameMonth(target, right);
    }

    private getInitialFocusDateForView(focusedLeft: Date): Date {
        if (this.activeField === 'end') {
            if (this.endDate) return this.endDate;
            if (this.startDate) return this.startDate;
        } else {
            if (this.startDate) return this.startDate;
            if (this.endDate) return this.endDate;
        }

        const today = this.getToday();
        const isCurrentMonth =
            focusedLeft.getFullYear() === today.getFullYear() && focusedLeft.getMonth() === today.getMonth();
        if (isCurrentMonth) {
            return today;
        }

        return new Date(focusedLeft.getFullYear(), focusedLeft.getMonth(), 1);
    }

    /** Whether the calendar (or any element in its shadow root) currently has focus. */
    private get hasFocus(): boolean {
        const root = this.renderRoot as ShadowRoot;
        const active = root.activeElement ?? document.activeElement;
        return this === active || root.contains(active as Node);
    }

    private focusDay(date: Date) {
        this.updateComplete.then(() => {
            // Only move focus if the calendar already owns focus.
            // This prevents stealing focus from the input while the user is typing.
            if (!this.hasFocus) return;

            const selector = `button[data-date="${this.isoDay(date)}"]:not([disabled])`;
            const el = this.renderRoot.querySelector(selector) as HTMLButtonElement | null;
            el?.focus();
        });
    }

    /** Public method to focus the current keyboard focus date. Used when dropdown opens. */
    public focusCurrentDay() {
        this.ensureKeyboardFocusInitialized();
        if (this.keyboardFocusDate) {
            this.updateComplete.then(() => {
                const selector = `button[data-date="${this.isoDay(this.keyboardFocusDate!)}"]:not([disabled])`;
                const el = this.renderRoot.querySelector(selector) as HTMLButtonElement | null;
                el?.focus();
            });
        }
    }

    private ensureKeyboardFocusInitialized() {
        const left = this.startOfMonth(this.focusedDate);

        if (!this.keyboardFocusDate) {
            this.keyboardFocusDate = this.getInitialFocusDateForView(left);
            return;
        }

        if (!this.isInVisibleMonths(this.keyboardFocusDate)) {
            this.keyboardFocusDate = this.getInitialFocusDateForView(left);
            return;
        }
    }

    private handleSelect(date: Date) {
        this.keyboardFocusDate = date;

        if (!this.startDate || (this.startDate && this.endDate)) {
            this.startDate = date;
            this.endDate = undefined;
            this.hoverDate = undefined;
            this.emitRange(this.startDate);
        } else if (this.startDate && !this.endDate) {
            if (date < this.startDate) {
                this.startDate = date;
                this.endDate = undefined;
                this.hoverDate = undefined;
                this.emitRange(this.startDate);
            } else {
                this.endDate = date;
                this.hoverDate = undefined;
                this.emitRange(this.startDate, this.endDate);
            }
        }
        this.focusDay(date);
    }

    private handleHover(date: Date) {
        let next: Date | undefined;

        if (this.activeField === 'start' && this.startDate) {
            next = date <= this.startDate ? date : undefined;
        } else if (this.activeField === 'end' && this.endDate) {
            next = date >= this.endDate ? date : undefined;
        } else if (!this.startDate) {
            return;
        } else if (this.startDate && !this.endDate) {
            next = date >= this.startDate ? date : undefined;
        } else if (this.startDate && this.endDate) {
            if (isBetween(date, this.startDate, this.endDate)) {
                next = undefined;
            } else {
                const distToStart = Math.abs(date.getTime() - this.startDate.getTime());
                const distToEnd = Math.abs(date.getTime() - this.endDate.getTime());
                const pickingStart = distToStart < distToEnd;
                next = pickingStart
                    ? date <= this.startDate
                        ? date
                        : undefined
                    : date >= this.endDate
                      ? date
                      : undefined;
            }
        }

        // Only re-render when hoverDate actually changes
        const prevTime = this.hoverDate?.getTime();
        const nextTime = next?.getTime();
        if (prevTime !== nextTime) {
            this.hoverDate = next;
            this.requestUpdate();
        }
    }

    private clearHover() {
        if (this.hoverDate) {
            this.hoverDate = undefined;
            this.requestUpdate();
        }
    }

    private ensureVisible(date: Date) {
        // If arrowing moves outside visible two months, shift view so target month becomes left.
        const left = this.startOfMonth(this.focusedDate);
        const right = this.startOfMonth(addMonths(left, 1));
        const target = this.startOfMonth(date);

        if (this.sameMonth(target, left) || this.sameMonth(target, right)) return;

        this.keyboardFocusDate = date;
        this.emitMonth(target);
    }

    private onDayKeydown(e: KeyboardEvent, current: Date) {
        if (this.focusManager && this.focusManager.isCalendarNavigationKey(e.key)) {
            e.preventDefault();
            e.stopPropagation();

            const next = this.focusManager.getNextDateFromArrowKey(current, e.key as CalendarNavigationKey, e.shiftKey);

            this.keyboardFocusDate = next;

            if (this.focusManager.shouldChangeMonthView(this.focusedDate, next)) {
                const newMonthView = this.focusManager.getMonthViewForDate(next);
                this.emitMonth(newMonthView);
            }

            this.focusDay(next);
            return;
        }

        // ...existing code...
    }

    private onPrevMonthClick = () => {
        const newLeft = addMonths(this.focusedDate, -1);

        // Use focus manager if available
        let targetEl: Date;
        if (this.focusManager) {
            this.focusManager.updateState({
                focusedDate: this.keyboardFocusDate || undefined,
                selectedStartDate: this.startDate || null,
                selectedEndDate: this.endDate || null,
                activeField: this.activeField,
            });
            targetEl = this.focusManager.getFocusedDateAfterMonthChange(newLeft);
        } else {
            // Fallback logic
            if (this.activeField === 'end' && this.endDate) {
                targetEl = this.endDate;
            } else if (this.activeField === 'start' && this.startDate) {
                targetEl = this.startDate;
            } else if (this.keyboardFocusDate) {
                targetEl = this.clampDayInMonth(newLeft, this.keyboardFocusDate.getDate());
            } else {
                const today = this.getToday();
                const isCurrentMonth =
                    newLeft.getFullYear() === today.getFullYear() && newLeft.getMonth() === today.getMonth();
                targetEl = isCurrentMonth ? today : new Date(newLeft.getFullYear(), newLeft.getMonth(), 1);
            }
        }

        this.keyboardFocusDate = targetEl;
        this.emitMonth(newLeft);
        this.emitNavClick('ts-prev-month-click', newLeft);
        this.updateComplete.then(() => this.focusDay(targetEl));
    };

    private onNextMonthClick = () => {
        const newLeft = addMonths(this.focusedDate, 1);

        let targetEl: Date;
        if (this.focusManager) {
            this.focusManager.updateState({
                focusedDate: this.keyboardFocusDate || undefined,
                selectedStartDate: this.startDate || null,
                selectedEndDate: this.endDate || null,
                activeField: this.activeField,
            });
            targetEl = this.focusManager.getFocusedDateAfterMonthChange(newLeft);
        } else {
            if (this.activeField === 'end' && this.endDate) {
                targetEl = this.endDate;
            } else if (this.activeField === 'start' && this.startDate) {
                targetEl = this.startDate;
            } else if (this.keyboardFocusDate) {
                targetEl = this.clampDayInMonth(newLeft, this.keyboardFocusDate.getDate());
            } else {
                const today = this.getToday();
                const isCurrentMonth =
                    newLeft.getFullYear() === today.getFullYear() && newLeft.getMonth() === today.getMonth();
                targetEl = isCurrentMonth ? today : new Date(newLeft.getFullYear(), newLeft.getMonth(), 1);
            }
        }

        this.keyboardFocusDate = targetEl;
        this.emitMonth(newLeft);
        this.emitNavClick('ts-next-month-click', newLeft);
        this.updateComplete.then(() => this.focusDay(targetEl));
    };

    private isToday(date: Date) {
        return isEqual(date, this.getToday());
    }

    private splitWeeks(days: Date[]) {
        const w: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
        return w;
    }

    override firstUpdated() {
        // `keyboardFocusDate` has already been initialized in `willUpdate`,
        // we only need to move DOM focus here.
        if (this.keyboardFocusDate) this.focusDay(this.keyboardFocusDate);
    }

    override updated(changed: Map<string, unknown>) {
        if (changed.has('focusedDate')) {
            if (this.keyboardFocusDate) this.focusDay(this.keyboardFocusDate);
        }
        if (changed.has('locale')) {
            this._ariaLabelCache = new WeakMap();
        }
    }

    private renderDays(monthDate: Date, i18n: CalendarI18n) {
        const days = getViewOfMonth(monthDate, this.firstDayOfWeek);
        const weeks = this.splitWeeks(days);
        const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const isValidFinalRange = !!(
            this.startDate &&
            this.endDate &&
            this.startDate.getTime() <= this.endDate.getTime()
        );

        const focusDate = this.keyboardFocusDate;

        return html`
            <div class="dow">${this.orderedWeekdays(i18n.weekdaysShort).map(w => html`<span>${w}</span>`)}</div>

            <div class="weeks" @mouseleave=${() => this.clearHover()}>
                ${weeks.map(
                    week => html`
                        <div class="week">
                            ${week.map((d, colIndex) => {
                                const muted = !isEqualMonth(d, monthDate);
                                const today = this.isToday(d);

                                const isStart = this.startDate && isEqual(d, this.startDate);
                                const isEnd = this.endDate && isEqual(d, this.endDate);
                                const inFinalRange = isValidFinalRange && isBetween(d, this.startDate!, this.endDate!);

                                const pickingStart =
                                    isValidFinalRange && this.hoverDate && this.hoverDate <= this.startDate!;
                                const pickingEnd =
                                    isValidFinalRange && this.hoverDate && this.hoverDate >= this.endDate!;

                                const inHoverRange =
                                    (!isValidFinalRange &&
                                        this.startDate &&
                                        this.hoverDate &&
                                        isBetween(d, this.startDate, this.hoverDate)) ||
                                    (pickingStart && this.hoverDate && isBetween(d, this.hoverDate, this.startDate!)) ||
                                    (pickingEnd && this.hoverDate && isBetween(d, this.endDate!, this.hoverDate));

                                const hoverEnd =
                                    this.hoverDate &&
                                    ((pickingStart && isEqual(d, this.hoverDate)) ||
                                        (!isValidFinalRange &&
                                            this.startDate &&
                                            this.hoverDate &&
                                            isEqual(d, this.hoverDate)) ||
                                        (pickingEnd && isEqual(d, this.hoverDate)));

                                const firstInRow = colIndex === 0;
                                const lastInRow = colIndex === 6;
                                const isCurrentMonthDay = d.getMonth() === monthDate.getMonth();
                                const isStartOfMonth = isCurrentMonthDay && d.getDate() === 1;
                                const isEndOfMonth = isCurrentMonthDay && d.getDate() === endOfMonth.getDate();

                                let visualRangeStart = false;
                                let visualRangeEnd = false;
                                let visualHoverStart = false;
                                let visualHoverEnd = false;

                                if (inFinalRange || isStart || isEnd) {
                                    if (isStart || firstInRow || isStartOfMonth) visualRangeStart = true;
                                    if (isEnd || lastInRow || isEndOfMonth) visualRangeEnd = true;
                                }

                                if (inHoverRange || hoverEnd) {
                                    if (this.activeField === 'start') {
                                        if (this.hoverDate && isEqual(d, this.hoverDate)) visualHoverStart = true;
                                        if (this.hoverDate && (firstInRow || isStartOfMonth)) visualHoverStart = true;
                                        if (this.startDate && isEqual(d, this.startDate)) visualHoverEnd = true;
                                        if (this.hoverDate && (lastInRow || isEndOfMonth)) visualHoverEnd = true;
                                    } else {
                                        if (isStart || firstInRow || isStartOfMonth) visualHoverStart = true;
                                        if (hoverEnd || lastInRow || isEndOfMonth) visualHoverEnd = true;
                                    }
                                }

                                // Build class string directly to avoid array allocation per cell
                                let cls = 'grid-item';
                                if (muted) cls += ' invisible-day';
                                if (today) cls += ' today';
                                if (inFinalRange || isStart || isEnd) {
                                    cls += ' in-range';
                                    if (isStart) cls += ' range-start';
                                    if (isEnd) cls += ' range-end';
                                    if (inFinalRange && !isStart && !isEnd) cls += ' range-middle';
                                    if (visualRangeStart) cls += ' range-start-visual';
                                    if (visualRangeEnd) cls += ' range-end-visual';
                                }
                                if (inHoverRange || hoverEnd) {
                                    cls += ' hover-in-range';
                                    if (visualHoverStart) cls += ' hover-range-start-visual';
                                    if (visualHoverEnd) cls += ' hover-range-end-visual';
                                    if (!visualHoverStart && !visualHoverEnd) cls += ' hover-range-middle';
                                }
                                if (isStart || isEnd) cls += ' selected';

                                const dateLabel = muted ? '' : this.getAriaLabel(d);
                                const isTabStop = !!(!muted && focusDate && isEqual(d, focusDate));

                                return html`
                                    <button
                                        class=${cls}
                                        data-date=${this.isoDay(d)}
                                        tabindex=${isTabStop ? 0 : -1}
                                        ?disabled=${muted}
                                        @click=${() => {
                                            if (muted) return;
                                            this.keyboardFocusDate = d;
                                            this.handleSelect(d);
                                            this.focusDay(d);
                                        }}
                                        @mouseenter=${() => !muted && this.handleHover(d)}
                                        @keydown=${(e: KeyboardEvent) => {
                                            if (muted) return;
                                            this.onDayKeydown(e, d);
                                        }}
                                        aria-label=${dateLabel || nothing}
                                        aria-hidden=${muted ? 'true' : 'false'}
                                    >
                                        <div class="layer-selected grid-item"></div>
                                        <div class="layer-hover grid-item"></div>
                                        <div class="layer-days grid-item">${muted ? '' : d.getDate()}</div>
                                    </button>
                                `;
                            })}
                        </div>
                    `,
                )}
            </div>
        `;
    }

    override render() {
        const i18n = getCalendarLocale(this.locale) as CalendarI18n;
        const aria = getCalendarAriaLabels(this.locale);
        const monthNames = i18n.months?.length ? i18n.months : i18n.monthsShort;
        const nextMonth = addMonths(this.focusedDate, 1);

        return html`
            <div class="calendar-container">
                <div class="header-left">
                    <ts-icon-button
                        class="prev-month"
                        library="system"
                        name="arrow_back_ios"
                        label=${aria.previousMonth}
                        hover
                        size="20"
                        @click=${this.onPrevMonthClick}
                    ></ts-icon-button>
                    <div class="month-label">
                        ${monthNames[this.focusedDate.getMonth()]} ${this.focusedDate.getFullYear()}
                    </div>
                </div>

                <div class="header-right">
                    <div class="month-label">${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}</div>
                    <ts-icon-button
                        class="next-month"
                        library="system"
                        name="arrow_forward_ios"
                        label=${aria.nextMonth}
                        hover
                        size="20"
                        @click=${this.onNextMonthClick}
                    ></ts-icon-button>
                </div>

                <div class="calendar-left">${this.renderDays(this.focusedDate, i18n)}</div>
                <div class="calendar-right">${this.renderDays(nextMonth, i18n)}</div>

                <div class="divider-vertical"></div>
            </div>
        `;
    }
}
