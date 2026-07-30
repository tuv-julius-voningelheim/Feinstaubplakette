/**
 * Date Range Picker - Focus Management System
 *
 * Centralized focus management logic for date-range picker component.
 * Handles all keyboard navigation, tab order, and focus transitions
 * according to WCAG accessibility guidelines.
 *
 * @module DateRangeFocusManager
 */

export type FocusableElement =
    | 'start-input'
    | 'start-icon'
    | 'end-input'
    | 'end-icon'
    | 'shortcuts'
    | 'prev-month-button'
    | 'next-month-button'
    | 'calendar-day'
    | 'ok-button'
    | 'cancel-button'
    | 'outside';

export type CalendarOpenOrigin = 'start-input' | 'start-icon' | 'end-input' | 'end-icon';

export type CalendarNavigationKey =
    'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End' | 'PageUp' | 'PageDown';

export interface FocusManagerState {
    calendarOpen: boolean;
    calendarOpenOrigin: CalendarOpenOrigin | null;
    activeField: 'start' | 'end';
    hasShortcuts: boolean;
    hasFooterActions: boolean;
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    focusedDate: Date | null;
    rangeSelectionStep: 'selecting-start' | 'selecting-end' | 'complete';
}

export interface FocusTransition {
    from: FocusableElement | null;
    to: FocusableElement;
    reason: 'tab' | 'shift-tab' | 'enter' | 'space' | 'escape' | 'arrow' | 'selection' | 'open' | 'close';
}

export class DateRangeFocusManager {
    private state: FocusManagerState;

    constructor(initialState?: Partial<FocusManagerState>) {
        this.state = {
            calendarOpen: false,
            calendarOpenOrigin: null,
            activeField: 'start',
            hasShortcuts: false,
            hasFooterActions: false,
            selectedStartDate: null,
            selectedEndDate: null,
            focusedDate: null,
            rangeSelectionStep: 'selecting-start',
            ...initialState,
        };
    }

    /**
     * Update the internal state
     */
    public updateState(updates: Partial<FocusManagerState>): void {
        this.state = { ...this.state, ...updates };
    }

    /**
     * Get current state
     */
    public getState(): FocusManagerState {
        return { ...this.state };
    }

    /**
     * Determines next focus target when tabbing with calendar closed
     */
    public getNextFocusWhenClosed(currentFocus: FocusableElement): FocusableElement {
        const sequence: FocusableElement[] = ['start-input', 'start-icon', 'end-input', 'end-icon', 'outside'];

        const currentIndex = sequence.indexOf(currentFocus);
        if (currentIndex === -1 || currentIndex >= sequence.length - 1) {
            return 'outside';
        }

        return sequence[currentIndex + 1] || 'outside';
    }

    /**
     * Determines previous focus target when shift-tabbing with calendar closed
     */
    public getPreviousFocusWhenClosed(currentFocus: FocusableElement): FocusableElement {
        const sequence: FocusableElement[] = ['start-input', 'start-icon', 'end-input', 'end-icon'];

        const currentIndex = sequence.indexOf(currentFocus);
        if (currentIndex <= 0) {
            return 'outside';
        }

        return sequence[currentIndex - 1] || 'outside';
    }

    /**
     * Determines where focus should go when calendar opens
     */
    public getInitialFocusOnOpen(): FocusableElement {
        // Always start at calendar day when opening
        return 'calendar-day';
    }

    /**
     * Determines which date should be focused in the calendar grid
     */
    public getFocusedDateOnOpen(): Date {
        const { activeField, selectedStartDate, selectedEndDate } = this.state;

        if (activeField === 'end' && selectedEndDate) {
            return selectedEndDate;
        }
        if (activeField === 'start' && selectedStartDate) {
            return selectedStartDate;
        }

        if (selectedEndDate) return selectedEndDate;
        if (selectedStartDate) return selectedStartDate;

        return new Date();
    }

