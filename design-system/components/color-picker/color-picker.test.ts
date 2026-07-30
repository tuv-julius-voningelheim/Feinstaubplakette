import { aTimeout, expect, fixture, html } from '@open-wc/testing';

import { clickOnElement, getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsColorPicker } from '@components/color-picker/index.js';

import '@tuvsud/design-system/color-picker';
import '@tuvsud/design-system/button';

describe('color picker component <ts-color-picker>', () => {
    describe('when using constraint validation', () => {
        it('should be valid by default', async () => {
            const el = await fixture<TsColorPicker>(html` <ts-color-picker></ts-color-picker> `);
            expect(el.checkValidity()).to.be.true;
        });

        it('should be invalid when required and empty', async () => {
            const el = await fixture<TsColorPicker>(html` <ts-color-picker required></ts-color-picker> `);
            expect(el.checkValidity()).to.be.false;
        });

        it('should be invalid when required and disabled is removed', async () => {
            const el = await fixture<TsColorPicker>(html` <ts-color-picker disabled required></ts-color-picker> `);
            el.disabled = false;
            await el.updateComplete;
            expect(el.checkValidity()).to.be.false;
        });

        it('should receive the correct validation attributes ("states") when valid', async () => {
            const el = await fixture<TsColorPicker>(html` <ts-color-picker required value="#fff"></ts-color-picker> `);
            const trigger = el.shadowRoot!.querySelector('[part~="trigger"]')!;
            const grid = el.shadowRoot!.querySelector('[part~="grid"]')!;

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.false;
            expect(el.hasAttribute('data-valid')).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(trigger);
            await aTimeout(500);
            await clickOnElement(grid);
            await el.updateComplete;

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.true;
        });

        it('should receive the correct validation attributes ("states") when invalid', async () => {
            const el = await fixture<TsColorPicker>(html` <ts-color-picker required></ts-color-picker> `);
            const trigger = el.shadowRoot!.querySelector('[part~="trigger"]')!;
            const grid = el.shadowRoot!.querySelector('[part~="grid"]')!;

            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.true;
            expect(el.hasAttribute('data-valid')).to.be.false;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(trigger);
            await aTimeout(500);
            await clickOnElement(grid);
            await el.updateComplete;

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.true;
        });
    });

    describe('<ts-color-picker> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsColorPicker>(html`<ts-color-picker></ts-color-picker>`);
            const cssText = getCssText(el);

            // typography + base colors
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');

            // inline variant
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);',
            );
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');

            // grid + handles
            expect(cssText).to.include('border-top-left-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('border-top-right-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) scale;');

            // controls
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-400);');

            // sliders
            expect(cssText).to.include('height: var(--slider-height);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('margin-bottom: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('width: var(--slider-handle-size);');
            expect(cssText).to.include('height: var(--slider-handle-size);');

            // preview
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('margin-left: var(--ts-semantic-size-space-600);');
            expect(cssText).to.include('background-color: var(--preview-color);');

            // user input
            expect(cssText).to.include(
                'padding: 0 var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-100);',
            );
            expect(cssText).to.include('margin-left: var(--ts-semantic-size-space-100);');

            // swatches
            expect(cssText).to.include('border-top: solid 1px var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-100);');
            expect(cssText).to.include('width: var(--swatch-size);');
            expect(cssText).to.include('height: var(--swatch-size);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-sm);');

            // transparent background
            expect(cssText).to.include('var(--ts-semantic-color-charts-neutral-300)');

            // dropdown
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);',
            );
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');

            // dropdown trigger sizes
            expect(cssText).to.include('width: var(--ts-semantic-size-space-900);');
            expect(cssText).to.include('height: var(--ts-semantic-size-space-900);');
            expect(cssText).to.include('width: var(--ts-semantic-size-space-1100);');
            expect(cssText).to.include('height: var(--ts-semantic-size-space-1100);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-pill);');
        });
    });

    runFormControlBaseTests('ts-color-picker');
});
