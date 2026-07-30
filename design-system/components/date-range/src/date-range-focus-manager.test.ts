import { expect } from '@open-wc/testing';

import { DateRangeFocusManager, type FocusableElement, type FocusManagerState } from './date-range-focus-manager.js';

describe('DateRangeFocusManager', () => {
    let focusManager: DateRangeFocusManager;

    beforeEach(() => {
        focusManager = new DateRangeFocusManager();
    });

    describe('Initialization', () => {
        it('should initialize with default state', () => {
            const state = focusManager.getState();
            expect(state.calendarOpen).to.be.false;
            expect(state.calendarOpenOrigin).to.be.null;
            expect(state.activeField).to.equal('start');
            expect(state.hasShortcuts).to.be.false;
            expect(state.hasFooterActions).to.be.false;
            expect(state.selectedStartDate).to.be.null;
            expect(state.selectedEndDate).to.be.null;
            expect(state.rangeSelectionStep).to.equal('selecting-start');
        });

        it('should initialize with partial state', () => {
            const initialState: Partial<FocusManagerState> = {
                activeField: 'end',
                hasShortcuts: true,
                selectedStartDate: new Date(2024, 0, 1),
            };
            const fm = new DateRangeFocusManager(initialState);
            const state = fm.getState();

            expect(state.activeField).to.equal('end');
            expect(state.hasShortcuts).to.be.true;
            expect(state.selectedStartDate).to.deep.equal(new Date(2024, 0, 1));
            expect(state.calendarOpen).to.be.false; // default value
        });
    });

    describe('State Management', () => {
        it('should update state', () => {
            focusManager.updateState({
                calendarOpen: true,
                activeField: 'end',
            });

            const state = focusManager.getState();
            expect(state.calendarOpen).to.be.true;
            expect(state.activeField).to.equal('end');
        });

        it('should preserve unmodified state properties', () => {
            focusManager.updateState({ hasShortcuts: true });
            focusManager.updateState({ hasFooterActions: true });

            const state = focusManager.getState();
            expect(state.hasShortcuts).to.be.true;
            expect(state.hasFooterActions).to.be.true;
        });
    });

    describe('Case 1: Tab Navigation When Closed', () => {
        it('should navigate forward through inputs', () => {
            expect(focusManager.getNextFocusWhenClosed('start-input')).to.equal('start-icon');
            expect(focusManager.getNextFocusWhenClosed('start-icon')).to.equal('end-input');
            expect(focusManager.getNextFocusWhenClosed('end-input')).to.equal('end-icon');
            expect(focusManager.getNextFocusWhenClosed('end-icon')).to.equal('outside');
        });

        it('should navigate backward through inputs', () => {
            expect(focusManager.getPreviousFocusWhenClosed('end-icon')).to.equal('end-input');
            expect(focusManager.getPreviousFocusWhenClosed('end-input')).to.equal('start-icon');
            expect(focusManager.getPreviousFocusWhenClosed('start-icon')).to.equal('start-input');
            expect(focusManager.getPreviousFocusWhenClosed('start-input')).to.equal('outside');
        });
    });

    describe('Case 2 & 3: Initial Focus on Open', () => {
        it('should focus calendar day when opening', () => {
            const initialFocus = focusManager.getInitialFocusOnOpen();
            expect(initialFocus).to.equal('calendar-day');
        });

        it('should focus selected start date when activeField is start', () => {
            const startDate = new Date(2024, 5, 15);
            focusManager.updateState({
                activeField: 'start',
                selectedStartDate: startDate,
            });

            const focusedDate = focusManager.getFocusedDateOnOpen();
            expect(focusedDate).to.deep.equal(startDate);
        });

        it('should focus selected end date when activeField is end', () => {
            const endDate = new Date(2024, 5, 20);
            focusManager.updateState({
                activeField: 'end',
                selectedEndDate: endDate,
            });

            const focusedDate = focusManager.getFocusedDateOnOpen();
            expect(focusedDate).to.deep.equal(endDate);
        });

        it('should focus start date when end is active but no end date selected', () => {
            const startDate = new Date(2024, 5, 15);
            focusManager.updateState({
                activeField: 'end',
                selectedStartDate: startDate,
                selectedEndDate: null,
            });

            const focusedDate = focusManager.getFocusedDateOnOpen();
            expect(focusedDate).to.deep.equal(startDate);
        });

        it('should focus today when no dates selected', () => {
            const focusedDate = focusManager.getFocusedDateOnOpen();
            const today = new Date();

            expect(focusedDate.getDate()).to.equal(today.getDate());
            expect(focusedDate.getMonth()).to.equal(today.getMonth());
            expect(focusedDate.getFullYear()).to.equal(today.getFullYear());
        });
    });

    describe('Case 4 & 5: Tab Navigation Inside Calendar', () => {
        it('should navigate through calendar without shortcuts', () => {
            focusManager.updateState({ hasShortcuts: false, hasFooterActions: false });

            expect(focusManager.getNextFocusInCalendar('prev-month-button')).to.equal('next-month-button');
            expect(focusManager.getNextFocusInCalendar('next-month-button')).to.equal('calendar-day');
            expect(focusManager.getNextFocusInCalendar('calendar-day')).to.equal('end-input');
        });

        it('should navigate through calendar with shortcuts', () => {
            focusManager.updateState({ hasShortcuts: true, hasFooterActions: false });

            expect(focusManager.getNextFocusInCalendar('shortcuts')).to.equal('prev-month-button');
            expect(focusManager.getNextFocusInCalendar('prev-month-button')).to.equal('next-month-button');
            expect(focusManager.getNextFocusInCalendar('next-month-button')).to.equal('calendar-day');
            expect(focusManager.getNextFocusInCalendar('calendar-day')).to.equal('end-input');
        });

        it('should navigate backward through calendar', () => {
            focusManager.updateState({ hasShortcuts: false });

            expect(focusManager.getPreviousFocusInCalendar('calendar-day')).to.equal('next-month-button');
            expect(focusManager.getPreviousFocusInCalendar('next-month-button')).to.equal('prev-month-button');
            expect(focusManager.getPreviousFocusInCalendar('prev-month-button')).to.equal('start-input');
        });
    });

    describe('Case 6: Calendar with Footer Actions', () => {
        it('should include footer buttons in tab order', () => {
            focusManager.updateState({ hasFooterActions: true });

            expect(focusManager.getNextFocusInCalendar('calendar-day')).to.equal('ok-button');
            expect(focusManager.getNextFocusInCalendar('ok-button')).to.equal('cancel-button');
            expect(focusManager.getNextFocusInCalendar('cancel-button')).to.equal('end-input');
        });

        it('should navigate through full sequence with shortcuts and footer', () => {
            focusManager.updateState({ hasShortcuts: true, hasFooterActions: true });

            expect(focusManager.getNextFocusInCalendar('shortcuts')).to.equal('prev-month-button');
            expect(focusManager.getNextFocusInCalendar('prev-month-button')).to.equal('next-month-button');
            expect(focusManager.getNextFocusInCalendar('next-month-button')).to.equal('calendar-day');
            expect(focusManager.getNextFocusInCalendar('calendar-day')).to.equal('ok-button');
            expect(focusManager.getNextFocusInCalendar('ok-button')).to.equal('cancel-button');
            expect(focusManager.getNextFocusInCalendar('cancel-button')).to.equal('end-input');
        });
    });

    describe('Case 7: Range Selection and Shortcuts', () => {
        it('should focus OK button after shortcut when footer enabled', () => {
            focusManager.updateState({ hasFooterActions: true });
            expect(focusManager.getFocusAfterShortcutSelection()).to.equal('ok-button');
        });

        it('should focus end input after shortcut when no footer', () => {
            focusManager.updateState({ hasFooterActions: false });
            expect(focusManager.getFocusAfterShortcutSelection()).to.equal('outside');
        });

        it('should track range selection state', () => {
            const startDate = new Date(2024, 5, 1);
            const transition = focusManager.getFocusAfterDateSelection(startDate, true);

            expect(transition.from).to.equal('calendar-day');
            expect(transition.to).to.equal('calendar-day');
            expect(transition.reason).to.equal('selection');
        });

        it('should focus OK button after end date with footer', () => {
            focusManager.updateState({ hasFooterActions: true });
            const endDate = new Date(2024, 5, 10);
            const transition = focusManager.getFocusAfterDateSelection(endDate, false);

            expect(transition.to).to.equal('ok-button');
        });

        it('should focus end input after end date without footer', () => {
            focusManager.updateState({ hasFooterActions: false });
            const endDate = new Date(2024, 5, 10);
            const transition = focusManager.getFocusAfterDateSelection(endDate, false);

            expect(transition.to).to.equal('end-input');
        });
    });

    describe('Case 8: Escape and Focus Recovery', () => {
        it('should return to start input when opened from start', () => {
            focusManager.resetOnOpen('start-input');
            expect(focusManager.getFocusAfterEscape()).to.equal('start-input');
        });

        it('should return to end input when opened from end', () => {
            focusManager.resetOnOpen('end-input');
            expect(focusManager.getFocusAfterEscape()).to.equal('end-input');
        });

        it('should return to start input when opened from start icon', () => {
            focusManager.resetOnOpen('start-icon');
            expect(focusManager.getFocusAfterEscape()).to.equal('start-input');
        });

        it('should focus end input after OK', () => {
            expect(focusManager.getFocusAfterOK()).to.equal('outside');
        });

        it('should focus origin after Cancel', () => {
            focusManager.resetOnOpen('start-input');
            expect(focusManager.getFocusAfterCancel()).to.equal('outside');

            focusManager.resetOnOpen('end-icon');
            expect(focusManager.getFocusAfterCancel()).to.equal('outside');
        });
    });

    describe('Case 9: Arrow Navigation', () => {
        it('should navigate left by 1 day', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowLeft');

            expect(next.getDate()).to.equal(14);
            expect(next.getMonth()).to.equal(5);
            expect(next.getFullYear()).to.equal(2024);
        });

        it('should navigate right by 1 day', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowRight');

            expect(next.getDate()).to.equal(16);
        });

        it('should navigate up by 7 days', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowUp');

            expect(next.getDate()).to.equal(8);
        });

        it('should navigate down by 7 days', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowDown');

            expect(next.getDate()).to.equal(22);
        });

        it('should cross month boundary with ArrowLeft', () => {
            const current = new Date(2024, 5, 1); // June 1
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowLeft');

            expect(next.getMonth()).to.equal(4); // May
            expect(next.getDate()).to.equal(31);
        });

        it('should cross month boundary with ArrowRight', () => {
            const current = new Date(2024, 5, 30); // June 30
            const next = focusManager.getNextDateFromArrowKey(current, 'ArrowRight');

            expect(next.getMonth()).to.equal(6); // July
            expect(next.getDate()).to.equal(1);
        });

        it('should navigate to first day of week with Home', () => {
            const current = new Date(2024, 5, 15); // Saturday
            const next = focusManager.getNextDateFromArrowKey(current, 'Home');

            // Should go to Monday of that week
            expect(next.getDay()).to.equal(1);
            expect(next.getDate()).to.be.lessThan(15);
        });

        it('should navigate to last day of week with End', () => {
            const current = new Date(2024, 5, 15); // Saturday
            const next = focusManager.getNextDateFromArrowKey(current, 'End');

            // Should go to Sunday of that week
            expect(next.getDay()).to.equal(0);
            expect(next.getDate()).to.be.greaterThan(15);
        });

        it('should navigate to previous month with PageUp', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'PageUp');

            expect(next.getMonth()).to.equal(4); // May
            expect(next.getDate()).to.equal(15);
        });

        it('should navigate to next month with PageDown', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'PageDown');

            expect(next.getMonth()).to.equal(6); // July
            expect(next.getDate()).to.equal(15);
        });

        it('should navigate to previous year with Shift+PageUp', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'PageUp', true);

            expect(next.getFullYear()).to.equal(2023);
            expect(next.getMonth()).to.equal(5);
            expect(next.getDate()).to.equal(15);
        });

        it('should navigate to next year with Shift+PageDown', () => {
            const current = new Date(2024, 5, 15);
            const next = focusManager.getNextDateFromArrowKey(current, 'PageDown', true);

            expect(next.getFullYear()).to.equal(2025);
            expect(next.getMonth()).to.equal(5);
            expect(next.getDate()).to.equal(15);
        });

        it('should clamp day number when month has fewer days', () => {
            const current = new Date(2024, 0, 31); // Jan 31
            const next = focusManager.getNextDateFromArrowKey(current, 'PageDown');

            expect(next.getMonth()).to.equal(1); // Feb
            expect(next.getDate()).to.equal(29); // 2024 is leap year
        });
    });

    describe('Month View Management', () => {
        it('should detect when month view needs to change', () => {
            const currentView = new Date(2024, 5, 1); // June
            const targetDate = new Date(2024, 6, 15); // July

            expect(focusManager.shouldChangeMonthView(currentView, targetDate)).to.be.true;
        });

        it('should not change view when date is in same month', () => {
            const currentView = new Date(2024, 5, 1); // June
            const targetDate = new Date(2024, 5, 15); // June 15

            expect(focusManager.shouldChangeMonthView(currentView, targetDate)).to.be.false;
        });

        it('should get correct month view for date', () => {
            const date = new Date(2024, 5, 15);
            const monthView = focusManager.getMonthViewForDate(date);

            expect(monthView.getDate()).to.equal(1);
            expect(monthView.getMonth()).to.equal(5);
            expect(monthView.getFullYear()).to.equal(2024);
        });

        it('should focus selected date after month change', () => {
            const newMonth = new Date(2024, 5, 1);
            const selectedDate = new Date(2024, 5, 15);

            focusManager.updateState({
                activeField: 'start',
                selectedStartDate: selectedDate,
            });

            const targetDate = focusManager.getFocusedDateAfterMonthChange(newMonth);
            expect(targetDate).to.deep.equal(selectedDate);
        });

        it('should focus today if in current month', () => {
            const today = new Date();
            const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            focusManager.updateState({
                selectedStartDate: null,
                selectedEndDate: null,
            });

            const targetDate = focusManager.getFocusedDateAfterMonthChange(currentMonth);
            expect(targetDate.getDate()).to.equal(today.getDate());
            expect(targetDate.getMonth()).to.equal(today.getMonth());
        });

        it('should focus 1st of month if not current month', () => {
            const futureMonth = new Date(2025, 0, 1);

            focusManager.updateState({
                selectedStartDate: null,
                selectedEndDate: null,
                focusedDate: null,
            });

            const targetDate = focusManager.getFocusedDateAfterMonthChange(futureMonth);
            expect(targetDate.getDate()).to.equal(1);
            expect(targetDate.getMonth()).to.equal(0);
            expect(targetDate.getFullYear()).to.equal(2025);
        });
    });

    describe('Keyboard Detection', () => {
        it('should detect calendar navigation keys', () => {
            expect(focusManager.isCalendarNavigationKey('ArrowLeft')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('ArrowRight')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('ArrowUp')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('ArrowDown')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('Home')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('End')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('PageUp')).to.be.true;
            expect(focusManager.isCalendarNavigationKey('PageDown')).to.be.true;
        });

        it('should not detect non-navigation keys', () => {
            expect(focusManager.isCalendarNavigationKey('Enter')).to.be.false;
            expect(focusManager.isCalendarNavigationKey('Tab')).to.be.false;
            expect(focusManager.isCalendarNavigationKey('Escape')).to.be.false;
            expect(focusManager.isCalendarNavigationKey('a')).to.be.false;
        });

        it('should detect keys that open calendar', () => {
            expect(focusManager.shouldOpenCalendar('Enter', 'start-input')).to.be.true;
            expect(focusManager.shouldOpenCalendar(' ', 'end-icon')).to.be.true;
            expect(focusManager.shouldOpenCalendar('ArrowDown', 'start-input')).to.be.true;
        });

        it('should not open calendar for wrong key/element combo', () => {
            expect(focusManager.shouldOpenCalendar('Enter', 'calendar-day')).to.be.false;
            expect(focusManager.shouldOpenCalendar('Tab', 'start-input')).to.be.false;
        });

        it('should detect calendar close key', () => {
            expect(focusManager.shouldCloseCalendar('Escape')).to.be.true;
            expect(focusManager.shouldCloseCalendar('Enter')).to.be.false;
        });

        it('should detect date selection keys', () => {
            expect(focusManager.shouldSelectDate('Enter', 'calendar-day')).to.be.true;
            expect(focusManager.shouldSelectDate(' ', 'calendar-day')).to.be.true;
            expect(focusManager.shouldSelectDate('Enter', 'shortcuts')).to.be.false;
        });

        it('should detect shortcut navigation keys', () => {
            expect(focusManager.isShortcutNavigationKey('ArrowUp', 'shortcuts')).to.be.true;
            expect(focusManager.isShortcutNavigationKey('ArrowDown', 'shortcuts')).to.be.true;
            expect(focusManager.isShortcutNavigationKey('ArrowLeft', 'shortcuts')).to.be.false;
            expect(focusManager.isShortcutNavigationKey('ArrowDown', 'calendar-day')).to.be.false;
        });
    });

    describe('State Reset', () => {
        it('should reset state on close', () => {
            focusManager.updateState({ calendarOpen: true });
            focusManager.resetOnOpen('start-input');

            focusManager.resetOnClose();

            const state = focusManager.getState();
            expect(state.calendarOpen).to.be.false;
            expect(state.calendarOpenOrigin).to.be.null;
            expect(state.rangeSelectionStep).to.equal('selecting-start');
        });

        it('should set state on open from start', () => {
            focusManager.resetOnOpen('start-input');

            const state = focusManager.getState();
            expect(state.calendarOpen).to.be.true;
            expect(state.calendarOpenOrigin).to.equal('start-input');
            expect(state.rangeSelectionStep).to.equal('selecting-start');
        });

        it('should set state on open with existing start date', () => {
            focusManager.updateState({
                selectedStartDate: new Date(2024, 5, 1),
            });

            focusManager.resetOnOpen('end-input');

            const state = focusManager.getState();
            expect(state.calendarOpen).to.be.true;
            expect(state.rangeSelectionStep).to.equal('selecting-end');
        });
    });

    describe('Edge Cases', () => {
        it('should handle leap year dates', () => {
            const feb29 = new Date(2024, 1, 29);
            const next = focusManager.getNextDateFromArrowKey(feb29, 'PageDown');

            expect(next.getMonth()).to.equal(2); // March
            expect(next.getDate()).to.equal(29);
        });

        it('should handle year transitions', () => {
            const dec31 = new Date(2024, 11, 31);
            const next = focusManager.getNextDateFromArrowKey(dec31, 'ArrowRight');

            expect(next.getFullYear()).to.equal(2025);
            expect(next.getMonth()).to.equal(0);
            expect(next.getDate()).to.equal(1);
        });

        it('should handle invalid element in tab navigation', () => {
            expect(focusManager.getNextFocusWhenClosed('invalid' as FocusableElement)).to.equal('outside');
            expect(focusManager.getPreviousFocusWhenClosed('invalid' as FocusableElement)).to.equal('outside');
        });

        it('should handle null dates gracefully', () => {
            focusManager.updateState({
                selectedStartDate: null,
                selectedEndDate: null,
            });

            const focusedDate = focusManager.getFocusedDateOnOpen();
            expect(focusedDate).to.be.instanceOf(Date);
        });
    });
});
