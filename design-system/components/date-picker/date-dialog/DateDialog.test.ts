import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { LitElement } from 'lit';

import TsDateDialogComponent from '@components/date-picker/date-dialog/date-dialog.component.js';
import { buildMeta } from '@components/date-picker/src/events-date.helpers.js';

import '@tuvsud/design-system/date-picker';
import '@tuvsud/design-system/dialog';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/input';
import '@tuvsud/design-system/button';

const noop = () => false;

describe('<ts-date-dialog>', () => {
    it('renders all base elements', async () => {
        const el = await fixture(html` <ts-date-dialog .isDateDisabled=${noop}></ts-date-dialog> `);
        await (el as LitElement).updateComplete;

        const root = el.shadowRoot!;
        expect(root.querySelector('ts-date-input')).to.exist;
        expect(root.querySelector('ts-dialog')).to.exist;
        expect(root.querySelector('ts-icon-button')).to.exist;
        expect(root.querySelector('ts-date-calendar')).to.exist;
        expect(root.querySelectorAll('ts-button').length).to.equal(2);
    });

    it('opens dialog on calendar icon click', async () => {
        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog .isDateDisabled=${noop}></ts-date-dialog>
        `);
        await el.updateComplete;

        const icon = el.shadowRoot!.querySelector('ts-icon-button')!;
        icon.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await el.updateComplete;

        expect(el.open).to.equal(true);
    });

    it('sets open false when dialog fires ts-after-hide', async () => {
        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog .isDateDisabled=${noop}></ts-date-dialog>
        `);

        await el.updateComplete;

        el.open = true;
        await el.updateComplete;

        const dialog = el.shadowRoot!.querySelector('ts-dialog')!;

        dialog.dispatchEvent(new CustomEvent('ts-after-hide', { bubbles: true, composed: true }));

        await el.updateComplete;

        expect(el.open).to.equal(false);
    });

    it('updates tempSelected on temporary calendar select', async () => {
        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog .isDateDisabled=${noop}></ts-date-dialog>
        `);
        await el.updateComplete;

        const date = new Date(2024, 0, 10);
        const calendar = el.shadowRoot!.querySelector('ts-date-calendar')!;

        calendar.dispatchEvent(
            new CustomEvent('ts-date-select', {
                bubbles: true,
                composed: true,
                detail: {
                    value: date,
                    locale: 'en',
                    meta: buildMeta(date, 'en'),
                },
            }),
        );

        await el.updateComplete;

        expect(el['tempSelected']!.getTime()).to.equal(date.getTime());
    });

    it('restores snapshotSelected on cancel', async () => {
        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog .isDateDisabled=${noop}></ts-date-dialog>
        `);
        await el.updateComplete;

        el['snapshotSelected'] = new Date(2030, 0, 1);
        el['tempSelected'] = new Date(2040, 0, 1);

        const cancelBtn = el.shadowRoot!.querySelectorAll('ts-button')[0] as HTMLElement;
        cancelBtn.click();
        await el.updateComplete;

        expect(el['tempSelected']!.getTime()).to.equal(el['snapshotSelected']!.getTime());
    });

    it('emits ts-date-select on OK', async () => {
        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog
                .isDateDisabled=${noop}
                .onSelect=${(e: Event) => {
                    // Re-dispatch forwarded event so the test can observe it via oneEvent()
                    el.dispatchEvent(e);
                }}
            ></ts-date-dialog>
        `);
        await el.updateComplete;

        el.open = true;
        await el.updateComplete;

        el['tempSelected'] = new Date(2021, 5, 5);

        const okBtn = el.shadowRoot!.querySelectorAll('ts-button')[1] as HTMLElement;
        setTimeout(() => okBtn.click());

        const ev = await oneEvent(el, 'ts-date-select');
        expect((ev as CustomEvent).detail.value.getFullYear()).to.equal(2021);
    });

    it('calls onMonthChange when calendar emits month change', async () => {
        let called = false;

        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog
                .isDateDisabled=${noop}
                .onMonthChange=${() => {
                    called = true;
                }}
            ></ts-date-dialog>
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

    it('forwards input events to handlers', async () => {
        let inputCalled = false;
        let blurCalled = false;

        const el: TsDateDialogComponent = await fixture(html`
            <ts-date-dialog
                .isDateDisabled=${noop}
                .onInputOrChange=${() => (inputCalled = true)}
                .onInputBlur=${() => (blurCalled = true)}
            ></ts-date-dialog>
        `);

        await el.updateComplete;

        const input = el.shadowRoot!.querySelector('ts-date-input')!;

        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true, composed: true }));

        expect(inputCalled).to.equal(true);
        expect(blurCalled).to.equal(true);
    });
});
