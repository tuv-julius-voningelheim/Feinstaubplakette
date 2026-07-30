import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsTableFooter } from '@components/table/table-footer/index.js';

import '@tuvsud/design-system/table/table-footer';
import '@tuvsud/design-system/pagination';

describe('<ts-table-footer>', () => {
    it('renders the default entries-info text with from/to/total', async () => {
        const el = await fixture<TsTableFooter>(
            html`<ts-table-footer .from=${1} .to=${10} .total=${42}></ts-table-footer>`,
        );
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('.info')!.textContent).to.contain('Showing 1 to 10 of 42 entries');
    });

    it('handles the zero-entries edge case', async () => {
        const el = await fixture<TsTableFooter>(
            html`<ts-table-footer .from=${0} .to=${0} .total=${0}></ts-table-footer>`,
        );
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('.info')!.textContent).to.contain('Showing 0 to 0 of 0 entries');
    });

    it('supports a custom infoTemplate with {from}/{to}/{total} tokens', async () => {
        const el = await fixture<TsTableFooter>(html`<ts-table-footer></ts-table-footer>`);
        await aTimeout(0);
        el.from = 5;
        el.to = 14;
        el.total = 99;
        el.infoTemplate = '{from}–{to} / {total}';
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('.info')!.textContent!.trim()).to.equal('5–14 / 99');
    });

    it('updates info text when from/to/total properties change', async () => {
        const el = await fixture<TsTableFooter>(
            html`<ts-table-footer .from=${1} .to=${10} .total=${30}></ts-table-footer>`,
        );
        await aTimeout(0);
        el.from = 11;
        el.to = 20;
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('.info')!.textContent).to.contain('11 to 20 of 30');
    });

    it('renders ts-pagination when show-pagination is true (default)', async () => {
        const el = await fixture<TsTableFooter>(html`<ts-table-footer .pageCount=${5}></ts-table-footer>`);
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('ts-pagination')).to.exist;
    });

    it('hides ts-pagination when showPagination is toggled to false after render', async () => {
        const el = await fixture<TsTableFooter>(html`<ts-table-footer .pageCount=${3}></ts-table-footer>`);
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('ts-pagination')).to.exist;
        el.showPagination = false;
        await aTimeout(0);
        expect(el.shadowRoot!.querySelector('ts-pagination')).to.not.exist;
    });

    it('passes pageCount to the ts-pagination component', async () => {
        const el = await fixture<TsTableFooter>(html`<ts-table-footer .pageCount=${7}></ts-table-footer>`);
        await aTimeout(0);
        const pagination = el.shadowRoot!.querySelector('ts-pagination') as HTMLElement & { count: number };
        expect(pagination.count).to.equal(7);
    });

    it('bubbles ts-page-click events from ts-pagination through the footer', async () => {
        const el = await fixture<TsTableFooter>(html`<ts-table-footer .pageCount=${5}></ts-table-footer>`);
        await aTimeout(0);
        const handler = sinon.spy();
        el.addEventListener('ts-page-click', handler);

        el.shadowRoot!.querySelector('ts-pagination')!.dispatchEvent(
            new CustomEvent('ts-page-click', { detail: { page: 3 }, bubbles: true, composed: true }),
        );

        expect(handler).to.have.been.calledOnce;
        expect(handler.firstCall.args[0].detail.page).to.equal(3);
    });
});
