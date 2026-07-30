import { expect, fixture, html } from '@open-wc/testing';

import type { TsRow } from '@components/table/row/index.js';

import '@tuvsud/design-system/table/row';

describe('<ts-row>', () => {
    // ── ARIA / role ───────────────────────────────────────────────────────────

    it('has role="row" by default', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        expect(el.getAttribute('role')).to.equal('row');
    });

    // ── Property reflection ───────────────────────────────────────────────────

    it('reflects the header property to the [header] attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        expect(el.hasAttribute('header')).to.be.false;
        el.header = true;
        await el.updateComplete;
        expect(el.hasAttribute('header')).to.be.true;
    });

    it('initialises header=true from the HTML attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row header></ts-row>`);
        expect(el.header).to.be.true;
    });

    it('reflects the fixed attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row fixed="top"></ts-row>`);
        expect(el.fixed).to.equal('top');
        el.fixed = 'bottom';
        await el.updateComplete;
        expect(el.getAttribute('fixed')).to.equal('bottom');
    });

    it('reflects the clickable property to the [clickable] attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        expect(el.hasAttribute('clickable')).to.be.false;
        el.clickable = true;
        await el.updateComplete;
        expect(el.hasAttribute('clickable')).to.be.true;
    });

    it('reflects the selected property to the [selected] attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        expect(el.hasAttribute('selected')).to.be.false;
        el.selected = true;
        await el.updateComplete;
        expect(el.hasAttribute('selected')).to.be.true;
    });

    it('removes the [selected] attribute when selected is set back to false', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        el.selected = true;
        await el.updateComplete;
        el.selected = false;
        await el.updateComplete;
        expect(el.hasAttribute('selected')).to.be.false;
    });

    it('reflects the striped property to the [striped] attribute', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        expect(el.hasAttribute('striped')).to.be.false;
        el.striped = true;
        await el.updateComplete;
        expect(el.hasAttribute('striped')).to.be.true;
    });

    it('removes the [striped] attribute when striped is set back to false', async () => {
        const el = await fixture<TsRow>(html`<ts-row></ts-row>`);
        el.striped = true;
        await el.updateComplete;
        el.striped = false;
        await el.updateComplete;
        expect(el.hasAttribute('striped')).to.be.false;
    });

    // ── Slot ─────────────────────────────────────────────────────────────────

    it('renders a default slot that distributes cell children', async () => {
        const el = await fixture<TsRow>(html`<ts-row><span>x</span></ts-row>`);
        const slot = el.shadowRoot!.querySelector('slot')!;
        const assigned = slot.assignedElements({ flatten: true });
        expect(assigned.length).to.equal(1);
        expect(assigned[0]!.textContent).to.equal('x');
    });
});