    /**
     * Determines which date should be focused after month navigation
     */
    public getFocusedDateAfterMonthChange(newMonthDate: Date): Date {
        const { selectedStartDate, selectedEndDate, activeField, focusedDate } = this.state;

        if (activeField === 'end' && selectedEndDate) {
            const isSameMonth = this.isSameMonth(selectedEndDate, newMonthDate);
            if (isSameMonth) return selectedEndDate;
        }
        if (activeField === 'start' && selectedStartDate) {
            const isSameMonth = this.isSameMonth(selectedStartDate, newMonthDate);
            if (isSameMonth) return selectedStartDate;
        }

        const today = new Date();
        if (this.isSameMonth(today, newMonthDate)) {
            return today;
        }

        if (focusedDate) {
            return this.clampDayInMonth(newMonthDate, focusedDate.getDate());
        }

        return new Date(newMonthDate.getFullYear(), newMonthDate.getMonth(), 1);
    }

    /**
     * Gets the tab order sequence when calendar is open
     */
    private getCalendarTabSequence(): FocusableElement[] {
        const sequence: FocusableElement[] = [];

        if (this.state.hasShortcuts) {
            sequence.push('shortcuts');
        }

        sequence.push('prev-month-button', 'next-month-button');

        sequence.push('calendar-day');

        if (this.state.hasFooterActions) {
            sequence.push('ok-button', 'cancel-button');
        }

        return sequence;
    }

    /**
     * Determines next focus target when tabbing inside open calendar
     */
    public getNextFocusInCalendar(currentFocus: FocusableElement): FocusableElement {
        const sequence = this.getCalendarTabSequence();
        const currentIndex = sequence.indexOf(currentFocus);

        if (currentIndex === -1 || currentIndex >= sequence.length - 1) {
            return 'end-input';
        }

        return sequence[currentIndex + 1] || 'end-input';
    }

    /**
     * Determines previous focus target when shift-tabbing inside open calendar
     */
    public getPreviousFocusInCalendar(currentFocus: FocusableElement): FocusableElement {
        const sequence = this.getCalendarTabSequence();
        const currentIndex = sequence.indexOf(currentFocus);

        if (currentIndex <= 0) {
            return this.state.hasShortcuts ? 'shortcuts' : 'start-input';
        }

        return sequence[currentIndex - 1] || 'start-input';
    }

    /**
     * Determines focus after shortcut selection
     */
    public getFocusAfterShortcutSelection(): FocusableElement {
        if (this.state.hasFooterActions) {
            return 'ok-button';
        }

        return 'outside';
    }

    /**
     * Determines focus after selecting a date in the calendar
     */
    public getFocusAfterDateSelection(selectedDate: Date, isStartDate: boolean): FocusTransition {
        if (isStartDate) {
            // After selecting start date, stay in calendar for end date selection
            this.state.rangeSelectionStep = 'selecting-end';
            return {
                from: 'calendar-day',
                to: 'calendar-day',
                reason: 'selection',
            };
        }

        this.state.rangeSelectionStep = 'complete';

        if (this.state.hasFooterActions) {
            return {
                from: 'calendar-day',
                to: 'ok-button',
                reason: 'selection',
            };
        }

        return {
            from: 'calendar-day',
            to: 'end-input',
            reason: 'selection',
        };
    }

    /**
     * Determines focus target when closing calendar with Escape
     */
    public getFocusAfterEscape(): FocusableElement {
        const { calendarOpenOrigin } = this.state;

        if (calendarOpenOrigin === 'start-input' || calendarOpenOrigin === 'start-icon') {
            return 'start-input';
        }

        return 'end-input';
    }

    /**
     * Determines focus target when closing calendar with OK button.
     *
     * When the user explicitly confirms via the footer OK action, focus
     * should not jump back into the end input — that surprises the user
     * and re-opens the picker on some flows. We release focus instead.
     */
    public getFocusAfterOK(): FocusableElement {
        return 'outside';
    }

