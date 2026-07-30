import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsIconButton } from '@components/icon-button/index.js';
import type { TsTab } from '@components/tab/index.js';
import type { TsTabGroup } from '@components/tab-group/index.js';

import '@tuvsud/design-system/tab';
import '@tuvsud/design-system/tab-group';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/icon';

describe('tab component <ts-tab>', () => {
    it('passes accessibility test', async () => {
        const el = await fixture<TsTab>(html`
            <ts-tab-group>
                <ts-tab slot="nav">Test</ts-tab>
            </ts-tab-group>
        `);

        await expect(el).to.be.accessible();
    });

    it('should render default tab', async () => {
        const el = await fixture<TsTab>(html` <ts-tab>Test</ts-tab> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(el.getAttribute('role')).to.equal('tab');
        expect(el.getAttribute('aria-disabled')).to.equal('false');
        expect(el.getAttribute('aria-selected')).to.equal('false');
        expect(el.getAttribute('tabindex')).to.equal('0');
        expect(base.getAttribute('class')).to.equal(' tab tab-top ');
        expect(el.active).to.equal(false);
        expect(el.closable).to.equal(false);
        expect(el.disabled).to.equal(false);
    });

    it('should disable tab by attribute', async () => {
        const el = await fixture<TsTab>(html` <ts-tab disabled>Test</ts-tab> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(el.disabled).to.equal(true);
        expect(el.getAttribute('aria-disabled')).to.equal('true');
        expect(base.getAttribute('class')).to.equal(' tab tab--disabled tab-top ');
        expect(el.getAttribute('tabindex')).to.equal('-1');
    });

    it('should set active tab by attribute', async () => {
        const el = await fixture<TsTab>(html` <ts-tab active>Test</ts-tab> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(el.active).to.equal(true);
        expect(el.getAttribute('aria-selected')).to.equal('true');
        expect(base.getAttribute('class')).to.equal(' tab tab--active tab-top ');
        expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('should set closable by attribute', async () => {
        const el = await fixture<TsTab>(html` <ts-tab closable>Test</ts-tab> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const closeButton = el.shadowRoot!.querySelector('[part~="close-button"]');

        expect(el.closable).to.equal(true);
        expect(base.getAttribute('class')).to.match(/tab tab--closable/);
        expect(closeButton).not.to.be.null;
    });

    describe('focus', () => {
        it('should focus itself', async () => {
            const el = await fixture<TsTab>(html` <ts-tab>Test</ts-tab> `);

            el.focus();
            await el.updateComplete;

            expect(document.activeElement).to.equal(el);
        });
    });

    describe('blur', () => {
        it('should blur itself', async () => {
            const el = await fixture<TsTab>(html` <ts-tab>Test</ts-tab> `);

            el.focus();
            await el.updateComplete;

            expect(document.activeElement).to.equal(el);

            el.blur();
            await el.updateComplete;

            expect(document.activeElement).to.not.equal(el);
        });
    });

    describe('closable', () => {
        it('should emit close event when the close button is clicked', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" closable>General</ts-tab>
                    <ts-tab slot="nav" panel="custom" closable>Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom">This is the custom tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);
            const closeButton = tabGroup
                .querySelectorAll('ts-tab')[0]!
                .shadowRoot!.querySelector<TsIconButton>('[part~="close-button"]')!;

            const handleClose = sinon.spy();
            const handleTabShow = sinon.spy();

            tabGroup.addEventListener('ts-close', handleClose, { once: true });
            // The ts-tab-show event shouldn't be emitted when clicking the close button
            tabGroup.addEventListener('ts-tab-show', handleTabShow);

            closeButton.click();
            await closeButton?.updateComplete;

            expect(handleClose.called).to.equal(true);
            expect(handleTabShow.called).to.equal(false);
        });
    });

    describe('<ts-tab> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTab>(html`<ts-tab></ts-tab>`);
            const cssText = getCssText(el);

            // typography
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');

            // colors
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-primary-default);');

            // focus
            expect(cssText).to.include('outline: solid 2px var(--ts-semantic-color-border-primary-focused);');
        });
    });
});
