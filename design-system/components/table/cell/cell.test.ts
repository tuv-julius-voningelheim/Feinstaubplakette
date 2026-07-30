import { expect, fixture, html } from '@open-wc/testing';

import type { TsCell } from '@components/table/cell/index.js';

import '@tuvsud/design-system/table/cell';

describe('<ts-cell>', () => {
    it('has role="cell"', async () => {
        const el = await fixture<TsCell>(html`<ts-cell></ts-cell>`);
        expect(el.getAttribute('role')).to.equal('gridcell');
    });

    it('reflects align attribute', async () => {
        const el = await fixture<TsCell>(html`<ts-cell align="right"></ts-cell>`);
        expect(el.align).to.equal('right');
    });

    it('reflects fixed attribute', async () => {
        const el = await fixture<TsCell>(html`<ts-cell fixed="left"></ts-cell>`);
        expect(el.fixed).to.equal('left');
    });

    it('applies the width inline-style from the width prop', async () => {
        const el = await fixture<TsCell>(html`<ts-cell width="180px">x</ts-cell>`);
        const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot')!;
        expect(slot.style.width).to.equal('180px');
    });

    it('renders slotted content', async () => {
        const el = await fixture<TsCell>(html`<ts-cell>hello</ts-cell>`);
        const slot = el.shadowRoot!.querySelector('slot')!;
        const nodes = slot.assignedNodes({ flatten: true });
        const text = nodes.map(n => n.textContent).join('');
        expect(text).to.contain('hello');
    });
});
