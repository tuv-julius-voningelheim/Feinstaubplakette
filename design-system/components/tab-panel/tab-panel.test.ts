import { aTimeout, expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsTabPanel } from '@components/tab-panel/index.js';

import '@tuvsud/design-system/tab-panel';

describe('tab panel component <ts-tab-panel>', () => {
    it('passes accessibility test', async () => {
        const el = await fixture<TsTabPanel>(html` <ts-tab-panel>Test</ts-tab-panel> `);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsTabPanel>(html` <ts-tab-panel>Test</ts-tab-panel> `);

        expect(el.id).to.equal('ts-tab-panel-2');
        expect(el.name).to.equal('');
        expect(el.active).to.equal(false);
        expect(el.getAttribute('role')).to.equal('tabpanel');
        expect(el.getAttribute('aria-hidden')).to.equal('true');
    });

    it('properties should reflect', async () => {
        const el = await fixture<TsTabPanel>(html` <ts-tab-panel>Test</ts-tab-panel> `);

        el.name = 'test';
        el.active = true;
        await aTimeout(100);
        expect(el.getAttribute('name')).to.equal('test');
        expect(el.hasAttribute('active')).to.equal(true);
    });

    it('changing active should always update aria-hidden role', async () => {
        const el = await fixture<TsTabPanel>(html` <ts-tab-panel>Test</ts-tab-panel> `);

        el.active = true;
        await aTimeout(100);
        expect(el.getAttribute('aria-hidden')).to.equal('false');
    });

    it('passed id should be used', async () => {
        const el = await fixture<TsTabPanel>(html` <ts-tab-panel id="test-id">Test</ts-tab-panel> `);

        expect(el.id).to.equal('test-id');
    });

    describe('<ts-tab-panel> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTabPanel>(html`<ts-tab-panel></ts-tab-panel>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
        });
    });
});
