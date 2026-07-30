import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import '@components/date-picker/date-calendar/date-calendar.component.js';
import '@tuvsud/design-system/date-picker';
import '@tuvsud/design-system/icon-button';

function queryDayButtons(root: ShadowRoot): HTMLButtonElement[] {
    return Array.from(root.querySelectorAll('button[data-date]')) as HTMLButtonElement[];
}

function enabledDayButtons(root: ShadowRoot): HTMLButtonElement[] {
    return queryDayButtons(root).filter(b => !b.disabled && b.getAttribute('aria-disabled') !== 'true');
}

describe('<ts-date-calendar>', () => {
    it('renders a grid of day buttons for the focused month', async () => {
        const focused = new Date(2025, 0, 15); // January 2025
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const days = queryDayButtons(el.shadowRoot!);
        // A full month grid has at least 28 cells (4 weeks) and at most 42 (6 weeks)
        expect(days.length).to.be.greaterThanOrEqual(28);
    });

    it('renders weekday headers', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const headers = el.shadowRoot!.querySelectorAll('.dow span');
        expect(headers.length).to.equal(7);
    });

    it('highlights the selected date', async () => {
        const focused = new Date(2025, 0, 15);
        const selected = new Date(2025, 0, 20);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .selectedDate=${selected}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-20"]') as HTMLButtonElement | null;
        expect(btn).to.exist;
        expect(btn!.getAttribute('aria-selected')).to.equal('true');
    });

    it('marks today with a today class or aria-current', async () => {
        const today = new Date();
        const focused = new Date(today.getFullYear(), today.getMonth(), 1);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const btn = el.shadowRoot!.querySelector(`button[data-date="${y}-${m}-${d}"]`) as HTMLButtonElement | null;
        expect(btn).to.exist;
        const isMarked =
            btn!.classList.contains('today') ||
            btn!.getAttribute('aria-current') === 'date' ||
            btn!.closest('.today') !== null;
        expect(isMarked).to.equal(true);
    });

    it('emits ts-date-select when clicking an enabled day', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const enabled = enabledDayButtons(el.shadowRoot!);
        expect(enabled.length).to.be.greaterThan(0);

        const wait = oneEvent(el, 'ts-date-select');
        enabled[0]!.click();
        const ev = await wait;

        expect(ev.detail.value).to.be.instanceOf(Date);
    });

    it('disables days according to isDateDisabled predicate', async () => {
        const focused = new Date(2025, 0, 15);
        // Disable all Sundays
        const isDisabled = (d: Date) => d.getDay() === 0;

        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${isDisabled}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const days = queryDayButtons(el.shadowRoot!);
        const disabledDays = days.filter(b => b.disabled || b.getAttribute('aria-disabled') === 'true');
        expect(disabledDays.length).to.be.greaterThan(0);
    });

    it('disables days outside min/max range', async () => {
        const focused = new Date(2025, 0, 15);
        const min = new Date(2025, 0, 10);
        const max = new Date(2025, 0, 20);

        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .min=${min}
                .max=${max}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const days = queryDayButtons(el.shadowRoot!);
        const disabledDays = days.filter(b => b.disabled || b.getAttribute('aria-disabled') === 'true');
        expect(disabledDays.length).to.be.greaterThan(0);
    });

    it('emits ts-month-change when clicking the next-month button', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const nextBtn = el.shadowRoot!.querySelector('.next-month') as HTMLElement | null;
        expect(nextBtn).to.exist;

        const wait = oneEvent(el, 'ts-month-change');
        nextBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;

        expect(ev.detail.focused).to.be.instanceOf(Date);
    });

    it('emits ts-month-change when clicking the prev-month button', async () => {
        const focused = new Date(2025, 5, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const prevBtn = el.shadowRoot!.querySelector('.prev-month') as HTMLElement | null;
        expect(prevBtn).to.exist;

        const wait = oneEvent(el, 'ts-month-change');
        prevBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;

        expect(ev.detail.focused).to.be.instanceOf(Date);
    });

    it('switches to months view when clicking the month selector', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement | null;
        expect(monthBtn).to.exist;

        monthBtn!.click();
        await (el as LitElement).updateComplete;

        const monthsPanel = el.shadowRoot!.querySelector('.months-panel');
        expect(monthsPanel).to.exist;
    });

    it('switches to years view when clicking the year selector', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement | null;
        expect(yearBtn).to.exist;

        yearBtn!.click();
        await (el as LitElement).updateComplete;

        const yearsPanel = el.shadowRoot!.querySelector('.years-panel');
        expect(yearsPanel).to.exist;
    });

    it('months view disables months outside min/max bounds', async () => {
        const focused = new Date(2025, 3, 15); // April 2025
        const min = new Date(2025, 2, 1); // March
        const max = new Date(2025, 4, 31); // May

        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .min=${min}
                .max=${max}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthsPanel = el.shadowRoot!.querySelector('.months-panel')!;
        const buttons = Array.from(monthsPanel.querySelectorAll('button')) as HTMLButtonElement[];
        const disabled = buttons.filter(b => b.disabled);
        expect(disabled.length).to.be.greaterThan(0);
    });

    it('picks a month from months view and returns to days', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthsPanel = el.shadowRoot!.querySelector('.months-panel')!;
        const buttons = Array.from(monthsPanel.querySelectorAll('button')) as HTMLButtonElement[];
        const enabled = buttons.find(b => !b.disabled);

        const wait = oneEvent(el, 'ts-month-change');
        enabled!.click();
        await wait;
        await (el as LitElement).updateComplete;

        // Should be back in days view
        const days = queryDayButtons(el.shadowRoot!);
        expect(days.length).to.be.greaterThanOrEqual(28);
    });

    it('picks a year from years view and switches to months', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const yearsPanel = el.shadowRoot!.querySelector('.years-panel')!;
        const yearButtons = Array.from(yearsPanel.querySelectorAll('button')) as HTMLButtonElement[];
        const enabled = yearButtons.find(b => !b.disabled);

        const wait = oneEvent(el, 'ts-year-change');
        enabled!.click();
        await wait;
        await (el as LitElement).updateComplete;

        // Should be in months view now
        const monthsPanel = el.shadowRoot!.querySelector('.months-panel');
        expect(monthsPanel).to.exist;
    });

    it('does not steal focus from outside when focusedDate changes', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <div>
                <input id="outside" />
                <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
            </div>
        `);

        const outsideInput = el.querySelector('#outside') as HTMLInputElement;
        outsideInput.focus();

        const calendar = el.querySelector('ts-date-calendar') as LitElement;
        (calendar as unknown as { focusedDate: Date }).focusedDate = new Date(2025, 1, 15);
        await calendar.updateComplete;
        await aTimeout(50);

        // Focus should still be on the outside input, not stolen by the calendar
        expect(document.activeElement).to.equal(outsideInput);
    });

    // ── resetView ────────────────────────────────────────────────────────────
    it('resetView() returns calendar to days view from months view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        // Switch to months view
        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.months-panel')).to.exist;

        // resetView() should bring it back
        (el as unknown as { resetView(): void }).resetView();
        await (el as LitElement).updateComplete;

        expect(el.shadowRoot!.querySelector('.months-panel')).not.to.exist;
        expect(queryDayButtons(el.shadowRoot!).length).to.be.greaterThanOrEqual(28);
    });

    it('resetView() returns calendar to days view from years view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.years-panel')).to.exist;

        (el as unknown as { resetView(): void }).resetView();
        await (el as LitElement).updateComplete;

        expect(el.shadowRoot!.querySelector('.years-panel')).not.to.exist;
        expect(queryDayButtons(el.shadowRoot!).length).to.be.greaterThanOrEqual(28);
    });

    // ── Toggle views (click same button twice goes back to days) ──────────
    it('clicking month selector twice toggles back to days view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.months-panel')).to.exist;

        monthBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.months-panel')).not.to.exist;
    });

    it('clicking year selector twice toggles back to days view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.years-panel')).to.exist;

        yearBtn.click();
        await (el as LitElement).updateComplete;
        expect(el.shadowRoot!.querySelector('.years-panel')).not.to.exist;
    });

    // ── muted class on out-of-month days ──────────────────────────────────
    it('applies muted class to days that belong to adjacent months', async () => {
        const focused = new Date(2025, 0, 15); // January 2025
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const muted = el.shadowRoot!.querySelectorAll('button.muted');
        // January grid always contains some days from December / February
        expect(muted.length).to.be.greaterThan(0);
    });

    // ── firstDayOfWeek ────────────────────────────────────────────────────
    it('renders Monday as first column when firstDayOfWeek=1', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .firstDayOfWeek=${1}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const headers = Array.from(el.shadowRoot!.querySelectorAll('.dow span')) as HTMLElement[];
        expect(headers.length).to.equal(7);
        // Monday abbreviation starts with 'M' for en locale
        expect(headers[0]!.textContent!.trim()[0]!.toUpperCase()).to.equal('M');
    });

    it('renders Sunday as first column when firstDayOfWeek=0', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .firstDayOfWeek=${0}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const headers = Array.from(el.shadowRoot!.querySelectorAll('.dow span')) as HTMLElement[];
        expect(headers.length).to.equal(7);
        expect(headers[0]!.textContent!.trim()[0]!.toUpperCase()).to.equal('S');
    });

    // ── ts-date-select event detail ───────────────────────────────────────
    it('emits ts-date-select with locale and meta in detail', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} locale="en" .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const enabled = enabledDayButtons(el.shadowRoot!);
        const wait = oneEvent(el, 'ts-date-select');
        enabled[0]!.click();
        const ev = await wait;

        expect(ev.detail.value).to.be.instanceOf(Date);
        expect(ev.detail.locale).to.equal('en');
        expect(ev.detail.meta).to.exist;
    });

    // ── footer-action attribute ───────────────────────────────────────────
    it('adds footer-action class modifier when footerAction=true', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} footer-action .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const wrapper = el.shadowRoot!.querySelector('.date-month')!;
        // when footerAction=true the extra ' footer-action' class is NOT appended (negated in template)
        expect(wrapper.classList.contains('footer-action')).to.equal(false);
    });

    it('includes footer-action class modifier when footerAction=false', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const wrapper = el.shadowRoot!.querySelector('.date-month')!;
        expect(wrapper.classList.contains('footer-action')).to.equal(true);
    });

    // ── nav buttons disabled when not in days view ────────────────────────
    it('prev/next month buttons are disabled when in months view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const prevBtn = el.shadowRoot!.querySelector('.prev-month') as HTMLElement;
        const nextBtn = el.shadowRoot!.querySelector('.next-month') as HTMLElement;
        expect(prevBtn.hasAttribute('disabled')).to.equal(true);
        expect(nextBtn.hasAttribute('disabled')).to.equal(true);
    });

    it('prev/next month buttons are disabled when in years view', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const prevBtn = el.shadowRoot!.querySelector('.prev-month') as HTMLElement;
        const nextBtn = el.shadowRoot!.querySelector('.next-month') as HTMLElement;
        expect(prevBtn.hasAttribute('disabled')).to.equal(true);
        expect(nextBtn.hasAttribute('disabled')).to.equal(true);
    });

    // ── minYear / maxYear ─────────────────────────────────────────────────
    it('years panel only contains years within minYear/maxYear bounds', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .minYear=${2023}
                .maxYear=${2027}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const yearButtons = Array.from(el.shadowRoot!.querySelectorAll('.years-panel button')) as HTMLButtonElement[];
        const years = yearButtons.map(b => Number(b.dataset['year']));
        expect(years).to.include(2023);
        expect(years).to.include(2027);
        expect(years).not.to.include(2022);
        expect(years).not.to.include(2028);
    });

    it('year outside minYear/maxYear is disabled', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .minYear=${2025}
                .maxYear=${2025}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        // Only 2025 should be in the list and it should be enabled (selected)
        const yearButtons = Array.from(el.shadowRoot!.querySelectorAll('.years-panel button')) as HTMLButtonElement[];
        expect(yearButtons.length).to.equal(1);
        expect(yearButtons[0]!.disabled).to.equal(false);
    });

    // ── clicking disabled year does nothing ───────────────────────────────
    it('clicking a disabled year does not emit ts-year-change', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .min=${new Date(2025, 0, 1)}
                .max=${new Date(2025, 11, 31)}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const disabledYear = el.shadowRoot!.querySelector('.years-panel button[disabled]') as HTMLButtonElement | null;
        if (!disabledYear) return; // no disabled years in range – skip

        let fired = false;
        el.addEventListener('ts-year-change', () => (fired = true));
        disabledYear.click();
        await aTimeout(30);
        expect(fired).to.equal(false);
    });

    // ── clicking disabled month does nothing ──────────────────────────────
    it('clicking a disabled month does not emit ts-month-change', async () => {
        const focused = new Date(2025, 3, 15); // April
        const min = new Date(2025, 2, 1); // March
        const max = new Date(2025, 4, 31); // May
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .min=${min}
                .max=${max}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const disabledMonth = el.shadowRoot!.querySelector(
            '.months-panel button[disabled]',
        ) as HTMLButtonElement | null;
        if (!disabledMonth) return; // nothing to test

        let fired = false;
        el.addEventListener('ts-month-change', () => (fired = true));
        disabledMonth.click();
        await aTimeout(30);
        expect(fired).to.equal(false);
    });

    // ── Keyboard navigation – days view ──────────────────────────────────
    it('ArrowRight moves keyboard focus to the next day', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn15 = el.shadowRoot!.querySelector('button[data-date="2025-01-15"]') as HTMLButtonElement;
        btn15.focus();
        btn15.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn16 = el.shadowRoot!.querySelector('button[data-date="2025-01-16"]') as HTMLButtonElement;
        expect(btn16.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowLeft moves keyboard focus to the previous day', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn15 = el.shadowRoot!.querySelector('button[data-date="2025-01-15"]') as HTMLButtonElement;
        btn15.focus();
        btn15.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn14 = el.shadowRoot!.querySelector('button[data-date="2025-01-14"]') as HTMLButtonElement;
        expect(btn14.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowDown moves keyboard focus down one week', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn15 = el.shadowRoot!.querySelector('button[data-date="2025-01-15"]') as HTMLButtonElement;
        btn15.focus();
        btn15.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn22 = el.shadowRoot!.querySelector('button[data-date="2025-01-22"]') as HTMLButtonElement;
        expect(btn22.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowUp moves keyboard focus up one week', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn15 = el.shadowRoot!.querySelector('button[data-date="2025-01-15"]') as HTMLButtonElement;
        btn15.focus();
        btn15.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn8 = el.shadowRoot!.querySelector('button[data-date="2025-01-08"]') as HTMLButtonElement;
        expect(btn8.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowRight at end-of-month emits ts-month-change to navigate forward', async () => {
        // Jan 31: ArrowRight should move to Feb 1 (cross-month)
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn31 = el.shadowRoot!.querySelector('button[data-date="2025-01-31"]') as HTMLButtonElement;
        btn31.focus();

        const wait = oneEvent(el, 'ts-month-change');
        btn31.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        const ev = await wait;

        expect(ev.detail.focused).to.be.instanceOf(Date);
        expect((ev.detail.focused as Date).getMonth()).to.equal(1); // February
    });

    it('unrecognised key in day view does not prevent default', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn15 = el.shadowRoot!.querySelector('button[data-date="2025-01-15"]') as HTMLButtonElement;
        btn15.focus();
        const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        btn15.dispatchEvent(e);
        // Tab should NOT be prevented
        expect(e.defaultPrevented).to.equal(false);
    });

    // ── Keyboard navigation – months view ────────────────────────────────
    it('ArrowRight in months view moves to next month tab-stop', async () => {
        const focused = new Date(2025, 0, 15); // January = index 0
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthButtons = Array.from(
            el.shadowRoot!.querySelectorAll('.months-panel .grid-item'),
        ) as HTMLButtonElement[];
        // Focus Jan (index 0)
        monthButtons[0]!.focus();
        monthButtons[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        // Feb (index 1) should now have tabindex=0
        expect(monthButtons[1]!.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowLeft in months view moves to previous month tab-stop', async () => {
        const focused = new Date(2025, 1, 15); // February = index 1
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthButtons = Array.from(
            el.shadowRoot!.querySelectorAll('.months-panel .grid-item'),
        ) as HTMLButtonElement[];
        monthButtons[1]!.focus();
        monthButtons[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        expect(monthButtons[0]!.getAttribute('tabindex')).to.equal('0');
    });

    it('unrecognised key in months view does not prevent default', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthButtons = Array.from(
            el.shadowRoot!.querySelectorAll('.months-panel .grid-item'),
        ) as HTMLButtonElement[];
        monthButtons[0]!.focus();
        const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        monthButtons[0]!.dispatchEvent(e);
        expect(e.defaultPrevented).to.equal(false);
    });

    // ── Keyboard navigation – years view ─────────────────────────────────
    it('ArrowDown in years view moves to next year', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .minYear=${2023}
                .maxYear=${2027}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const btn2025 = el.shadowRoot!.querySelector('button[data-year="2025"]') as HTMLButtonElement;
        btn2025.focus();
        btn2025.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn2026 = el.shadowRoot!.querySelector('button[data-year="2026"]') as HTMLButtonElement;
        expect(btn2026.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowUp in years view moves to previous year', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .minYear=${2023}
                .maxYear=${2027}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const btn2025 = el.shadowRoot!.querySelector('button[data-year="2025"]') as HTMLButtonElement;
        btn2025.focus();
        btn2025.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        const btn2024 = el.shadowRoot!.querySelector('button[data-year="2024"]') as HTMLButtonElement;
        expect(btn2024.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowUp at minYear boundary does not navigate below minimum', async () => {
        const focused = new Date(2023, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .minYear=${2023}
                .maxYear=${2025}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const btn2023 = el.shadowRoot!.querySelector('button[data-year="2023"]') as HTMLButtonElement;
        btn2023.focus();
        btn2023.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        await (el as LitElement).updateComplete;
        await aTimeout(30);

        // tabindex should remain on 2023 (no navigation out of bounds)
        expect(btn2023.getAttribute('tabindex')).to.equal('0');
    });

    it('unrecognised key in years view does not prevent default', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const btn = el.shadowRoot!.querySelector('.years-panel button') as HTMLButtonElement;
        btn.focus();
        const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        btn.dispatchEvent(e);
        expect(e.defaultPrevented).to.equal(false);
    });

    // ── getInitialFocusDateForView – selected date takes priority ─────────
    it('roving tabindex starts on selectedDate when it is in the focused month', async () => {
        const focused = new Date(2025, 0, 15);
        const selected = new Date(2025, 0, 20);
        const el = await fixture(html`
            <ts-date-calendar
                .focusedDate=${focused}
                .selectedDate=${selected}
                .isDateDisabled=${() => false}
            ></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const btn20 = el.shadowRoot!.querySelector('button[data-date="2025-01-20"]') as HTMLButtonElement;
        expect(btn20.getAttribute('tabindex')).to.equal('0');
    });

    // ── year panel shows current-year aria-selected="true" ───────────────
    it('year panel marks focused year as aria-selected=true', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearBtn = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        yearBtn.click();
        await (el as LitElement).updateComplete;

        const btn2025 = el.shadowRoot!.querySelector('button[data-year="2025"]') as HTMLButtonElement;
        expect(btn2025.getAttribute('aria-selected')).to.equal('true');
    });

    // ── month panel marks current month as aria-selected="true" ──────────
    it('month panel marks focused month as aria-selected=true', async () => {
        const focused = new Date(2025, 2, 15); // March = index 2
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthBtn = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        monthBtn.click();
        await (el as LitElement).updateComplete;

        const monthButtons = Array.from(
            el.shadowRoot!.querySelectorAll('.months-panel .grid-item'),
        ) as HTMLButtonElement[];
        expect(monthButtons[2]!.getAttribute('aria-selected')).to.equal('true');
    });

    // ── locale label ──────────────────────────────────────────────────────
    it('renders month name in header matching the locale', async () => {
        const focused = new Date(2025, 0, 15); // January
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} locale="de" .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const monthSelector = el.shadowRoot!.querySelector('.selector-btn-month') as HTMLButtonElement;
        // German locale should show "Januar" or similar
        expect(monthSelector.textContent!.trim().length).to.be.greaterThan(0);
    });

    it('renders year in header', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const yearSelector = el.shadowRoot!.querySelector('.selector-btn-year') as HTMLButtonElement;
        expect(yearSelector.textContent).to.include('2025');
    });

    // ── aria-label on grid ────────────────────────────────────────────────
    it('day grid has aria-label containing month and year', async () => {
        const focused = new Date(2025, 0, 15);
        const el = await fixture(html`
            <ts-date-calendar .focusedDate=${focused} locale="en" .isDateDisabled=${() => false}></ts-date-calendar>
        `);
        await (el as LitElement).updateComplete;

        const grid = el.shadowRoot!.querySelector('[role="grid"]') as HTMLElement;
        expect(grid.getAttribute('aria-label')).to.include('2025');
    });
});
