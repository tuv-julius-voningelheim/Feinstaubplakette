import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsCopyButton } from '@components/copy-button/index.js';

import '@tuvsud/design-system/copy-button';

// We use aria-live to announce labels via tooltips
const ignoredRules = ['button-name'];

describe('copy button component <ts-copy-button>', () => {
    let el: TsCopyButton;

    describe('when provided no parameters', () => {
        before(async () => {
            el = await fixture(html`<ts-copy-button value="something"></ts-copy-button> `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible({ ignoredRules });
        });
    });

    describe('<ts-copy-button> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsCopyButton>(html`<ts-copy-button></ts-copy-button>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--error-color: var(--ts-semantic-color-icon-danger-default);');
            expect(cssText).to.include('--success-color: var(--ts-semantic-color-icon-success-default);');

            // button styles
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-xfast) color;');

            // success / error state
            expect(cssText).to.include('color: var(--success-color);');
            expect(cssText).to.include('color: var(--error-color);');

            // focus outline
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');
        });
    });
});
