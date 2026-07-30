import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsColumnResizeEvent, TsColumnSortEvent } from '@utils/events/events.js';

import type { TsColumn } from '@components/table/column/index.js';

import '@tuvsud/design-system/table/column';

describe('<ts-column>', () => {
    it('has role="columnheader"', async () => {
        const el = await fixture<TsColumn>(html`<ts-column field="name">Name</ts-column>`);
        expect(el.getAttribute('role')).to.equal('columnheader');
    });

    it('does NOT render a sort button when not sortable', async () => {
        const el = await fixture<TsColumn>(html`<ts-column field="name">Name</ts-column>`);
        expect(el.shadowRoot!.querySelector('.sort-button')).to.not.exist;
        expect(el.shadowRoot!.querySelector('.sort-indicator')).to.not.exist;
    });

    it('renders a sort button and indicator when sortable', async () => {
        const el = await fixture<TsColumn>(html`<ts-column field="name" sortable>Name</ts-column>`);
        expect(el.shadowRoot!.querySelector('.sort-button')).to.exist;
        expect(el.shadowRoot!.querySelector('.sort-indicator')).to.exist;
    });

    it('cycles direction asc → desc → none in the emitted detail', async () => {
        const el = await fixture<TsColumn>(html`<ts-column field="name" sortable>Name</ts-column>`);
        const handler = sinon.spy();
        el.addEventListener('ts-column-sort', handler);

        const click = () => el.shadowRoot!.querySelector<HTMLButtonElement>('.sort-button')!.click();

        click(); // none → asc
        el.sortDirection = 'asc';
        await el.updateComplete;

        click(); // asc → desc
        el.sortDirection = 'desc';
        await el.updateComplete;

        click(); // desc → none

        const dirs = handler.getCalls().map(c => (c.args[0] as TsColumnSortEvent).detail.direction);
        expect(dirs).to.deep.equal(['asc', 'desc', 'none']);
    });

    it('renders a resize handle only when resizable', async () => {
        const a = await fixture<TsColumn>(html`<ts-column field="name">Name</ts-column>`);
        expect(a.shadowRoot!.querySelector('.resize-handle')).to.not.exist;

        const b = await fixture<TsColumn>(html`<ts-column field="name" resizable>Name</ts-column>`);
        expect(b.shadowRoot!.querySelector('.resize-handle')).to.exist;
    });

    it('emits ts-column-resize on pointer drag', async () => {
        const el = await fixture<TsColumn>(html`<ts-column field="name" resizable width="120px">Name</ts-column>`);
        const handler = sinon.spy();
        el.addEventListener('ts-column-resize', handler);

        const handle = el.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!;
        // Simulate the full drag lifecycle
        handle.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, bubbles: true, composed: true }));
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 180 }));
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: 180 }));

        expect(handler).to.have.been.calledOnce;
        const evt = handler.firstCall.args[0] as TsColumnResizeEvent;
        expect(evt.detail.field).to.equal('name');
        expect(evt.detail.width).to.match(/^\d+px$/);
    });

    it('aria-sort reflects the current sort direction', async () => {
        // aria-sort is set on the host element (which carries role="columnheader"),
        // not on the internal .sort-button.
        const el = await fixture<TsColumn>(html`<ts-column field="name" sortable>Name</ts-column>`);
        el.sortDirection = 'asc';
        await el.updateComplete;
        expect(el.getAttribute('aria-sort')).to.equal('ascending');

        el.sortDirection = 'desc';
        await el.updateComplete;
        expect(el.getAttribute('aria-sort')).to.equal('descending');

        el.sortDirection = 'none';
        await el.updateComplete;
        expect(el.getAttribute('aria-sort')).to.equal('none');
    });
});
