import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsSpinner } from '@components/spinner/index.js';

import '@tuvsud/design-system/spinner';

describe('spinner component <ts-spinner>', () => {
    describe('when provided no parameters', () => {
        it('should pass accessibility tests', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner></ts-spinner> `);
            await expect(spinner).to.be.accessible();
        });

        it('should have a role of "status".', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner></ts-spinner> `);
            const base = spinner.shadowRoot!.querySelector('[part~="base"]')!;
            expect(base).have.attribute('role', 'progressbar');
        });

        it('should use the localized "loading" term as aria-label by default', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner></ts-spinner> `);
            const base = spinner.shadowRoot!.querySelector('[part~="base"]')!;
            expect(base.getAttribute('aria-label')).to.equal('Loading');
        });

        it('should use the provided label as aria-label when set', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner label="Saving changes"></ts-spinner> `);
            const base = spinner.shadowRoot!.querySelector('[part~="base"]')!;
            expect(base.getAttribute('aria-label')).to.equal('Saving changes');
        });

        it('should use "transform: rotate(x)" instead of "rotate: x" when animating', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner></ts-spinner> `);
            const indicator = spinner.shadowRoot!.querySelector('.spinner__indicator')!;

            //
            // This matrix is the computed value when using `transform: rotate(x)` on the indicator. When using `rotate: x`,
            // it will be "none" instead.
            //
            expect(getComputedStyle(indicator).transform).to.equal('matrix(1, 0, 0, 1, 0, 0)');
        });

        it('should have flex:none to prevent flex re-sizing', async () => {
            const spinner = await fixture<TsSpinner>(html` <ts-spinner></ts-spinner> `);

            // 0 0 auto is a compiled value for `none`
            expect(getComputedStyle(spinner).flex).to.equal('0 0 auto');
        });
    });

    describe('<ts-spinner> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsSpinner>(html`<ts-spinner></ts-spinner>`);
            const cssText = getCssText(el);

            // host variables
            expect(cssText).to.include('--track-width: 2px;');
            expect(cssText).to.include('--track-color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('--indicator-color: var(--ts-semantic-color-border-primary-default);');
            expect(cssText).to.include('--speed: 2s;');

            // spinner track + indicator
            expect(cssText).to.include('stroke: var(--track-color);');
            expect(cssText).to.include('stroke: var(--indicator-color);');
            expect(cssText).to.include('animation: spin var(--speed) linear infinite;');

            // keyframes
            expect(cssText).to.include('@keyframes spin');
            expect(cssText).to.include('transform: rotate(0deg);');
            expect(cssText).to.include('transform: rotate(450deg);');
            expect(cssText).to.include('transform: rotate(1080deg);');
        });
    });
});
