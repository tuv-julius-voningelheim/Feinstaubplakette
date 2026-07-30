import { type CSSResultGroup, html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { getCalendarAriaLabels, getCalendarLocale, loadCalendarLocale } from '@utils/date/calendar-i18n.js';
import { addMonths, getViewOfMonth, inRange, isEqual, isEqualMonth } from '@utils/date/date-utils.js';
import { normalizeLocale } from '@utils/date/locale.js';
import { DaysOfWeek } from '@utils/date/model.js';

import { buildMeta } from '@components/date-picker/src/events-date.helpers.js';
import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsDateCalendarStyle.js';

type PanelView = 'days' | 'months' | 'years';
type CalendarI18n = { monthsShort: string[]; months: string[]; weekdaysShort: string[] };

/**
 * @summary Calendar UI for selecting dates, months, and years.
 * @documentation https://create.tuvsud.com/latest/components/date-picker/develop-TSyJ1k6n
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-icon-button
 *
 * @event ts-date-select - Emitted when a date is selected. Detail: `{ value, locale, meta }`.
 * @event ts-month-change - Emitted when the visible month changes. Detail: `{ focused: Date }`.
 * @event ts-year-change - Emitted when the visible year changes. Detail: `{ focused: Date }`.
 *
 * @slot - No slots.
 *
 * @property focusedDate - The month/year anchor currently in view.
 * @property selectedDate - The selected date.
 * @property firstDayOfWeek - First weekday (e.g., Monday).
 * @property locale - BCP 47 locale tag.
 * @property min - Minimum selectable date.
 * @property max - Maximum selectable date.
 * @property isDateDisabled - Predicate used to disable specific dates.
 * @property minYear - Minimum selectable year.
 * @property maxYear - Maximum selectable year.
 * @property footerAction - Shows OK/Cancel footer actions.
 */

export default class TsDateCalendar extends LitElement {
    static override styles: CSSResultGroup = [styles];
    static dependencies = { 'ts-icon-button': TsIconButton };

    /** The month/year anchor currently in view; determines which month is displayed. */
    @property({ type: Object, reflect: true, attribute: 'focused-date' }) focusedDate!: Date;
    /** The currently selected date, highlighted in the calendar. */
    @property({ type: Object, reflect: true, attribute: 'selected-date' }) selectedDate?: Date;
    /** The first day of the week (0 = Sunday, 1 = Monday, etc.). */
    @property({ type: Number, reflect: true, attribute: 'first-day-of-week' })
    firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday;
    /** BCP 47 locale tag used for month and weekday labels. */
    @property({ type: String }) locale: string = 'en';
    /** The minimum selectable date boundary. */
    @property({ type: Object }) min?: Date;
    /** The maximum selectable date boundary. */
    @property({ type: Object }) max?: Date;
    /** Predicate function used to disable specific dates from selection. */
    @property({ attribute: false }) isDateDisabled: (d: Date) => boolean = () => false;
    /** The minimum selectable year in the year picker panel. */
    @property({ type: Number, reflect: true, attribute: 'min-year' }) minYear?: number;
    /** The maximum selectable year in the year picker panel. */
    @property({ type: Number, reflect: true, attribute: 'max-year' }) maxYear?: number;

    /** Shows OK/Cancel footer actions. The selection is only confirmed on OK click. */
    @property({ type: Boolean, reflect: true, attribute: 'footer-action' }) footerAction = false;

    @state() private view: PanelView = 'days';
    @query('.years-panel') private yearsPanel!: HTMLElement | null;

    /**
     * Roving tabindex anchor for DAYS view.
     * Exactly one enabled day button should get tabindex=0.
     */
    @state() private keyboardFocusDate?: Date;

    /** Roving tabindex anchor index for MONTHS view (0-11). */
    @state() private keyboardFocusMonthIndex?: number;

    /** Roving tabindex anchor year for YEARS view. */
    @state() private keyboardFocusYear?: number;

    resetView() {
        this.view = 'days';
    }

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }

        // Initialize roving-focus anchors BEFORE render so we don't have to
        // mutate reactive @state from render()/updated(), which would trigger
        // Lit's "change-in-update" warning.
        if (!this.hasUpdated || changed.has('view') || changed.has('focusedDate') || changed.has('selectedDate')) {
            if (this.view === 'days') {
                this.ensureKeyboardFocusInitialized();
            }
            if (this.view === 'months' && this.keyboardFocusMonthIndex === undefined) {
                this.keyboardFocusMonthIndex = this.getInitialFocusMonthIndex();
            }
            if (this.view === 'years' && this.keyboardFocusYear === undefined) {
                this.keyboardFocusYear = this.getInitialFocusYear(this.yearsRange());
            }
        }
    }

    private splitIntoWeeks(days: Date[]): Date[][] {
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }

    private emitSelect(d: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-date-select', {
                detail: {
                    value: d,
                    locale: this.locale,
                    meta: buildMeta(d, this.locale),
                },
                bubbles: true,
                composed: false,
            }),
        );
    }

    private emitMonth(d: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-month-change', { detail: { focused: d }, bubbles: true, composed: false }),
        );
    }

    private emitYear(d: Date) {
        this.dispatchEvent(
            new CustomEvent('ts-year-change', { detail: { focused: d }, bubbles: true, composed: false }),
        );
    }

    private orderedWeekdays(weekdaysShort: string[]) {
        const start = this.firstDayOfWeek;
        const arr = [...weekdaysShort];
        return [...arr.slice(start), ...arr.slice(0, start)];
    }

    private bounds() {
        const minY = this.minYear ?? this.min?.getFullYear() ?? 1900;
        const maxY = this.maxYear ?? this.max?.getFullYear() ?? 2100;
        return [Math.min(minY, maxY), Math.max(minY, maxY)] as const;
    }

    private monthDisabled(year: number, month: number) {
        const [minY, maxY] = this.bounds();
        if (year < minY || year > maxY) return true;
        const first = new Date(year, month, 1);
        const last = new Date(year, month + 1, 0);
        const minOk = !this.min || last >= new Date(this.min.getFullYear(), this.min.getMonth(), 1);
        const maxOk = !this.max || first <= new Date(this.max.getFullYear(), this.max.getMonth(), 1);
        return !(minOk && maxOk);
    }

    private yearDisabled(y: number) {
        const [minY, maxY] = this.bounds();
        const inClamp = y >= minY && y <= maxY;
        const minOk = !this.min || y >= this.min.getFullYear();
        const maxOk = !this.max || y <= this.max.getFullYear();
        return !(inClamp && minOk && maxOk);
    }

    private yearsRange() {
        const [minY, maxY] = this.bounds();
        const out: number[] = [];
        for (let y = minY; y <= maxY; y++) out.push(y);
        return out;
    }

    private pickMonth(m: number) {
        const fd = this.focusedDate ?? new Date();
        const d = new Date(fd.getFullYear(), m, 1);
        this.focusedDate = d;
        this.emitMonth(d);
        this.view = 'days';

        // When switching back to DAYS, initialize a sensible roving focus target.
        this.keyboardFocusDate = undefined;
        this.ensureKeyboardFocusInitialized();
        if (this.keyboardFocusDate) this.focusDay(this.keyboardFocusDate);
    }

    private pickYear(y: number) {
        const fd = this.focusedDate ?? new Date();
        const d = new Date(y, fd.getMonth(), 1);
        this.focusedDate = d;
        this.emitYear(d);
        this.view = 'months';
    }

    private scrollYearIntoView() {
        if (!this.yearsPanel) return;
        const targetYear = (this.selectedDate ?? this.focusedDate ?? new Date()).getFullYear();
        const btn =
            this.yearsPanel.querySelector<HTMLButtonElement>(`button[data-year="${targetYear}"]`) ??
            this.yearsPanel.querySelector<HTMLButtonElement>('button[aria-selected="true"]');
        btn?.scrollIntoView({ block: 'center' });
    }

    private startOfMonth(d: Date) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    private sameMonth(a: Date, b: Date) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    }

    private isoDay(d: Date) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    private isDayDisabled(d: Date) {
        return !inRange(d, this.min, this.max) || this.isDateDisabled(d);
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

    private firstEnabledDayInFocusedMonth(): Date | undefined {
        const fd = this.focusedDate ?? new Date();
        const days: Date[] = getViewOfMonth(fd, this.firstDayOfWeek);
        for (const d of days) {
            if (!isEqualMonth(d, fd)) continue;
            if (!this.isDayDisabled(d)) return d;
        }
        return undefined;
    }

    private getInitialFocusDateForView(): Date | undefined {
        const fd = this.focusedDate ?? new Date();
        if (this.selectedDate && isEqualMonth(this.selectedDate, fd) && !this.isDayDisabled(this.selectedDate)) {
            return this.selectedDate;
        }

        const t = new Date();
        const todayInThisMonth =
            t.getFullYear() === fd.getFullYear() && t.getMonth() === fd.getMonth()
                ? new Date(t.getFullYear(), t.getMonth(), t.getDate())
                : undefined;

        if (todayInThisMonth && !this.isDayDisabled(todayInThisMonth)) return todayInThisMonth;

        // Else first enabled day in month
        return this.firstEnabledDayInFocusedMonth();
    }

    private ensureKeyboardFocusInitialized() {
        if (this.view !== 'days') return;
        const fd = this.focusedDate ?? new Date();

        if (!this.keyboardFocusDate) {
            this.keyboardFocusDate = this.getInitialFocusDateForView();
            return;
        }

        if (this.isDayDisabled(this.keyboardFocusDate)) {
            this.keyboardFocusDate = this.getInitialFocusDateForView();
            return;
        }

        if (!isEqualMonth(this.keyboardFocusDate, fd)) {
            this.keyboardFocusDate = this.getInitialFocusDateForView();
            return;
        }
    }

    private ensureVisible(target: Date) {
        const fd = this.focusedDate ?? new Date();
        if (!isEqualMonth(target, fd)) {
            this.keyboardFocusDate = target;
            this.emitMonth(this.startOfMonth(target));
            return;
        }
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
                return; // do not trap Tab
        }

        e.preventDefault();
        e.stopPropagation();

        const step = next.getTime() - current.getTime();
        let candidate = next;
        for (let i = 0; i < 62; i++) {
            if (!this.isDayDisabled(candidate)) break;
            candidate = new Date(candidate.getTime() + step);
        }

        this.keyboardFocusDate = candidate;
        this.ensureVisible(candidate);
        this.focusDay(candidate);
    }

    // Helpers to compute initial keyboard anchors for months/years
    private getInitialFocusMonthIndex(): number | undefined {
        const focused = this.focusedDate ?? new Date();
        const currentIndex = focused.getMonth();
        if (!this.monthDisabled(focused.getFullYear(), currentIndex)) return currentIndex;

        // Fall back to first enabled month in year
        for (let i = 0; i < 12; i++) {
            if (!this.monthDisabled(focused.getFullYear(), i)) return i;
        }
        return undefined;
    }

    private getInitialFocusYear(years: number[]): number | undefined {
        const focused = this.focusedDate ?? new Date();
        const y = focused.getFullYear();
        if (!this.yearDisabled(y)) return y;
        // Fall back to first enabled in years list
        for (const candidate of years) {
            if (!this.yearDisabled(candidate)) return candidate;
        }
        return undefined;
    }

    private onMonthKeydown(e: KeyboardEvent, currentIndex: number) {
        let nextIndex: number | undefined;

        switch (e.key) {
            case 'ArrowLeft':
                nextIndex = (currentIndex + 11) % 12;
                break;
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % 12;
                break;
            case 'ArrowUp':
                nextIndex = (currentIndex + 12 - 3) % 12; // 4 columns grid => move 3 back
                break;
            case 'ArrowDown':
                nextIndex = (currentIndex + 3) % 12;
                break;
            default:
                return; // allow Tab and others to bubble
        }

        e.preventDefault();
        e.stopPropagation();

        const focused = this.focusedDate ?? new Date();
        // Skip disabled months, try up to 12 times
        let candidate = nextIndex;
        for (let i = 0; i < 12; i++) {
            if (candidate === undefined) break;
            if (!this.monthDisabled(focused.getFullYear(), candidate)) break;
            candidate = (candidate + 1) % 12;
        }

        if (candidate === undefined) return;
        this.keyboardFocusMonthIndex = candidate;

        this.updateComplete.then(() => {
            if (!this.hasFocus) return;
            const buttons = this.renderRoot.querySelectorAll<HTMLButtonElement>('.months-panel .grid-item');
            const btn = buttons[candidate!];
            btn?.focus();
        });
    }

    private onYearKeydown(e: KeyboardEvent, currentYear: number) {
        let nextYear: number | undefined;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                nextYear = currentYear - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                nextYear = currentYear + 1;
                break;
            default:
                return; // allow Tab and others to bubble
        }

        e.preventDefault();
        e.stopPropagation();

        // Skip disabled years, but keep within bounds
        const [minY, maxY] = this.bounds();
        let candidate = nextYear;
        for (let i = 0; i < maxY - minY + 1; i++) {
            if (candidate === undefined) break;
            if (candidate < minY || candidate > maxY) break;
            if (!this.yearDisabled(candidate)) break;
            candidate += nextYear! > currentYear ? 1 : -1;
        }

        if (candidate === undefined || candidate < minY || candidate > maxY) return;
        this.keyboardFocusYear = candidate;

        this.updateComplete.then(() => {
            if (!this.hasFocus) return;
            const btn = this.renderRoot.querySelector<HTMLButtonElement>(
                `.years-panel button[data-year="${candidate}"]`,
            );
            btn?.focus();
        });
    }

    protected override updated(changed: Map<string, unknown>) {
        if (changed.has('view') && this.view === 'years') {
            queueMicrotask(() => this.scrollYearIntoView());
        }
        if ((changed.has('selectedDate') || changed.has('focusedDate')) && this.view === 'years') {
            queueMicrotask(() => this.scrollYearIntoView());
        }

        // Roving focus anchors are now initialized in willUpdate(); here we
        // only move DOM focus to the anchor after the calendar has rendered.
        if (changed.has('focusedDate') && this.view === 'days' && this.keyboardFocusDate) {
            this.focusDay(this.keyboardFocusDate);
        }
    }

    override render() {
        const i18n = getCalendarLocale(this.locale) as CalendarI18n;
        const aria = getCalendarAriaLabels(this.locale);
        const monthNames = (i18n.months?.length ? i18n.months : i18n.monthsShort) as string[];

        const focused = this.focusedDate ?? new Date();
        const days: Date[] = getViewOfMonth(focused, this.firstDayOfWeek);
        const inMonth = (d: Date) => isEqualMonth(d, focused);

        const isToday = (d: Date) => {
            const t = new Date();
            return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
        };

        const years: number[] = this.yearsRange();

        // Roving focus anchors are initialized in willUpdate() to avoid
        // "change-in-update" warnings from mutating @state inside render().

        return html`
            <div class=${'date-month' + (this.footerAction ? '' : ' footer-action')}>
                <div class="header">
                    <div class="selectors">
                        <button
                            class="selector-btn selector-btn-month"
                            aria-label=${aria.selectMonth}
                            @click=${() => (this.view = this.view === 'months' ? 'days' : 'months')}
                        >
                            ${monthNames[focused.getMonth()]}
                        </button>
                        <button
                            class="selector-btn selector-btn-year"
                            aria-label=${aria.selectYear}
                            @click=${() => (this.view = this.view === 'years' ? 'days' : 'years')}
                        >
                            ${focused.getFullYear()}
                            <ts-icon
                                class="selector-icon"
                                library="system"
                                name="keyboard_arrow_down"
                                size="24"
                            ></ts-icon>
                        </button>
                    </div>

                    <div class="nav">
                        <ts-icon-button
                            @click=${() => this.emitMonth(addMonths(focused, -1))}
                            class="prev-month"
                            library="system"
                            name="arrow_back_ios"
                            size="20"
                            hover
                            aria-label=${aria.previousMonth}
                            ?disabled=${this.view !== 'days'}
                        ></ts-icon-button>
                        <ts-icon-button
                            @click=${() => this.emitMonth(addMonths(focused, 1))}
                            class="next-month"
                            library="system"
                            name="arrow_forward_ios"
                            size="20"
                            hover
                            aria-label=${aria.nextMonth}
                            ?disabled=${this.view !== 'days'}
                        ></ts-icon-button>
                    </div>
                </div>

                <div class="content">
                    ${
                        this.view === 'years'
                            ? html`
                                  <div class="panel years-panel" role="listbox" aria-label=${aria.selectYear}>
                                      ${years.map((y: number) => {
                                          const disabled = this.yearDisabled(y);
                                          const selected = y === focused.getFullYear();
                                          const isTabStop =
                                              this.keyboardFocusYear !== undefined &&
                                              this.keyboardFocusYear === y &&
                                              !disabled;
                                          return html`
                                              <button
                                                  class="grid-item"
                                                  data-year=${y}
                                                  role="option"
                                                  aria-selected=${String(selected)}
                                                  tabindex=${isTabStop ? 0 : -1}
                                                  ?disabled=${disabled}
                                                  @click=${() => !disabled && this.pickYear(y)}
                                                  @keydown=${(e: KeyboardEvent) => {
                                                      if (disabled) return;
                                                      this.onYearKeydown(e, y);
                                                  }}
                                              >
                                                  ${y}
                                              </button>
                                          `;
                                      })}
                                  </div>
                              `
                            : this.view === 'months'
                              ? html`
                                    <div class="months-view">
                                        <div class="panel months-panel" role="listbox" aria-label=${aria.selectMonth}>
                                            ${monthNames.map((m: string, i: number) => {
                                                const disabled = this.monthDisabled(focused.getFullYear(), i);
                                                const selected = i === focused.getMonth();
                                                const isTabStop =
                                                    this.keyboardFocusMonthIndex !== undefined &&
                                                    this.keyboardFocusMonthIndex === i &&
                                                    !disabled;
                                                return html`
                                                    <button
                                                        role="option"
                                                        class="grid-item"
                                                        aria-selected=${String(selected)}
                                                        tabindex=${isTabStop ? 0 : -1}
                                                        ?disabled=${disabled}
                                                        @click=${() => !disabled && this.pickMonth(i)}
                                                        @keydown=${(e: KeyboardEvent) => {
                                                            if (disabled) return;
                                                            this.onMonthKeydown(e, i);
                                                        }}
                                                    >
                                                        ${i18n.monthsShort ? i18n.monthsShort[i] : m.slice(0, 3)}
                                                    </button>
                                                `;
                                            })}
                                        </div>
                                    </div>
                                `
                              : html`
                                    <div
                                        class="grid"
                                        role="grid"
                                        aria-label="${monthNames[focused.getMonth()]} ${focused.getFullYear()}"
                                    >
                                        <div role="rowgroup">
                                            <div class="dow" role="row" aria-label=${aria.weekdays}>
                                                ${this.orderedWeekdays(i18n.weekdaysShort).map(
                                                    (w: string) => html`<span role="columnheader">${w}</span>`,
                                                )}
                                            </div>
                                        </div>
                                        <div role="rowgroup">
                                            ${this.splitIntoWeeks(days).map(
                                                (week: Date[]) => html`
                                                    <div class="week" role="row">
                                                        ${week.map((d: Date) => {
                                                            const disabled = this.isDayDisabled(d);
                                                            const muted = !inMonth(d);
                                                            const selected = this.selectedDate
                                                                ? isEqual(d, this.selectedDate)
                                                                : false;
                                                            const current = isToday(d);

                                                            const dateLabel = d.toLocaleDateString(
                                                                normalizeLocale(this.locale),
                                                                {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                },
                                                            );

                                                            // Roving tabindex: only the anchor gets tabindex=0 (and must be enabled)
                                                            const isTabStop =
                                                                !!this.keyboardFocusDate &&
                                                                isEqual(d, this.keyboardFocusDate) &&
                                                                !disabled;

                                                            return html`
                                                                <button
                                                                    role="gridcell"
                                                                    class=${muted ? 'muted grid-item' : 'grid-item'}
                                                                    data-date=${this.isoDay(d)}
                                                                    tabindex=${isTabStop ? 0 : -1}
                                                                    aria-selected=${String(selected)}
                                                                    aria-current=${current ? 'date' : 'false'}
                                                                    aria-label=${dateLabel}
                                                                    ?disabled=${disabled}
                                                                    @click=${() => {
                                                                        if (disabled) return;
                                                                        this.keyboardFocusDate = d;
                                                                        this.emitSelect(d);
                                                                        this.focusDay(d);
                                                                    }}
                                                                    @keydown=${(e: KeyboardEvent) => {
                                                                        if (disabled) return;
                                                                        this.onDayKeydown(e, d);
                                                                    }}
                                                                >
                                                                    ${d.getDate()}
                                                                </button>
                                                            `;
                                                        })}
                                                    </div>
                                                `,
                                            )}
                                        </div>
                                    </div>
                                `
                    }
                </div>
            </div>
        `;
    }
}
