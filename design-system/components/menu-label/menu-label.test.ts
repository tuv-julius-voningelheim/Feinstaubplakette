import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsMenuLabel } from '@components/menu-label/index.js';

import '@tuvsud/design-system/menu-label';

describe('menu label component <ts-menu-label>', () => {
    it('passes accessibility test', async () => {
        const el = await fixture<TsMenuLabel>(html` <ts-menu-label>menu label</ts-menu-label> `);
        await expect(el).to.be.accessible();
    });

    describe('<ts-menu-label> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsMenuLabel>(html`<ts-menu-label></ts-menu-label>`);
            const cssText = getCssText(el);

            // typography
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-bold);');
            expect(cssText).to.include('line-height: var(--ts-line-height-200);');

            // color
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            // spacing
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-500);');
        });
    });
});
