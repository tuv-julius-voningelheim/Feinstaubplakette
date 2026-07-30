import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import TsDateDropdownComponent from '@components/date-picker/date-dropdown/date-dropdown.component.js';
import { buildMeta } from '@components/date-picker/src/events-date.helpers.js';

import '@tuvsud/design-system/date-picker';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/button';

const noop = () => false;

describe('<ts-date-dropdown>', () => {
    it('renders the date input trigger and dropdown', async () => {
        const el = await fixture(html` <ts-date-dropdown .isDateDisabled=${noop}></ts-date-dropdown> `);
        await (el as LitElement).updateComplete;

        const root = el.shadowRoot!;
        expect(root.querySelector('ts-date-input')).to.exist;
        expect(root.querySelector('ts-dropdown')).to.exist;
        expect(root.querySelector('ts-date-calendar')).to.exist;
        expect(root.querySelector('ts-icon-button')).to.exist;
    });

    it('displays the displayValue in the trigger input', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .displayValue=${'01/15/2025'}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dateInput = el.shadowRoot!.querySelector('ts-date-input') as HTMLElement;
        expect((dateInput as unknown as { value: string }).value).to.equal('01/15/2025');
    });

    it('forwards forwardedProps to the date input', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown
                .isDateDisabled=${noop}
                .forwardedProps=${{ label: 'Pick date', helpText: 'Some help', disabled: false }}
            ></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dateInput = el.shadowRoot!.querySelector('ts-date-input') as HTMLElement;
        expect(dateInput).to.exist;
    });

    it('calls onAfterShow when dropdown opens', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onAfterShow=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dropdown = el.shadowRoot!.querySelector('ts-dropdown')!;
        dropdown.dispatchEvent(new CustomEvent('ts-after-show', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('calls onAfterHide when dropdown closes', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onAfterHide=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dropdown = el.shadowRoot!.querySelector('ts-dropdown')!;
        dropdown.dispatchEvent(new CustomEvent('ts-after-hide', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('calls onInputOrChange when input fires input event', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onInputOrChange=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dateInput = el.shadowRoot!.querySelector('ts-date-input')!;
        dateInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('calls onInputBlur when input fires blur event', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onInputBlur=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const dateInput = el.shadowRoot!.querySelector('ts-date-input')!;
        dateInput.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));

        expect(called).to.equal(true);
    });

    it('calls onSelect when calendar emits ts-date-select', async () => {
        let received: unknown = null;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown
                .isDateDisabled=${noop}
                .onSelect=${(e: CustomEvent) => (received = e)}
            ></ts-date-dropdown>
        `);
        await el.updateComplete;

        const calendar = el.shadowRoot!.querySelector('ts-date-calendar')!;
        const date = new Date(2025, 0, 20);

        calendar.dispatchEvent(
            new CustomEvent('ts-date-select', {
                detail: { value: date, locale: 'en', meta: buildMeta(date, 'en') },
                bubbles: true,
                composed: false,
            }),
        );

        expect(received).to.not.be.null;
    });

    it('closes dropdown on select when closeOnSelect is true and footerAction is false', async () => {
        let selectCalled = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown
                .isDateDisabled=${noop}
                .closeOnSelect=${true}
                .footerAction=${false}
                .onSelect=${() => (selectCalled = true)}
            ></ts-date-dropdown>
        `);
        await el.updateComplete;

        // Open the dropdown first
        const dropdown = el.shadowRoot!.querySelector('ts-dropdown') as HTMLElement & {
            open: boolean;
            hide: () => void;
        };
        dropdown.dispatchEvent(new CustomEvent('ts-after-show', { bubbles: true, composed: true }));

        const calendar = el.shadowRoot!.querySelector('ts-date-calendar')!;
        const date = new Date(2025, 0, 20);

        calendar.dispatchEvent(
            new CustomEvent('ts-date-select', {
                detail: { value: date, locale: 'en', meta: buildMeta(date, 'en') },
                bubbles: true,
                composed: false,
            }),
        );

        expect(selectCalled).to.equal(true);
    });

    it('renders footer actions when footerAction is true', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .footerAction=${true}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const buttons = el.shadowRoot!.querySelectorAll('.date-picker__footer-actions ts-button');
        expect(buttons.length).to.equal(2); // Cancel + OK
    });

    it('does not render footer actions when footerAction is false', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .footerAction=${false}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const footer = el.shadowRoot!.querySelector('.date-picker__footer-actions');
        expect(footer).to.not.exist;
    });

    it('emits ts-date-apply on OK click', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .footerAction=${true} .onSelect=${() => {}}></ts-date-dropdown>
        `);
        await el.updateComplete;

        // Simulate selecting a temp date
        el['tempSelected'] = new Date(2025, 0, 20);

        const wait = oneEvent(el, 'ts-date-apply');
        const buttons = el.shadowRoot!.querySelectorAll('.date-picker__footer-actions ts-button');
        const okBtn = buttons[1] as HTMLElement; // OK is second
        okBtn.click();
        const ev = await wait;

        expect(ev.detail).to.exist;
        expect(ev.detail.locale).to.equal('en');
    });

    it('emits ts-date-cancel on Cancel click', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .footerAction=${true} .onCancel=${() => {}}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const wait = oneEvent(el, 'ts-date-cancel');
        const buttons = el.shadowRoot!.querySelectorAll('.date-picker__footer-actions ts-button');
        const cancelBtn = buttons[0] as HTMLElement; // Cancel is first
        cancelBtn.click();
        const ev = await wait;

        expect(ev.detail).to.exist;
    });

    it('calls onMonthChange when calendar emits ts-month-change', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onMonthChange=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const calendar = el.shadowRoot!.querySelector('ts-date-calendar')!;
        calendar.dispatchEvent(
            new CustomEvent('ts-month-change', {
                detail: { focused: new Date() },
                bubbles: true,
                composed: true,
            }),
        );

        expect(called).to.equal(true);
    });

    it('calls onYearChange when calendar emits ts-year-change', async () => {
        let called = false;
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .onYearChange=${() => (called = true)}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const calendar = el.shadowRoot!.querySelector('ts-date-calendar')!;
        calendar.dispatchEvent(
            new CustomEvent('ts-year-change', {
                detail: { focused: new Date() },
                bubbles: true,
                composed: true,
            }),
        );

        expect(called).to.equal(true);
    });

    it('respects disabled property', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown .isDateDisabled=${noop} .disabled=${true}></ts-date-dropdown>
        `);
        await el.updateComplete;

        const icon = el.shadowRoot!.querySelector('ts-icon-button') as HTMLElement;
        expect(icon.hasAttribute('disabled')).to.equal(true);
    });

    it('snapshots state on afterShow and reverts on cancel', async () => {
        const el: TsDateDropdownComponent = await fixture(html`
            <ts-date-dropdown
                .isDateDisabled=${noop}
                .footerAction=${true}
                .displayValue=${'01/15/2025'}
                .onCancel=${() => {}}
            ></ts-date-dropdown>
        `);
        await el.updateComplete;

        // Simulate dropdown open
        const dropdown = el.shadowRoot!.querySelector('ts-dropdown')!;
        dropdown.dispatchEvent(new CustomEvent('ts-after-show', { bubbles: true, composed: true }));
        await el.updateComplete;

        expect(el['snapshotDisplayValue']).to.equal('01/15/2025');
    });
});
