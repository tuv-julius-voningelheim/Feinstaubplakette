import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsDivider } from '@components/divider/index.js';

import '@tuvsud/design-system/divider';

describe('divider component <ts-divider>', () => {
    describe('defaults ', () => {
        it('passes accessibility test', async () => {
            const el = await fixture<TsDivider>(html` <ts-divider decorative></ts-divider> `);
            await expect(el).to.be.accessible();
        });

        it('default properties', async () => {
            const el = await fixture<TsDivider>(html` <ts-divider .decorative=${false}></ts-divider> `);

            expect(el.vertical).to.be.false;
            expect(el.getAttribute('role')).to.equal('separator');
            expect(el.getAttribute('aria-orientation')).to.equal('horizontal');
        });
    });

    describe('vertical property change ', () => {
        it('aria-orientation is updated', async () => {
            const el = await fixture<TsDivider>(html` <ts-divider .vertical=${true} decorative></ts-divider> `);

            await elementUpdated(el);

            expect(el.getAttribute('aria-orientation')).to.equal('vertical');
        });
    });

    describe('<ts-divider> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsDivider>(html`<ts-divider decorative></ts-divider>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('--width: 1px;');
            expect(cssText).to.include('--spacing: var(--ts-semantic-size-space-500);');

            // horizontal divider
            expect(cssText).to.include('border-top: solid var(--width) var(--color);');
            expect(cssText).to.include('margin: var(--spacing) 0;');

            // vertical divider
            expect(cssText).to.include('border-left: solid var(--width) var(--color);');
            expect(cssText).to.include('margin: 0 var(--spacing);');
        });
    });
});
