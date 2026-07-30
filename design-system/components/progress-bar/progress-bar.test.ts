import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsProgressBar } from '@components/progress-bar/index.js';

import '@tuvsud/design-system/progress-bar';

describe('progressbar component<ts-progress-bar>', () => {
    let el: TsProgressBar;

    describe('when provided just a value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressBar>(html`<ts-progress-bar value="25"></ts-progress-bar>`);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('when provided a title, and value parameter', () => {
        let base: HTMLDivElement;
        let indicator: HTMLDivElement;

        before(async () => {
            el = await fixture<TsProgressBar>(
                html`<ts-progress-bar title="Titled Progress Ring" value="25"></ts-progress-bar>`,
            );
            base = el.shadowRoot!.querySelector('[part~="base"]')!;
            indicator = el.shadowRoot!.querySelector('[part~="indicator"]')!;
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });

        it('uses the value parameter on the base, as aria-valuenow', () => {
            expect(base).attribute('aria-valuenow', '25');
        });

        it('appends a % to the value, and uses it as the  the value parameter to determine the width on the "indicator" part', () => {
            expect(indicator).attribute('style', 'width:25%;');
        });
    });

    describe('when provided an indeterminate parameter', () => {
        let base: HTMLDivElement;

        before(async () => {
            el = await fixture<TsProgressBar>(
                html`<ts-progress-bar title="Titled Progress Ring" indeterminate></ts-progress-bar>`,
            );
            base = el.shadowRoot!.querySelector('[part~="base"]')!;
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });

        it('should append a progress-bar--indeterminate class to the "base" part.', () => {
            expect(base.classList.value.trim()).to.eq('progress-bar progress-bar--indeterminate');
        });
    });

    describe('when provided a ariaLabel, and value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressBar>(
                html`<ts-progress-bar ariaLabel="Labelled Progress Ring" value="25"></ts-progress-bar>`,
            );
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('when provided a ariaLabelledBy, and value parameter', () => {
        before(async () => {
            el = await fixture<TsProgressBar>(html`
                <label id="labelledby">Progress Ring Label</label>
                <ts-progress-bar ariaLabelledBy="labelledby" value="25"></ts-progress-bar>
            `);
        });

        it('should pass accessibility tests', async () => {
            await expect(el).to.be.accessible();
        });
    });

    describe('<ts-progress-bar> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsProgressBar>(html`<ts-progress-bar></ts-progress-bar>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--height: 1rem;');
            expect(cssText).to.include('--track-color: var(--ts-semantic-color-background-neutral-subtle-active);');
            expect(cssText).to.include('--indicator-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('--label-color: var(--ts-semantic-color-text-inverted-default);');

            // progress bar container
            expect(cssText).to.include('background-color: var(--track-color);');
            expect(cssText).to.include('height: var(--height);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('box-shadow: inset var(--ts-semantic-shadow-light-sm);');

            // indicator
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('background-color: var(--indicator-color);');
            expect(cssText).to.include('color: var(--label-color);');
            expect(cssText).to.include('line-height: var(--height);');
        });
    });
});
