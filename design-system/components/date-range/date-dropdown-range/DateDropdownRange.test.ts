import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import TsDateDropdownRangeComponent from './date-dropdown-range.component.js';

import '@tuvsud/design-system/date-range';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/dropdown';
import './date-dropdown-range.component.js';

describe('<ts-date-dropdown-range>', () => {
    it('renders inputs and dropdown', async () => {
        const el = await fixture(html` <ts-date-dropdown-range></ts-date-dropdown-range> `);

        await (el as LitElement).updateComplete;

        const root = el.shadowRoot!;
        expect(root.querySelector('ts-date-input-start')).to.exist;
        expect(root.querySelector('ts-date-input-end')).to.exist;
        expect(root.querySelector('ts-dropdown')).to.exist;
        expect(root.querySelector('ts-date-calendar-range')).to.exist;
    });

    it('emits ts-date-range-select when selecting a START date (simulated)', async () => {
        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const cal = el.shadowRoot!.querySelector('ts-date-calendar-range')!;

        const selected = new Date(2024, 4, 10);

        const wait = oneEvent(el, 'ts-date-range-select');

        cal.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { start: selected },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;

        expect(ev.detail.start.getTime()).to.equal(selected.getTime());
    });

    it('emits full range when selecting END date (simulated)', async () => {
        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const cal = el.shadowRoot!.querySelector('ts-date-calendar-range')!;

        const end = new Date(2024, 4, 20);

        el.valueStart = '05/10/2024'; // formatted value only
        el.activeField = 'end';

        const wait = oneEvent(el, 'ts-date-range-select');

        cal.dispatchEvent(
            new CustomEvent('ts-date-range-select', {
                detail: { end },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;

        expect(ev.detail.end.getTime()).to.equal(end.getTime());
    });

    it('emits ts-shortcut-select when shortcut is clicked', async () => {
        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range .shortcuts=${[0, 1]}></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const shortcuts = el.shadowRoot!.querySelector('ts-date-shortcuts')!;

        const wait = oneEvent(el, 'ts-shortcut-select');

        shortcuts.dispatchEvent(
            new CustomEvent('ts-shortcut-select', {
                detail: { index: 1 },
                bubbles: true,
                composed: true,
            }),
        );

        const ev = await wait;
        expect(ev.detail.index).to.equal(1);
    });

    it('calls onAfterShow when dropdown fires ts-after-show', async () => {
        let called = false;

        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range .onAfterShow=${() => (called = true)}></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const dropdown = el.shadowRoot!.querySelector('ts-dropdown')!;

        dropdown.dispatchEvent(new CustomEvent('ts-after-show', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('calls onAfterHide when dropdown fires ts-after-hide', async () => {
        let called = false;

        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range .onAfterHide=${() => (called = true)}></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const dropdown = el.shadowRoot!.querySelector('ts-dropdown')!;

        dropdown.dispatchEvent(new CustomEvent('ts-after-hide', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('changes activeField to start on clicking start input', async () => {
        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const start = el.shadowRoot!.querySelector('ts-date-input-start')!;

        start.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

        expect(el.activeField).to.equal('start');
    });

    it('changes activeField to end on clicking end input', async () => {
        const el: TsDateDropdownRangeComponent = await fixture(html`
            <ts-date-dropdown-range></ts-date-dropdown-range>
        `);

        await el.updateComplete;

        const end = el.shadowRoot!.querySelector('ts-date-input-end')!;

        end.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

        expect(el.activeField).to.equal('end');
    });
});
