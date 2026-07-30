import { aTimeout, expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsOption } from '@components/option/index.js';

import '@tuvsud/design-system/option';
import '@tuvsud/design-system/select';

describe('option component <ts-option>', () => {
    it('passes accessibility test', async () => {
        const el = await fixture<TsOption>(html`
            <ts-select label="Select one">
                <ts-option value="1">Option 1</ts-option>
                <ts-option value="2">Option 2</ts-option>
                <ts-option value="3">Option 3</ts-option>
                <ts-option value="4" disabled>Disabled</ts-option>
            </ts-select>
        `);

        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsOption>(html` <ts-option>Test</ts-option> `);

        expect(el.value).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.getAttribute('aria-disabled')).to.equal('false');
    });

    it('changes aria attributes', async () => {
        const el = await fixture<TsOption>(html` <ts-option>Test</ts-option> `);

        el.disabled = true;
        await aTimeout(100);
        expect(el.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should convert non-string values to string', async () => {
        const el = await fixture<TsOption>(html` <ts-option>Text</ts-option> `);

        // @ts-expect-error - intentional
        el.value = 10;
        await el.updateComplete;

        expect(el.value).to.equal('10');
    });

    it('should escape HTML when calling getTextLabel()', async () => {
        const el = await fixture<TsOption>(html` <ts-option><strong>Option</strong></ts-option> `);
        expect(el.getTextLabel()).to.equal('Option');
    });

    describe('<ts-option> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsOption>(html`<ts-option></ts-option>`);
            const cssText = getCssText(el);

            // base option
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('line-height: var(--ts-line-height-200);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            /*expect(cssText).to.include(
                'padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-300);',
            );*/

            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) fill;');

            // hover
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-hover);');

            // current
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-hover);');

            // check slot
            expect(cssText).to.include('padding-inline-end: var(--ts-semantic-size-space-100);');

            // prefix/suffix slots
            expect(cssText).to.include('margin-inline-end: var(--ts-semantic-size-space-100);');
            expect(cssText).to.include('margin-inline-start: var(--ts-semantic-size-space-100);');
        });
    });
});
