import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsDrawer } from '@components/drawer/index.js';

import '@tuvsud/design-system/drawer';

describe('drawer component <ts-drawer>', () => {
    it('should be visible with the open attribute', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.hidden).to.be.false;
    });

    it('should not be visible without the open attribute', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when calling show()', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.show();

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.hide();

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when setting open = true', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.open = true;

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.open = false;

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.true;
    });

    it('should not close when ts-request-close is prevented', async () => {
        const el = await fixture<TsDrawer>(html`
            <ts-drawer open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-drawer>
        `);
        const overlay = el.shadowRoot!.querySelector<HTMLElement>('[part~="overlay"]')!;

        el.addEventListener('ts-request-close', event => {
            event.preventDefault();
        });
        overlay.click();

        expect(el.open).to.be.true;
    });

    it('should allow initial focus to be set', async () => {
        const el = await fixture<TsDrawer>(html` <ts-drawer><input /></ts-drawer> `);
        const input = el.querySelector<HTMLInputElement>('input')!;
        const initialFocusHandler = sinon.spy((event: CustomEvent) => {
            event.preventDefault();
            input.focus();
        });

        el.addEventListener('ts-initial-focus', initialFocusHandler as unknown as EventListener);
        el.show();

        await waitUntil(() => initialFocusHandler.calledOnce);

        expect(initialFocusHandler).to.have.been.calledOnce;
        expect(document.activeElement).to.equal(input);
    });

    it('should close when pressing Escape', async () => {
        const el = await fixture<TsDrawer>(html` <ts-drawer open></ts-drawer> `);
        const hideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);

        await sendKeys({ press: 'Escape' });
        await waitUntil(() => hideHandler.calledOnce);

        expect(el.open).to.be.false;
    });

    describe('<ts-drawer> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsDrawer>(html`<ts-drawer></ts-drawer>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--size: 25rem;');
            expect(cssText).to.include('--header-spacing: var(--ts-semantic-size-space-600);');
            expect(cssText).to.include('--body-spacing: var(--ts-semantic-size-space-600);');
            expect(cssText).to.include('--footer-spacing: var(--ts-semantic-size-space-600);');

            // container
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            // fixed variant
            expect(cssText).to.include('z-index: var(--ts-semantic-distance-zindex-drawer);');

            // panel
            expect(cssText).to.include('background-color: var(--ts-semantic-color-surface-base-default);');
            expect(cssText).to.include('box-shadow: var(--ts-semantic-shadow-light-xl);');

            // top, end, bottom, start positions
            expect(cssText).to.include('height: var(--size);');
            expect(cssText).to.include('width: var(--size);');

            // title
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-xl);');
            expect(cssText).to.include('padding: var(--header-spacing);');

            // header actions
            expect(cssText).to.include('gap: var(--ts-semantic-size-space-100);');
            expect(cssText).to.include('padding: 0 var(--header-spacing);');
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');

            // body
            expect(cssText).to.include('padding: var(--body-spacing);');

            // footer
            expect(cssText).to.include('padding: var(--footer-spacing);');
            expect(cssText).to.include('margin-inline-end: var(--ts-semantic-size-space-300);');

            // overlay
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-disabled);');

            // forced colors
            expect(cssText).to.include('border: solid 1px var(--ts-semantic-color-border-base-default);');
        });
    });
});
