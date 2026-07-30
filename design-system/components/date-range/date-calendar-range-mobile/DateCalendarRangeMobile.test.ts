import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import sinon from 'sinon';

import './date-calendar-range-mobile.component.js';
import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/icon-button';

type Cal = LitElement & {
    startDate?: Date;
    endDate?: Date;
    focusedDate: Date;
    locale: string;
    activeField: 'start' | 'end';
    firstDayOfWeek: number;
};

function visibleDays(root: ShadowRoot): HTMLButtonElement[] {
    return Array.from(root.querySelectorAll('button')).filter(
        b => !b.classList.contains('invisible-day'),
    ) as HTMLButtonElement[];
}

function click(el: Element) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
}

async function tagFixture(focusedDate?: Date): Promise<Cal> {
    const fd = focusedDate ?? new Date(2025, 0, 1);
    const el = await fixture<Cal>(html`
        <ts-date-calendar-range-mobile .focusedDate=${fd}></ts-date-calendar-range-mobile>
    `);
    await el.updateComplete;
    return el;
}

describe('<ts-date-calendar-range-mobile>', () => {
    // ── basic rendering ─────────────────────────────────────────────────────
    it('renders one month label', async () => {
        const el = await tagFixture();
        const labels = el.shadowRoot!.querySelectorAll('.month-label');
        expect(labels.length).to.equal(1);
    });

    it('renders 7 weekday headers', async () => {
        const el = await tagFixture();
        expect(el.shadowRoot!.querySelectorAll('.dow span').length).to.equal(7);
    });

    it('renders month name and year in header', async () => {
        const el = await tagFixture(new Date(2025, 2, 1));
        const label = el.shadowRoot!.querySelector('.month-label')!.textContent!;
        expect(label).to.include('2025');
    });

    it('renders at least 28 visible day buttons', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        expect(visibleDays(el.shadowRoot!).length).to.be.greaterThanOrEqual(28);
    });

    it('out-of-month days get invisible-day class', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        expect(el.shadowRoot!.querySelectorAll('button.invisible-day').length).to.be.greaterThan(0);
    });

    it('today button has "today" class', async () => {
        const today = new Date();
        const el = await tagFixture(new Date(today.getFullYear(), today.getMonth(), 1));
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const btn = el.shadowRoot!.querySelector(`button[data-date="${y}-${m}-${d}"]`);
        expect(btn).to.exist;
        expect(btn!.classList.contains('today')).to.equal(true);
    });

    // ── navigation ──────────────────────────────────────────────────────────
    it('clicking next-month emits ts-month-change for the next month', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-month-change', spy);
        click(el.shadowRoot!.querySelector('.next-month')!);
        await aTimeout(50);
        expect(spy.calledOnce).to.equal(true);
        expect((spy.firstCall.args[0] as CustomEvent).detail.focused).to.be.instanceOf(Date);
        expect(((spy.firstCall.args[0] as CustomEvent).detail.focused as Date).getMonth()).to.equal(1);
    });

    it('clicking previous-month emits ts-month-change for the prior month', async () => {
        const el = await tagFixture(new Date(2025, 2, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-month-change', spy);
        click(el.shadowRoot!.querySelector('.previous-month')!);
        await aTimeout(50);
        expect(spy.calledOnce).to.equal(true);
        expect(((spy.firstCall.args[0] as CustomEvent).detail.focused as Date).getMonth()).to.equal(1);
    });

    it('prev-month click updates focusedDate to previous month', async () => {
        const el = await tagFixture(new Date(2025, 2, 1));
        click(el.shadowRoot!.querySelector('.previous-month')!);
        await el.updateComplete;
        expect(el.focusedDate.getMonth()).to.equal(1);
    });

    it('next-month click updates focusedDate to next month', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        click(el.shadowRoot!.querySelector('.next-month')!);
        await el.updateComplete;
        expect(el.focusedDate.getMonth()).to.equal(1);
    });

    // ── selection ────────────────────────────────────────────────────────────
    it('first click emits ts-date-range-select with start only', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-date-range-select', spy);
        click(visibleDays(el.shadowRoot!)[5]!);
        await aTimeout(50);
        expect(spy.calledOnce).to.equal(true);
        const detail = (spy.firstCall.args[0] as CustomEvent).detail;
        expect(detail.start).to.be.instanceOf(Date);
        expect(detail.end).to.be.undefined;
    });

    it('second (later) click completes range', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-date-range-select', spy);
        click(visibleDays(el.shadowRoot!)[4]!);
        await aTimeout(50);
        click(visibleDays(el.shadowRoot!)[10]!);
        await aTimeout(50);
        expect(spy.callCount).to.equal(2);
        const detail = (spy.secondCall.args[0] as CustomEvent).detail;
        expect(detail.start).to.be.instanceOf(Date);
        expect(detail.end).to.be.instanceOf(Date);
        expect((detail.end as Date) > (detail.start as Date)).to.equal(true);
    });

    it('clicking an earlier second date resets range (end=undefined)', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-date-range-select', spy);
        click(visibleDays(el.shadowRoot!)[10]!);
        await aTimeout(50);
        click(visibleDays(el.shadowRoot!)[3]!);
        await aTimeout(50);
        const detail = (spy.secondCall.args[0] as CustomEvent).detail;
        expect(detail.end).to.be.undefined;
    });

    it('clicking any day when start+end both set resets range', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-date-range-select', spy);
        const days = visibleDays(el.shadowRoot!);
        click(days[2]!);
        await aTimeout(50);
        click(days[8]!);
        await aTimeout(50);
        click(days[15]!);
        await aTimeout(50);
        const detail = (spy.thirdCall.args[0] as CustomEvent).detail;
        expect(detail.end).to.be.undefined;
    });

    // ── range CSS classes ────────────────────────────────────────────────────
    it('start date button has "range-start" and "selected" classes', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!;
        expect(btn.classList.contains('range-start')).to.equal(true);
        expect(btn.classList.contains('selected')).to.equal(true);
    });

    it('end date button has "range-end" and "selected" classes', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .endDate=${new Date(2025, 0, 20)}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-20"]')!;
        expect(btn.classList.contains('range-end')).to.equal(true);
        expect(btn.classList.contains('selected')).to.equal(true);
    });

    it('middle day has "range-middle" class', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .endDate=${new Date(2025, 0, 15)}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-12"]')!.classList.contains('range-middle'),
        ).to.equal(true);
    });

    it('start and end both have "in-range" class', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .endDate=${new Date(2025, 0, 15)}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.classList.contains('in-range')).to.equal(
            true,
        );
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-15"]')!.classList.contains('in-range')).to.equal(
            true,
        );
    });

    // ── hover range ──────────────────────────────────────────────────────────
    it('hovering after startDate when activeField=end (no endDate) adds hover-in-range to intermediate days', async () => {
        // activeField='end' + only startDate set → else-if(!endDate) branch → hover for dates >= startDate
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .activeField=${'end'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.shadowRoot!.querySelector('button[data-date="2025-01-15"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-12"]')!.classList.contains('hover-in-range'),
        ).to.equal(true);
    });

    it('mouseleave on .weeks clears hover range', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.shadowRoot!.querySelector('button[data-date="2025-01-15"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        (el.shadowRoot!.querySelector('.weeks') as HTMLElement).dispatchEvent(
            new MouseEvent('mouseleave', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-12"]')!.classList.contains('hover-in-range'),
        ).to.equal(false);
    });

    it('hover before startDate when activeField=start and range exists shows hover-in-range', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .endDate=${new Date(2025, 0, 20)}
                .activeField=${'start'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.shadowRoot!.querySelector('button[data-date="2025-01-05"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-05"]')!.classList.contains('hover-in-range'),
        ).to.equal(true);
    });

    it('hover after endDate when activeField=end and range exists shows hover-in-range', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .endDate=${new Date(2025, 0, 20)}
                .activeField=${'end'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.shadowRoot!.querySelector('button[data-date="2025-01-25"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-25"]')!.classList.contains('hover-in-range'),
        ).to.equal(true);
    });

    it('hovering AFTER startDate when activeField=start does not show hover-in-range (only before-start hover is shown)', async () => {
        // activeField='start' branch: next = date <= startDate ? date : undefined
        // Jan 20 > Jan 10 (startDate) → next=undefined → no hover
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 10)}
                .activeField=${'start'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.shadowRoot!.querySelector('button[data-date="2025-01-20"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-15"]')!.classList.contains('hover-in-range'),
        ).to.equal(false);
    });

    it('hovering with no selection does not add hover classes', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.dispatchEvent(
            new MouseEvent('mouseenter', { bubbles: false }),
        );
        await el.updateComplete;
        expect(
            el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.classList.contains('hover-in-range'),
        ).to.equal(false);
    });

    // ── firstDayOfWeek ───────────────────────────────────────────────────────
    it('firstDayOfWeek=0 renders Sunday as first column', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .firstDayOfWeek=${0}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        const first = (el.shadowRoot!.querySelectorAll('.dow span')[0] as HTMLElement)
            .textContent!.trim()[0]!
            .toUpperCase();
        expect(first).to.equal('S');
    });

    it('firstDayOfWeek=1 renders Monday as first column', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .firstDayOfWeek=${1}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        const first = (el.shadowRoot!.querySelectorAll('.dow span')[0] as HTMLElement)
            .textContent!.trim()[0]!
            .toUpperCase();
        expect(first).to.equal('M');
    });

    // ── locale ───────────────────────────────────────────────────────────────
    it('locale="de" shows German month name', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                locale="de"
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        const label = el.shadowRoot!.querySelector('.month-label')!.textContent!.toLowerCase();
        expect(label.includes('jan')).to.equal(true);
    });

    it('changing locale invalidates aria-label cache', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const label1 = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.getAttribute('aria-label');
        el.locale = 'de';
        await el.updateComplete;
        const label2 = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.getAttribute('aria-label');
        expect(label1).not.to.equal(label2);
    });

    // ── keyboard navigation ──────────────────────────────────────────────────
    it('ArrowRight sets tabindex=0 on next day button', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]') as HTMLButtonElement;
        btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
        await el.updateComplete;
        await aTimeout(50);
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-11"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowLeft sets tabindex=0 on previous day button', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]') as HTMLButtonElement;
        btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
        await el.updateComplete;
        await aTimeout(50);
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-09"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowDown sets tabindex=0 on day one week later', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]') as HTMLButtonElement;
        btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
        await el.updateComplete;
        await aTimeout(50);
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-17"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowUp sets tabindex=0 on day one week earlier', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-17"]') as HTMLButtonElement;
        btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
        await el.updateComplete;
        await aTimeout(50);
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-10"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('ArrowRight on last day of month emits ts-month-change to next month', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const spy = sinon.spy();
        el.addEventListener('ts-month-change', spy);
        const btn31 = el.shadowRoot!.querySelector('button[data-date="2025-01-31"]') as HTMLButtonElement;
        btn31.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
        await aTimeout(50);
        expect(spy.calledOnce).to.equal(true);
        expect(((spy.firstCall.args[0] as CustomEvent).detail.focused as Date).getMonth()).to.equal(1);
    });

    it('unrecognised key (Tab) does not call preventDefault', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn = el.shadowRoot!.querySelector('button[data-date="2025-01-10"]') as HTMLButtonElement;
        const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        btn.dispatchEvent(e);
        expect(e.defaultPrevented).to.equal(false);
    });

    // ── getInitialFocusDateForView ────────────────────────────────────────────
    it('activeField=end + endDate → roving tabindex on endDate', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 5)}
                .endDate=${new Date(2025, 0, 20)}
                .activeField=${'end'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-20"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('activeField=end + no endDate → roving tabindex falls back to startDate', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 8)}
                .activeField=${'end'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-08"]')!.getAttribute('tabindex')).to.equal('0');
    });

    it('activeField=start + startDate → roving tabindex on startDate', async () => {
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 12)}
                .activeField=${'start'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button[data-date="2025-01-12"]')!.getAttribute('tabindex')).to.equal('0');
    });

    // ── cross-month navigation updates focusedDate ───────────────────────────
    it('ArrowRight past month end updates focusedDate to next month', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        const btn31 = el.shadowRoot!.querySelector('button[data-date="2025-01-31"]') as HTMLButtonElement;
        btn31.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
        await aTimeout(50);
        expect(el.focusedDate.getMonth()).to.equal(1);
    });

    // ── external focusedDate change ──────────────────────────────────────────
    it('changing focusedDate externally renders new month', async () => {
        const el = await tagFixture(new Date(2025, 0, 1));
        el.focusedDate = new Date(2025, 3, 1);
        await el.updateComplete;
        expect(el.shadowRoot!.querySelectorAll('button[data-date^="2025-04"]').length).to.be.greaterThan(0);
    });

    // ── focus protection ─────────────────────────────────────────────────────
    it('focusedDate change does not steal focus from outside element', async () => {
        const wrapper = await fixture<HTMLDivElement>(html`
            <div>
                <input id="outside" />
                <ts-date-calendar-range-mobile .focusedDate=${new Date(2025, 0, 1)}></ts-date-calendar-range-mobile>
            </div>
        `);
        const input = wrapper.querySelector('#outside') as HTMLInputElement;
        input.focus();
        const cal = wrapper.querySelector('ts-date-calendar-range-mobile') as Cal;
        cal.focusedDate = new Date(2025, 2, 1);
        await (cal as LitElement).updateComplete;
        await aTimeout(50);
        expect(document.activeElement).to.equal(input);
    });

    // ── activeField change ───────────────────────────────────────────────────
    it('activeField=end with endDate in next month: navigating to that month shows tabindex on endDate', async () => {
        // ensureKeyboardFocusInitialized only reinitializes when keyboardFocusDate is in a different month.
        // Put endDate in Feb, focusedDate starts in Jan → keyboardFocusDate=Feb20 (not in Jan grid).
        // Navigate to Feb → same month as keyboardFocusDate → btn Feb20 gets tabindex=0.
        const el = await fixture<Cal>(html`
            <ts-date-calendar-range-mobile
                .focusedDate=${new Date(2025, 0, 1)}
                .startDate=${new Date(2025, 0, 5)}
                .endDate=${new Date(2025, 1, 20)}
                .activeField=${'end'}
            ></ts-date-calendar-range-mobile>
        `);
        await el.updateComplete;
        el.focusedDate = new Date(2025, 1, 1); // navigate to February
        await el.updateComplete;
        expect(el.shadowRoot!.querySelector('button[data-date="2025-02-20"]')!.getAttribute('tabindex')).to.equal('0');
    });
});
