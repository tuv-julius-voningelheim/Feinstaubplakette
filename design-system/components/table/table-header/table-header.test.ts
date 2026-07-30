import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsTablePageSizeChangeEvent, TsTableSearchChangeEvent } from '@utils/events/events.js';

import type { TsTableHeader } from '@components/table/table-header/index.js';

import '@tuvsud/design-system/table/table-header';
import '@tuvsud/design-system/select';
import '@tuvsud/design-system/input';

describe('<ts-table-header>', () => {
    it('renders a ts-input (search) and ts-select (page-size) by default', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header></ts-table-header>`);
        // aTimeout(0) drains locale requestUpdate microtasks + nested component init
        await aTimeout(0);
        const root = el.shadowRoot!;
        expect(root.querySelector('ts-input')).to.exist;
        expect(root.querySelector('ts-select')).to.exist;
    });

    it.skip('hides the search input when show-search is false', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header ?show-search=${false}></ts-table-header>`);
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('ts-input')).to.not.exist;
    });

    it.skip('hides the page-size selector when show-page-size is false', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header ?show-page-size=${false}></ts-table-header>`);
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('ts-select')).to.not.exist;
    });

    it('renders ts-option elements matching pageSizeOptions', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header></ts-table-header>`);
        await aTimeout(0);
        el.pageSizeOptions = [5, 10, 20];
        await aTimeout(0);
        // ts-option elements are slotted inside ts-select which lives in this shadow root
        const opts = Array.from(el.shadowRoot!.querySelectorAll('ts-option')).map(o => Number(o.getAttribute('value')));
        expect(opts).to.deep.equal([5, 10, 20]);
    });

    it('renders the page-size label and suffix from i18n (English default)', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header></ts-table-header>`);
        await aTimeout(0);
        const left = el.shadowRoot!.querySelector('.left')!.textContent!;
        expect(left).to.include('Show');
        expect(left).to.include('entries');
    });

    it('overrides the page-size label and suffix via properties', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header></ts-table-header>`);
        await aTimeout(0);
        el.pageSizeLabel = 'Zeige';
        el.pageSizeSuffix = 'Einträge';
        await aTimeout(0);
        const left = el.shadowRoot!.querySelector('.left')!.textContent!;
        expect(left).to.include('Zeige');
        expect(left).to.include('Einträge');
    });

    it('emits ts-table-page-size-change when ts-select fires ts-change', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header></ts-table-header>`);
        await aTimeout(0);
        const handler = sinon.spy();
        el.addEventListener('ts-table-page-size-change', handler);

        // The internal handler reads (event.target as TsSelect).value — set it first.
        const select = el.shadowRoot!.querySelector('ts-select') as Element & { value: string };
        select.value = '25';
        select.dispatchEvent(new CustomEvent('ts-change', { bubbles: true, composed: true }));

        expect(handler).to.have.been.calledOnce;
        const evt = handler.firstCall.args[0] as TsTablePageSizeChangeEvent;
        expect(evt.detail.pageSize).to.equal(25);
        expect(el.pageSize).to.equal(25);
    });

    it('emits ts-table-search-change debounced after ts-input fires ts-input', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header search-debounce="200"></ts-table-header>`);
        await aTimeout(0);

        const handler = sinon.spy();
        el.addEventListener('ts-table-search-change', handler);

        const input = el.shadowRoot!.querySelector('ts-input') as Element & { value: string };

        // Use sinon fake timers so the debounce advances deterministically
        const clock = sinon.useFakeTimers();
        try {
            input.value = 'hello';
            input.dispatchEvent(new CustomEvent('ts-input', { bubbles: true, composed: true }));

            // Should not fire synchronously (debounced)
            expect(handler).to.not.have.been.called;

            clock.tick(250);

            expect(handler).to.have.been.calledOnce;
            const evt = handler.firstCall.args[0] as TsTableSearchChangeEvent;
            expect(evt.detail.query).to.equal('hello');
        } finally {
            clock.restore();
        }
    });

    it('debounces — only the final value within the window is emitted', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header search-debounce="200"></ts-table-header>`);
        await aTimeout(0);

        const handler = sinon.spy();
        el.addEventListener('ts-table-search-change', handler);

        const input = el.shadowRoot!.querySelector('ts-input') as Element & { value: string };

        const clock = sinon.useFakeTimers();
        try {
            for (const v of ['a', 'ab', 'abc']) {
                input.value = v;
                input.dispatchEvent(new CustomEvent('ts-input', { bubbles: true, composed: true }));
                clock.tick(50); // advance less than debounce window
            }

            // Timer not yet expired — no event
            expect(handler).to.not.have.been.called;

            clock.tick(300); // expire the debounce window

            expect(handler).to.have.been.calledOnce;
            expect(handler.firstCall.args[0].detail.query).to.equal('abc');
        } finally {
            clock.restore();
        }
    });

    it('does not emit ts-table-search-change before the debounce window closes', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header search-debounce="500"></ts-table-header>`);
        await aTimeout(0);

        const handler = sinon.spy();
        el.addEventListener('ts-table-search-change', handler);

        const input = el.shadowRoot!.querySelector('ts-input') as Element & { value: string };

        const clock = sinon.useFakeTimers();
        try {
            input.value = 'fast';
            input.dispatchEvent(new CustomEvent('ts-input', { bubbles: true, composed: true }));

            // Only 200 ms have passed — debounce window (500 ms) has NOT closed yet
            clock.tick(200);
            expect(handler).to.not.have.been.called;
        } finally {
            clock.restore();
        }
    });

    it('uses searchPlaceholder property to override the default placeholder', async () => {
        const el = await fixture<TsTableHeader>(html`<ts-table-header search-placeholder="Find…"></ts-table-header>`);
        await aTimeout(0);
        const input = el.shadowRoot!.querySelector('ts-input')!;
        expect(input.getAttribute('placeholder')).to.equal('Find…');
    });
});
