import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import type TsDateCalendarRangeMobile from '@components/date-range/date-calendar-range-mobile/date-calendar-range-mobile.component.js';

import TsDateDialogRangeComponent from './date-dialog-range.component.js';

import './date-dialog-range.component.js';
import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/dialog';

describe('<ts-date-dialog-range>', () => {
    it('renders inputs and dialog', async () => {
        const el = await fixture(html`<ts-date-dialog-range></ts-date-dialog-range>`);
        await (el as LitElement).updateComplete;

        const root = el.shadowRoot!;
        expect(root.querySelector('ts-date-input-start')).to.exist;
        expect(root.querySelector('ts-date-input-end')).to.exist;
        expect(root.querySelector('ts-dialog')).to.exist;
    });

    it('opens dialog when clicking trigger icon (simulated)', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html` <ts-date-dialog-range></ts-date-dialog-range> `);

        await el.updateComplete;

        el['handleTriggerClickStart'](); // simulate icon click
        await el.updateComplete;

        expect(el.open).to.equal(true);
    });

    it('selecting a start date emits ts-date-range-select (simulated)', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html`
            <ts-date-dialog-range open></ts-date-dialog-range>
        `);
        await el.updateComplete;

        const selected = new Date(2025, 0, 10);

        const wait = oneEvent(el, 'ts-date-range-select');

        el.shadowRoot!.querySelector('ts-date-calendar-range-mobile')!.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { start: selected },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;

        expect(ev.detail.start.getTime()).to.equal(selected.getTime());
    });

    it('selecting an end date emits full range (simulated)', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html`
            <ts-date-dialog-range open></ts-date-dialog-range>
        `);

        await el.updateComplete;

        el.valueStart = '01/10/2025';
        el.activeField = 'end';

        const end = new Date(2025, 0, 20);
        const wait = oneEvent(el, 'ts-date-range-select');

        el.shadowRoot!.querySelector('ts-date-calendar-range-mobile')!.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { end },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;

        expect(ev.detail.end.getTime()).to.equal(end.getTime());
    });

    it('ok applies final values and emits ts-date-apply', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html`
            <ts-date-dialog-range open></ts-date-dialog-range>
        `);
        await el.updateComplete;

        const cal: TsDateCalendarRangeMobile = el.shadowRoot!.querySelector('ts-date-calendar-range-mobile')!;

        cal.startDate = new Date(2025, 0, 1);
        cal.endDate = new Date(2025, 0, 3);

        const wait = oneEvent(el, 'ts-date-apply');

        const ok = el.shadowRoot!.querySelectorAll('.date-picker__footer-actions ts-button')[1] as HTMLElement;
        ok.click();

        const ev = await wait;

        expect(ev.detail.start).to.equal('2025-01-01');
        expect(ev.detail.end).to.equal('2025-01-03');
    });

    it('shortcut emits ts-shortcut-select (simulated)', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html`
            <ts-date-dialog-range open .shortcuts=${[0, 1]}></ts-date-dialog-range>
        `);

        await el.updateComplete;

        const wait = oneEvent(el, 'ts-shortcut-select');

        el.shadowRoot!.querySelector('ts-date-shortcuts')!.dispatchEvent(
            new CustomEvent('ts-shortcut-select', {
                detail: { index: 1 },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;
        expect(ev.detail.index).to.equal(1);
    });

    it('month change emits ts-month-change (simulated)', async () => {
        const el: TsDateDialogRangeComponent = await fixture(html`<ts-date-dialog-range open></ts-date-dialog-range>`);
        await el.updateComplete;

        const wait = oneEvent(el, 'ts-month-change');

        el.shadowRoot!.querySelector('ts-date-calendar-range-mobile')!.dispatchEvent(
            new CustomEvent('ts-month-change', {
                detail: { focused: new Date() },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;
        expect(ev.detail.focused instanceof Date).to.equal(true);
    });
});
