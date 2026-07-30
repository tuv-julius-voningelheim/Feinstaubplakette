import { expect, fixture, html, oneEvent } from '@open-wc/testing';

import { serialize } from '@utils/helper/form.js';
import { clickOnElement, getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsRange } from '@components/range/index.js';

import '@tuvsud/design-system/range';
import '@tuvsud/design-system/button';
import '@tuvsud/design-system/input';

describe('range component <ts-range>', () => {
    runFormControlBaseTests('ts-range');

    it('should pass accessibility tests', async () => {
        const el = await fixture<TsRange>(html` <ts-range label="Name"></ts-range> `);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsRange>(html` <ts-range></ts-range> `);

        expect(el.name).to.equal('');
        expect(el.value).to.equal(0);
        expect(el.title).to.equal('');
        expect(el.label).to.equal('');
        expect(el.helpText).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.checkValidity()).to.be.true;
        expect(el.min).to.equal(0);
        expect(el.max).to.equal(100);
        expect(el.step).to.equal(1);
        expect(el.tooltip).to.equal('top');
        expect(el.defaultValue).to.equal(0);
    });

    it('should have title if title attribute is set', async () => {
        const el = await fixture<TsRange>(html` <ts-range title="Test"></ts-range> `);
        const input = el.shadowRoot!.querySelector('input')!;

        expect(input.title).to.equal('Test');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsRange>(html` <ts-range disabled></ts-range> `);
        const input = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="input"]')!;

        expect(input.disabled).to.be.true;
    });

    describe('when submitting a form', () => {
        it('should serialize its name and value with FormData', async () => {
            const form = await fixture<HTMLFormElement>(html` <form><ts-range name="a" value="1"></ts-range></form> `);
            const formData = new FormData(form);
            expect(formData.get('a')).to.equal('1');
        });

        it('should serialize its name and value with JSON', async () => {
            const form = await fixture<HTMLFormElement>(html` <form><ts-range name="a" value="1"></ts-range></form> `);
            const json = serialize(form);
            expect(json.a).to.equal('1');
        });

        it('should be invalid when setCustomValidity() is called with a non-empty value', async () => {
            const range = await fixture<HTMLFormElement>(html` <ts-range></ts-range> `);

            range.setCustomValidity('Invalid selection');
            await range.updateComplete;

            expect(range.checkValidity()).to.be.false;
            expect(range.hasAttribute('data-invalid')).to.be.true;
            expect(range.hasAttribute('data-valid')).to.be.false;
            expect(range.hasAttribute('data-user-invalid')).to.be.false;
            expect(range.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(range);
            await range.updateComplete;
            range.blur();
            await range.updateComplete;

            expect(range.hasAttribute('data-user-invalid')).to.be.true;
            expect(range.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const el = await fixture<HTMLFormElement>(html` <form novalidate><ts-range></ts-range></form> `);
            const range = el.querySelector<TsRange>('ts-range')!;

            range.setCustomValidity('Invalid value');
            await range.updateComplete;

            expect(range.hasAttribute('data-invalid')).to.be.true;
            expect(range.hasAttribute('data-valid')).to.be.false;
            expect(range.hasAttribute('data-user-invalid')).to.be.false;
            expect(range.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <div>
                    <form id="f">
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-range form="f" name="a" value="50"></ts-range>
                </div>
            `);
            const form = el.querySelector('form')!;
            const formData = new FormData(form);

            expect(formData.get('a')).to.equal('50');
        });
    });

    describe('when resetting a form', () => {
        it('should reset the element to its initial value', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-range name="a" value="99"></ts-range>
                    <ts-button type="reset">Reset</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const input: TsRange = form.querySelector('ts-range')!;
            input.value = 80;

            await input.updateComplete;

            setTimeout(() => button.click());
            await oneEvent(form, 'reset');
            await input.updateComplete;

            expect(input.value).to.equal(99);

            input.defaultValue = 0;

            setTimeout(() => button.click());
            await oneEvent(form, 'reset');
            await input.updateComplete;

            expect(input.value).to.equal(0);
        });
    });

    describe('step', () => {
        it('should increment by step when stepUp() is called', async () => {
            const el = await fixture<TsRange>(html` <ts-range step="2" value="2"></ts-range> `);

            el.stepUp();
            await el.updateComplete;
            expect(el.value).to.equal(4);
        });

        it('should decrement by step when stepDown() is called', async () => {
            const el = await fixture<TsRange>(html` <ts-range step="2" value="2"></ts-range> `);

            el.stepDown();
            await el.updateComplete;
            expect(el.value).to.equal(0);
        });
    });

    describe('when the value changes', () => {
        it('should not emit ts-change or ts-input when changing the value programmatically', async () => {
            const el = await fixture<TsRange>(html` <ts-range value="0"></ts-range> `);

            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.value = 50;

            await el.updateComplete;
        });

        it('should not emit ts-change or ts-input when stepUp() is called programmatically', async () => {
            const el = await fixture<TsRange>(html` <ts-range step="2" value="2"></ts-range> `);

            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.stepUp();
            await el.updateComplete;
        });

        it('should not emit ts-change or ts-input when stepDown() is called programmatically', async () => {
            const el = await fixture<TsRange>(html` <ts-range step="2" value="2"></ts-range> `);

            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.stepDown();
            await el.updateComplete;
        });
    });

    describe('<ts-range> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsRange>(html`<ts-range></ts-range>`);
            const cssText = getCssText(el);

            // host custom properties
            expect(cssText).to.include('--thumb-size: 20px;');
            expect(cssText).to.include('--tooltip-offset: 10px;');
            expect(cssText).to.include('--track-color-active: var(--ts-semantic-color-border-neutral-subtle-active);');
            expect(cssText).to.include(
                '--track-color-inactive: var(--ts-semantic-color-border-neutral-subtle-active);',
            );
            expect(cssText).to.include('--thumb-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('--thumb-color-hover: var(--ts-semantic-color-background-primary-hover);');
            expect(cssText).to.include('--thumb-color-active: var(--ts-semantic-color-background-primary-active);');

            // webkit thumb
            expect(cssText).to.include('background-color: var(--thumb-color);');
            expect(cssText).to.include('border: solid var(--ts-semantic-size-width-xs) var(--thumb-color);');
            expect(cssText).to.include('background-color: var(--thumb-color-hover);');
            expect(cssText).to.include('border-color: var(--thumb-color-hover);');
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');
            expect(cssText).to.include('background-color: var(--thumb-color-active);');

            // tooltip
            expect(cssText).to.include('z-index: var(--ts-semantic-distance-zindex-tooltip);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-dark-default);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );

            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) opacity;');

            // tooltip arrows
            expect(cssText).to.include(
                'border-top: 6px solid var(--ts-semantic-color-background-primary-dark-default);',
            );
            expect(cssText).to.include(
                'border-bottom: 6px solid var(--ts-semantic-color-background-primary-dark-default);',
            );
        });
    });
});
