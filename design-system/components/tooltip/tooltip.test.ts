import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsTooltip } from '@components/tooltip/index.js';

import '@tuvsud/design-system/tooltip';
import '@tuvsud/design-system/button';

describe('tooltip component <ts-tooltip>', () => {
    it('should be visible with the open attribute', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;

        expect(body.hidden).to.be.false;
    });

    it('should not be visible without the open attribute', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip">
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;

        expect(body.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when calling show()', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip">
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.show();

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(body.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.hide();

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(body.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when setting open = true', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip">
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
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
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.open = false;

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(body.hidden).to.be.true;
    });

    it('should hide the tooltip when tooltip is visible and disabled becomes true', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.disabled = true;

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(body.hidden).to.be.true;
    });

    it('should show when open initially', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
        await el.updateComplete;

        expect(body.hidden).to.be.false;
    });

    it('should not accept user selection on the tooltip', async () => {
        const el = await fixture<TsTooltip>(html`
            <ts-tooltip content="This is a tooltip" open>
                <ts-button>Hover Me</ts-button>
            </ts-tooltip>
        `);
        const tooltipBody = el.shadowRoot!.querySelector('.tooltip__body')!;
        const userSelect = getComputedStyle(tooltipBody).userSelect || getComputedStyle(tooltipBody).webkitUserSelect;

        expect(userSelect).to.equal('none');
    });

    describe('<ts-tooltip> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTooltip>(html`<ts-tooltip></ts-tooltip>`);
            const cssText = getCssText(el);

            // Host variables
            expect(cssText).to.include('--max-width: 20rem;');
            expect(cssText).to.include('--hide-delay: 0ms;');
            expect(cssText).to.include('--show-delay: 150ms;');

            // Arrow
            expect(cssText).to.include('--arrow-size: 6px;');
            expect(cssText).to.include('--arrow-color: var(--ts-semantic-color-background-primary-dark-default);');

            // Tooltip body
            expect(cssText).to.include('max-width: var(--max-width);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-dark-default);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );

            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-300);');
        });
    });
});
