import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import type { TsAccordionItem } from './index.js';

import '@tuvsud/design-system/accordion-item';

describe('<ts-accordion-item>', () => {
    describe('accessibility', () => {
        it('should be accessible when closed', async () => {
            const item = await fixture<TsAccordionItem>(
                html`<ts-accordion-item summary="Test"> Test text </ts-accordion-item>`,
            );
            await expect(item).to.be.accessible();
        });

        it('should be accessible when open', async () => {
            const item = await fixture<TsAccordionItem>(
                html`<ts-accordion-item open summary="Test">Test text</ts-accordion-item>`,
            );
            await expect(item).to.be.accessible();
        });
    });

    it('should be visible with the open attribute', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item open>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('.accordion-item__body')!;
        expect(parseInt(getComputedStyle(body).height)).to.be.greaterThan(0);
    });

    it('should not be visible without the open attribute', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item summary="click me">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('.accordion-item__body')!;
        expect(parseInt(getComputedStyle(body).height)).to.equal(0);
    });

    it('should emit ts-show and ts-after-show when calling show()', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();
        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.show();
        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);
        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
    });

    it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item open>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();
        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.hide();
        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);
        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
    });

    it('should emit ts-show and ts-after-show when setting open = true', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('.accordion-item__body')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();
        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.open = true;
        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);
        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(body.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item open>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();
        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.open = false;
        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);
        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
    });

    it('should not open when preventing ts-show', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const showHandler = sinon.spy((event: TsShowEvent) => event.preventDefault());
        el.addEventListener('ts-show', showHandler);
        el.open = true;
        await waitUntil(() => showHandler.calledOnce);
        expect(showHandler).to.have.been.calledOnce;
        expect(el.open).to.be.false;
    });

    it('should not close when preventing ts-hide', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <ts-accordion-item open>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </ts-accordion-item>
        `);
        const hideHandler = sinon.spy((event: TsHideEvent) => event.preventDefault());
        el.addEventListener('ts-hide', hideHandler);
        el.open = false;
        await waitUntil(() => hideHandler.calledOnce);
        expect(hideHandler).to.have.been.calledOnce;
        expect(el.open).to.be.true;
    });

    it('should be the correct size after opening more than one instance', async () => {
        const el = await fixture<TsAccordionItem>(html`
            <div>
                <ts-accordion-item>
                    <div style="height: 200px;"></div>
                </ts-accordion-item>
                <ts-accordion-item>
                    <div style="height: 400px;"></div>
                </ts-accordion-item>
            </div>
        `);
        const first = el.querySelectorAll('ts-accordion-item')[0] as TsAccordionItem;
        const second = el.querySelectorAll('ts-accordion-item')[1] as TsAccordionItem;
        const firstBody = first!.shadowRoot!.querySelector('.accordion-item__body')!;
        const secondBody = second!.shadowRoot!.querySelector('.accordion-item__body')!;
        await first!.show();
        await second!.show();
        expect(firstBody.clientHeight).to.equal(232);
        expect(secondBody.clientHeight).to.equal(432);
    });

    describe('<ts-accordion-item> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsAccordionItem>(html`<ts-accordion-item></ts-accordion-item>`);
            const cssText = getCssText(el);
            expect(cssText).to.include('border: solid 1px var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('line-height: var(--ts-line-height-300);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-500);');
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-medium) rotate ease;');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-500);');
        });
    });
});
