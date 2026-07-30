import { type CSSResultGroup, html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { getCalendarAriaLabels, getCalendarLocale, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { addMonths, getViewOfMonth, isBetween, isEqual, isEqualMonth } from '@utils/date/date-utils.js';
import { normalizeLocale } from '@utils/date/locale.js';
import { DaysOfWeek } from '@utils/date/model.js';

import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsDateCalendarRangeMobileStyle.js';

type CalendarI18n = { monthsShort: string[]; months: string[]; weekdaysShort: string[] };

/**
 * @summary Mobile-optimized calendar for selecting a date range, used inside the mobile date-range dialog.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 *
 * @slot - This component has no user-facing slots. All structure is internally rendered.
 *
 * @event ts-date-range-select - Emitted when the user selects a date or completes a range. Provides `{ start, end }`.
 * @event ts-month-change - Emitted when the displayed month changes. Provides `{ focused }`.
 *
 * @property startDate - Currently selected start date.
 * @property endDate - Currently selected end date.
 * @property focusedDate - The month/day currently displayed in the calendar.
 * @property firstDayOfWeek - The first day of the week (`DaysOfWeek` enum).
 * @property locale - Locale for month, weekday names, and formatting.
 * @property activeField - Which field is being selected: `'start'` or `'end'`.
 */
export default class TsDateCalendarRangeMobile extends LitElement {
    static override styles: CSSResultGroup = [styles];
    static dependencies = { 'ts-icon-button': TsIconButton };

    @property({ type: Object }) startDate?: Date;
    @property({ type: Object }) endDate?: Date;
    @property({ type: Object }) focusedDate: Date = new Date();
    @property({ type: Number }) firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
    @property({ type: String }) locale = 'en';
    @property({ type: String }) activeField: 'start' | 'end' = 'start';

    @state() private hoverDate?: Date;
    @state() private keyboardFocusDate?: Date;

    private _today: Date = new Date();
    private _todayStamp = 0;

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }

        // Keep keyboardFocusDate in sync with the visible month / selection
        // BEFORE render so we don't have to mutate reactive @state from
        // updated()/firstUpdated() — which would trigger Lit's
        // "change-in-update" warning.
        if (
            !this.hasUpdated ||
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
        const s = this.firstDayOfWeek;
        this._cachedWeekdays = [...weekdaysShort.slice(s), ...weekdaysShort.slice(0, s)];
        this._cachedWeekdayStart = s;
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
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        this._isoDayCache.set(d, iso);
        return iso;
    }

    private emitRange(start?: Date, end?: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-date-range-select', { detail: { start, end }, bubbles: true, composed: true }),
        );
    }

    private emitMonth(date: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-month-change', { detail: { focused: date }, bubbles: true, composed: true }),
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
        const dd = Math.min(Math.max(day, 1), this.daysInMonth(monthDate));
        return new Date(monthDate.getFullYear(), monthDate.getMonth(), dd);
    }

    private getInitialFocusDateForView(month: Date): Date {
        if (this.activeField === 'end') {
            if (this.endDate) return this.endDate;
            if (this.startDate) return this.startDate;
        } else {
            if (this.startDate) return this.startDate;
            if (this.endDate) return this.endDate;
        }
        return this.clampDayInMonth(month, this.getToday().getDate());
    }

    private get hasFocus(): boolean {
        const root = this.renderRoot as ShadowRoot;
        const active = root.activeElement ?? document.activeElement;
        return this === active || root.contains(active as Node);
    }

    private focusDay(date: Date) {
        this.updateComplete.then(() => {
            if (!this.hasFocus) return;
            (
                this.renderRoot.querySelector(`button[data-date="${this.isoDay(date)}"]`) as HTMLButtonElement | null
            )?.focus();
        });
    }

    private ensureKeyboardFocusInitialized() {
        const month = this.startOfMonth(this.focusedDate);
        if (!this.keyboardFocusDate || !this.sameMonth(this.startOfMonth(this.keyboardFocusDate), month)) {
            this.keyboardFocusDate = this.getInitialFocusDateForView(month);
        }
    }

    private handleSelect(date: Date) {
        this.keyboardFocusDate = date;
        if (!this.startDate || (this.startDate && this.endDate)) {
            this.startDate = date;
            this.endDate = undefined;
            this.hoverDate = undefined;
            this.emitRange(this.startDate);
        } else {
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
    }

    private handleHover(date: Date) {
        let next: Date | undefined;
        if (this.activeField === 'start' && this.startDate) {
            next = date <= this.startDate ? date : undefined;
        } else if (this.activeField === 'end' && this.endDate) {
            next = date >= this.endDate ? date : undefined;
        } else if (!this.startDate) {
            return;
        } else if (!this.endDate) {
            next = date >= this.startDate ? date : undefined;
        } else {
            if (isBetween(date, this.startDate, this.endDate)) {
                next = undefined;
            } else {
                const dS = Math.abs(date.getTime() - this.startDate.getTime());
                const dE = Math.abs(date.getTime() - this.endDate.getTime());
                next = dS < dE ? (date <= this.startDate ? date : undefined) : date >= this.endDate ? date : undefined;
            }
        }
        if (this.hoverDate?.getTime() !== next?.getTime()) {
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
        const cur = this.startOfMonth(this.focusedDate);
        const tgt = this.startOfMonth(date);
        if (this.sameMonth(tgt, cur)) return;
        this.keyboardFocusDate = date;
        this.focusedDate = tgt; // @property — triggers update
        this.emitMonth(this.focusedDate);
    }

    private onDayKeydown(e: KeyboardEvent, current: Date) {
        let next: Date | undefined;
        switch (e.key) {
            case 'ArrowLeft':
                next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
                break;
            case 'ArrowRight':
                next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
                break;
            case 'ArrowUp':
                next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
                break;
            case 'ArrowDown':
                next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
                break;
            default:
                return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.keyboardFocusDate = next;
        this.ensureVisible(next);
        this.focusDay(next);
    }

    private onPrevMonthClick = () => {
        const newMonth = addMonths(this.focusedDate, -1);
        const target = this.keyboardFocusDate
            ? this.clampDayInMonth(newMonth, this.keyboardFocusDate.getDate())
            : this.getInitialFocusDateForView(newMonth);
        this.keyboardFocusDate = target;
        this.focusedDate = this.startOfMonth(newMonth); // @property — no requestUpdate needed
        this.emitMonth(this.focusedDate);
        this.focusDay(target);
    };

    private onNextMonthClick = () => {
        const newMonth = addMonths(this.focusedDate, 1);
        const target = this.keyboardFocusDate
            ? this.clampDayInMonth(newMonth, this.keyboardFocusDate.getDate())
            : this.getInitialFocusDateForView(newMonth);
        this.keyboardFocusDate = target;
        this.focusedDate = this.startOfMonth(newMonth); // @property — no requestUpdate needed
        this.emitMonth(this.focusedDate);
        this.focusDay(target);
    };

    private isToday(date: Date) {
        return isEqual(date, this.getToday());
    }

    private splitWeeks(days: Date[]) {
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
        return weeks;
    }

    override firstUpdated() {
        // keyboardFocusDate is already initialized in willUpdate(); here we only
        // focus the matching day button after the DOM has rendered.
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
        const isValidFinalRange = !!(this.startDate && this.endDate);
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
                                const inFinalRange =
                                    this.startDate && this.endDate && isBetween(d, this.startDate, this.endDate);
                                const pickingStart =
                                    this.startDate &&
                                    this.endDate &&
                                    this.hoverDate &&
                                    this.hoverDate <= this.startDate;
                                const pickingEnd =
                                    this.startDate && this.endDate && this.hoverDate && this.hoverDate >= this.endDate;
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
                                const isCurMonth = d.getMonth() === monthDate.getMonth();
                                const isStartOfMonth = isCurMonth && d.getDate() === 1;
                                const isEndOfMonth = isCurMonth && d.getDate() === endOfMonth.getDate();

                                let vRS = false,
                                    vRE = false,
                                    vHS = false,
                                    vHE = false;
                                if (inFinalRange || isStart || isEnd) {
                                    if (isStart || firstInRow || isStartOfMonth) vRS = true;
                                    if (isEnd || lastInRow || isEndOfMonth) vRE = true;
                                }
                                if (inHoverRange || hoverEnd) {
                                    if (this.activeField === 'start') {
                                        if (this.hoverDate && isEqual(d, this.hoverDate)) vHS = true;
                                        if (this.hoverDate && (firstInRow || isStartOfMonth)) vHS = true;
                                        if (this.startDate && isEqual(d, this.startDate)) vHE = true;
                                        if (this.hoverDate && (lastInRow || isEndOfMonth)) vHE = true;
                                    } else {
                                        if (isStart || firstInRow || isStartOfMonth) vHS = true;
                                        if (hoverEnd || lastInRow || isEndOfMonth) vHE = true;
                                    }
                                }

                                // Build class string directly — avoids array allocation per cell
                                let cls = 'grid-item';
                                if (muted) cls += ' invisible-day';
                                if (today) cls += ' today';
                                if (inFinalRange || isStart || isEnd) {
                                    cls += ' in-range';
                                    if (isStart) cls += ' range-start';
                                    if (isEnd) cls += ' range-end';
                                    if (inFinalRange && !isStart && !isEnd) cls += ' range-middle';
                                    if (vRS) cls += ' range-start-visual';
                                    if (vRE) cls += ' range-end-visual';
                                }
                                if (inHoverRange || hoverEnd) {
                                    cls += ' hover-in-range';
                                    if (vHS) cls += ' hover-range-start-visual';
                                    if (vHE) cls += ' hover-range-end-visual';
                                    if (!vHS && !vHE) cls += ' hover-range-middle';
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
                                        <div class="layer-selected"></div>
                                        <div class="layer-hover"></div>
                                        <div class="layer-days">${muted ? '' : d.getDate()}</div>
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

        return html`
            <div class="calendar-container">
                <div class="header">
                    <div class="month-label">
                        ${monthNames[this.focusedDate.getMonth()]} ${this.focusedDate.getFullYear()}
                    </div>
                    <div class="nav">
                        <ts-icon-button
                            library="system"
                            name="arrow_back_ios"
                            size="20"
                            class="previous-month"
                            aria-label=${aria.previousMonth}
                            hover
                            @click=${this.onPrevMonthClick}
                        ></ts-icon-button>
                        <ts-icon-button
                            library="system"
                            name="arrow_forward_ios"
                            size="20"
                            class="next-month"
                            aria-label=${aria.nextMonth}
                            hover
                            @click=${this.onNextMonthClick}
                        ></ts-icon-button>
                    </div>
                </div>

                <div class="calendar">${this.renderDays(this.focusedDate, i18n)}</div>
            </div>
        `;
    }
}
