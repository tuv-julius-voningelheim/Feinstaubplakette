import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import './date-calendar-range.component.js';
import '@tuvsud/design-system/date-range';

describe('<ts-date-calendar-range>', () => {
    it('renders both months', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const labels = root!.querySelectorAll('.month-label');
        await expect(labels.length).to.equal(2);
    });

    it('renders weekday headers', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const dow = root!.querySelectorAll('.dow span');
        await expect(dow.length).to.equal(14);
    });

    it('emits ts-month-change when clicking next month', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const nextBtn = root!.querySelector('ts-icon-button[name="arrow_back_ios"]');
        const wait = oneEvent(el, 'ts-month-change');
        nextBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;
        await expect(ev.detail.focused instanceof Date).to.equal(true);
    });

    it.skip('selects start date and emits ts-date-range-select', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const days = Array.from(root!.querySelectorAll('button')).filter(b => !b.classList.contains('invisible-day'));
        const wait = oneEvent(el, 'ts-date-range-select');
        days[5]!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev = await wait;
        await expect(ev.detail.start).to.equal('12/05/2025 ');
        await expect(ev.detail.end).to.equal(undefined);
    });

    it.skip('selects end date and emits complete range', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const days = Array.from(root!.querySelectorAll('button')).filter(b => !b.classList.contains('invisible-day'));
        const w1 = oneEvent(el, 'ts-date-range-select');
        days[4]!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await w1;
        const w2 = oneEvent(el, 'ts-date-range-select');
        days[10]!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev2 = await w2;
        await expect(ev2.detail.start).to.equal('12/05/2025 ');
        await expect(ev2.detail.end).to.equal('12/05/2025 ');
    });

    it('selecting earlier second date resets range', async () => {
        const el = await fixture(html`<ts-date-calendar-range></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const days = Array.from(root!.querySelectorAll('button')).filter(b => !b.classList.contains('invisible-day'));
        const w1 = oneEvent(el, 'ts-date-range-select');
        days[10]!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await w1;
        const w2 = oneEvent(el, 'ts-date-range-select');
        days[3]!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        const ev2 = await w2;
        await expect(ev2.detail.end).to.equal(undefined);
    });

    it.skip('locale changes month label', async () => {
        const el = await fixture(html`<ts-date-calendar-range locale="de"></ts-date-calendar-range>`);
        await (el as LitElement).updateComplete;
        const root = el.shadowRoot;
        const label = root!.querySelector('.month-label')!.textContent!.toLowerCase();
        await expect(label.includes('mär') || label.includes('mar')).to.equal(false);
    });
});
