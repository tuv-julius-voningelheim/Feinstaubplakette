import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import type { TsPaginationItem } from '@components/pagination-item/index.js';

import '@tuvsud/design-system/pagination-item';

const ignoredRules = ['color-contrast'];

describe('pagination-item component <ts-pagination-item>', () => {
    describe('default rendering', () => {
        let el: TsPaginationItem;

        before(async () => {
            el = await fixture<TsPaginationItem>(html`<ts-pagination-item page="1">1</ts-pagination-item>`);
            await el.updateComplete;
        });

        it('should pass accessibility tests', async () => {
            await expect(document.body).to.be.accessible({ ignoredRules });
        });

        it('should render a button element', () => {
            const button = el.shadowRoot!.querySelector('button');
            expect(button).to.exist;
        });

        it('should default to medium size', () => {
            expect(el.size).to.equal('medium');
        });

        it('should default to outlined variant', () => {
            expect(el.variant).to.equal('outlined');
        });

        it('should default to type page', () => {
            expect(el.type).to.equal('page');
        });
    });

    describe('size variants', () => {
        (['small', 'medium', 'large'] as const).forEach(size => {
            it(`should apply correct class for size="${size}"`, async () => {
                const el = await fixture<TsPaginationItem>(
                    html`<ts-pagination-item page="1" size=${size}>1</ts-pagination-item>`,
                );
                await el.updateComplete;
                const button = el.shadowRoot!.querySelector('button')!;
                expect(button.classList.contains(`pagination-item--${size}`)).to.be.true;
            });
        });
    });

    describe('active state', () => {
        it('should set aria-current="page" when active', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item page="3" active>3</ts-pagination-item>`,
            );
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.getAttribute('aria-current')).to.equal('page');
        });

        it('should not set aria-current when not active', async () => {
            const el = await fixture<TsPaginationItem>(html`<ts-pagination-item page="2">2</ts-pagination-item>`);
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector('button')!;
            // aria-current is removed entirely (not set to "false") when the item is inactive
            expect(button.getAttribute('aria-current')).to.be.null;
        });
    });

    describe('disabled state', () => {
        it('should disable the button when disabled', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item page="1" disabled>1</ts-pagination-item>`,
            );
            await el.updateComplete;
            const button = el.shadowRoot!.querySelector('button')!;
            expect(button.disabled).to.be.true;
        });

        it('should not emit ts-page-click when disabled', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item page="1" disabled>1</ts-pagination-item>`,
            );
            await el.updateComplete;
            const handler = sinon.spy();
            el.addEventListener('ts-page-click', handler);
            const button = el.shadowRoot!.querySelector('button')!;
            button.click();
            expect(handler).not.to.have.been.called;
        });
    });

    describe('events', () => {
        it('should emit ts-page-click with the correct page when clicked', async () => {
            const el = await fixture<TsPaginationItem>(html`<ts-pagination-item page="5">5</ts-pagination-item>`);
            await el.updateComplete;
            const handler = sinon.spy();
            el.addEventListener('ts-page-click', handler);
            el.shadowRoot!.querySelector('button')!.click();
            expect(handler).to.have.been.calledOnce;
            expect((handler.args[0]![0] as CustomEvent).detail.page).to.equal(5);
        });

        it('should emit ts-nav-click with direction="prev" when type is prev', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item type="prev" page="2">‹</ts-pagination-item>`,
            );
            await el.updateComplete;
            const handler = sinon.spy();
            el.addEventListener('ts-nav-click', handler);
            el.shadowRoot!.querySelector('button')!.click();
            expect(handler).to.have.been.calledOnce;
            const detail = (handler.args[0]![0] as CustomEvent).detail;
            expect(detail.direction).to.equal('prev');
            expect(detail.page).to.equal(2);
        });

        it('should emit ts-nav-click with direction="next" when type is next', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item type="next" page="4">›</ts-pagination-item>`,
            );
            await el.updateComplete;
            const handler = sinon.spy();
            el.addEventListener('ts-nav-click', handler);
            el.shadowRoot!.querySelector('button')!.click();
            expect(handler).to.have.been.calledOnce;
            const detail = (handler.args[0]![0] as CustomEvent).detail;
            expect(detail.direction).to.equal('next');
            expect(detail.page).to.equal(4);
        });
    });

    describe('ellipsis type', () => {
        it('should not emit any event when type is ellipsis', async () => {
            const el = await fixture<TsPaginationItem>(
                html`<ts-pagination-item type="ellipsis">…</ts-pagination-item>`,
            );
            await el.updateComplete;
            const handler = sinon.spy();
            el.addEventListener('ts-page-click', handler);
            el.addEventListener('ts-nav-click', handler);
            el.shadowRoot!.querySelector('button')!.click();
            expect(handler).not.to.have.been.called;
        });
    });
});
