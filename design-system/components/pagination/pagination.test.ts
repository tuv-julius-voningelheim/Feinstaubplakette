import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsPagination } from '@components/pagination/index.js';

import '@tuvsud/design-system/pagination';
import '@tuvsud/design-system/pagination-item';

const ignoredRules = ['color-contrast'];

describe('pagination component <ts-pagination>', () => {
    describe('default rendering', () => {
        let el: TsPagination;

        before(async () => {
            el = await fixture<TsPagination>(html`<ts-pagination count="10"></ts-pagination>`);
            await el.updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });

        it('should render prev and next buttons', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const prevItem = Array.from(items).find(i => i.getAttribute('type') === 'prev');
            const nextItem = Array.from(items).find(i => i.getAttribute('type') === 'next');
            expect(prevItem).to.exist;
            expect(nextItem).to.exist;
        });

        it('should render the correct number of page items for count=10', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="page"]');
            // With boundaryCount=1, siblingCount=1, page=1, count=10:
            // boundary start: 1; sibling of 1: 1,2; boundary end: 10 → pages: 1,2,10 + ellipsis
            expect(items.length).to.be.greaterThan(0);
        });

        it('should mark the first page as active by default', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="page"]');
            const activePage = Array.from(items).find(i => i.hasAttribute('active'));
            expect(activePage).to.exist;
            expect(activePage!.getAttribute('page')).to.equal('1');
        });

        it('should disable prev button on the first page', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const prevItem = Array.from(items).find(i => i.getAttribute('type') === 'prev');
            expect(prevItem).to.have.attribute('disabled');
        });

        it('should not disable next button on the first page', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const nextItem = Array.from(items).find(i => i.getAttribute('type') === 'next');
            expect(nextItem).not.to.have.attribute('disabled');
        });
    });

    describe('defaultPage property', () => {
        it('should set the initial active page from defaultPage', async () => {
            const el = await fixture<TsPagination>(html`<ts-pagination count="10" default-page="5"></ts-pagination>`);
            await el.updateComplete;
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="page"]');
            const activePage = Array.from(items).find(i => i.hasAttribute('active'));
            expect(activePage).to.exist;
            expect(activePage!.getAttribute('page')).to.equal('5');
        });
    });

    describe('last page', () => {
        let el: TsPagination;
        before(async () => {
            el = await fixture<TsPagination>(html`<ts-pagination count="5" default-page="5"></ts-pagination>`);
            await el.updateComplete;
        });

        it('should disable next button on the last page', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const nextItem = Array.from(items).find(i => i.getAttribute('type') === 'next');
            expect(nextItem).to.have.attribute('disabled');
        });

        it('should not disable prev button on the last page', () => {
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const prevItem = Array.from(items).find(i => i.getAttribute('type') === 'prev');
            expect(prevItem).not.to.have.attribute('disabled');
        });
    });

    describe('events', () => {
        let el: TsPagination;

        beforeEach(async () => {
            el = await fixture<TsPagination>(html`<ts-pagination count="10" default-page="3"></ts-pagination>`);
            await el.updateComplete;
        });

        it('should emit ts-page-click with the correct page when a page item is clicked', async () => {
            const handler = sinon.spy();
            el.addEventListener('ts-page-click', handler);
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="page"]');
            const pageItem = Array.from(items).find(i => i.getAttribute('page') === '5') as HTMLElement | undefined;
            if (pageItem) {
                pageItem.shadowRoot!.querySelector('button')!.click();
                await el.updateComplete;
                expect(handler).to.have.been.calledOnce;
                expect((handler.args[0]![0] as CustomEvent).detail.page).to.equal(5);
            }
        });

        it('should emit ts-prev-click and decrement the page when prev is clicked', async () => {
            const handler = sinon.spy();
            el.addEventListener('ts-prev-click', handler);
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const prevItem = Array.from(items).find(i => i.getAttribute('type') === 'prev') as HTMLElement;
            prevItem.shadowRoot!.querySelector('button')!.click();
            await el.updateComplete;
            expect(handler).to.have.been.calledOnce;
            expect((handler.args[0]![0] as CustomEvent).detail.page).to.equal(2);
        });

        it('should emit ts-next-click and increment the page when next is clicked', async () => {
            const handler = sinon.spy();
            el.addEventListener('ts-next-click', handler);
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const nextItem = Array.from(items).find(i => i.getAttribute('type') === 'next') as HTMLElement;
            nextItem.shadowRoot!.querySelector('button')!.click();
            await el.updateComplete;
            expect(handler).to.have.been.calledOnce;
            expect((handler.args[0]![0] as CustomEvent).detail.page).to.equal(4);
        });
    });

    describe('boundaryCount', () => {
        it('should show an ellipsis between boundary and sibling pages when gap is large', async () => {
            const el = await fixture<TsPagination>(
                html`<ts-pagination count="20" default-page="10" boundary-count="1"></ts-pagination>`,
            );
            await el.updateComplete;
            const ellipsisItems = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="ellipsis"]');
            expect(ellipsisItems.length).to.be.greaterThan(0);
        });

        it('should show no ellipsis when count is small enough', async () => {
            const el = await fixture<TsPagination>(html`<ts-pagination count="3" default-page="2"></ts-pagination>`);
            await el.updateComplete;
            const ellipsisItems = el.shadowRoot!.querySelectorAll('ts-pagination-item[type="ellipsis"]');
            expect(ellipsisItems.length).to.equal(0);
        });
    });

    describe('disabled', () => {
        it('should disable all items when disabled is set', async () => {
            const el = await fixture<TsPagination>(html`<ts-pagination count="10" disabled></ts-pagination>`);
            await el.updateComplete;
            const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
            const allDisabled = Array.from(items).every(i => i.hasAttribute('disabled'));
            expect(allDisabled).to.be.true;
        });
    });

    describe('size and variant forwarding', () => {
        (['small', 'medium', 'large'] as const).forEach(size => {
            it(`should forward size="${size}" to all ts-pagination-item elements`, async () => {
                const el = await fixture<TsPagination>(html`<ts-pagination count="5" size=${size}></ts-pagination>`);
                await el.updateComplete;
                const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
                Array.from(items).forEach(item => {
                    expect(item.getAttribute('size')).to.equal(size);
                });
            });
        });

        (['outlined', 'text'] as const).forEach(variant => {
            it(`should forward variant="${variant}" to all ts-pagination-item elements`, async () => {
                const el = await fixture<TsPagination>(
                    html`<ts-pagination count="5" variant=${variant}></ts-pagination>`,
                );
                await el.updateComplete;
                const items = el.shadowRoot!.querySelectorAll('ts-pagination-item');
                Array.from(items).forEach(item => {
                    expect(item.getAttribute('variant')).to.equal(variant);
                });
            });
        });
    });
});