    /**
     * Determines focus target when closing calendar with Cancel button.
     *
     * Cancel is an explicit dismiss action; do not bounce focus back to
     * the start/end input (which previously caused the picker to feel
     * "sticky"). Release focus instead.
     */
    public getFocusAfterCancel(): FocusableElement {
        return 'outside';
    }

    /**
     * Calculates the next date when navigating with arrow keys
     */
    public getNextDateFromArrowKey(currentDate: Date, key: CalendarNavigationKey, shift: boolean = false): Date {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        switch (key) {
            case 'ArrowLeft':
                return new Date(year, month, day - 1);

            case 'ArrowRight':
                return new Date(year, month, day + 1);

            case 'ArrowUp':
                return new Date(year, month, day - 7);

            case 'ArrowDown':
                return new Date(year, month, day + 7);

            case 'Home':
                return this.getFirstDayOfWeek(currentDate);

            case 'End':
                return this.getLastDayOfWeek(currentDate);

            case 'PageUp':
                if (shift) {
                    return new Date(year - 1, month, day);
                }
                return this.clampDayInMonth(new Date(year, month - 1, 1), day);

            case 'PageDown':
                if (shift) {
                    return new Date(year + 1, month, day);
                }
                return this.clampDayInMonth(new Date(year, month + 1, 1), day);

            default:
                return currentDate;
        }
    }

    /**
     * Determines if month view should change when navigating to a new date
     */
    public shouldChangeMonthView(currentViewMonth: Date, targetDate: Date): boolean {
        return !this.isSameMonth(currentViewMonth, targetDate);
    }

    /**
     * Gets the month that should be displayed for a given date
     */
    public getMonthViewForDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    private isSameMonth(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
    }

    private clampDayInMonth(monthDate: Date, day: number): Date {
        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
        const clampedDay = Math.min(Math.max(day, 1), daysInMonth);
        return new Date(monthDate.getFullYear(), monthDate.getMonth(), clampedDay);
    }

    private getFirstDayOfWeek(date: Date): Date {
        const dayOfWeek = date.getDay();
        // Assuming Monday (1) is first day of week
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
    }

    private getLastDayOfWeek(date: Date): Date {
        const firstDay = this.getFirstDayOfWeek(date);
        return new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 6);
    }

    /**
     * Determines if a key should open the calendar
     */
    public shouldOpenCalendar(key: string, element: FocusableElement): boolean {
        const openTriggerKeys = ['Enter', ' ', 'ArrowDown'];
        const openTriggerElements: FocusableElement[] = ['start-input', 'start-icon', 'end-input', 'end-icon'];

        return openTriggerKeys.includes(key) && openTriggerElements.includes(element);
    }

    /**
     * Determines if a key should close the calendar
     */
    public shouldCloseCalendar(key: string): boolean {
        return key === 'Escape';
    }

    /**
     * Determines if a key should select a date in the calendar
     */
    public shouldSelectDate(key: string, element: FocusableElement): boolean {
        return (key === 'Enter' || key === ' ') && element === 'calendar-day';
    }

    /**
     * Determines if a key is a calendar navigation key
     */
    public isCalendarNavigationKey(key: string): boolean {
        const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
        return navKeys.includes(key);
    }

    /**
     * Determines if a key is a shortcut navigation key
     */
    public isShortcutNavigationKey(key: string, element: FocusableElement): boolean {
        return element === 'shortcuts' && (key === 'ArrowUp' || key === 'ArrowDown');
    }

    /**
     * Reset manager state when calendar closes
     */
    public resetOnClose(): void {
        this.state.calendarOpen = false;
        this.state.calendarOpenOrigin = null;
        this.state.rangeSelectionStep = 'selecting-start';
    }

    /**
     * Reset manager state when calendar opens
     */
    public resetOnOpen(origin: CalendarOpenOrigin): void {
        this.state.calendarOpen = true;
        this.state.calendarOpenOrigin = origin;
        this.state.rangeSelectionStep = this.state.selectedStartDate ? 'selecting-end' : 'selecting-start';
    }
}
