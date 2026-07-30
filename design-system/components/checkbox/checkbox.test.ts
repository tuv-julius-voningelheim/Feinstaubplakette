import { aTimeout, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsCheckbox } from '@components/checkbox/index.js';

import '@tuvsud/design-system/checkbox';
import '@tuvsud/design-system/button';

describe('<ts-checkbox>', () => {
    it('should pass accessibility tests', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox>Checkbox</ts-checkbox> `);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox></ts-checkbox> `);

        expect(el.name).to.equal('');
        expect(el.value).to.be.undefined;
        expect(el.title).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.required).to.be.false;
        expect(el.checked).to.be.false;
        expect(el.indeterminate).to.be.false;
        expect(el.defaultChecked).to.be.false;
        expect(el.helpText).to.equal('');
    });

    it('should have title if title attribute is set', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox title="Test"></ts-checkbox> `);
        const input = el.shadowRoot!.querySelector('input')!;

        expect(input.title).to.equal('Test');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox disabled></ts-checkbox> `);
        const checkbox = el.shadowRoot!.querySelector('input')!;

        expect(checkbox.disabled).to.be.true;
    });

    it('should be disabled when disabled property is set', async () => {
        const el = await fixture<TsCheckbox>(html`<ts-checkbox></ts-checkbox>`);
        const checkbox = el.shadowRoot!.querySelector('input')!;

        el.disabled = true;
        await el.updateComplete;

        expect(checkbox.disabled).to.be.true;
    });

    it('should be valid by default', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox></ts-checkbox> `);
        expect(el.checkValidity()).to.be.true;
    });

    it('should not emit ts-change or ts-input when checked programmatically', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox></ts-checkbox> `);

        el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
        el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
        el.checked = true;
        await el.updateComplete;
        el.checked = false;
        await el.updateComplete;
    });

    it('should hide the native input with the correct positioning to scroll correctly when contained in an overflow', async () => {
        const el = await fixture<TsCheckbox>(html` <ts-checkbox></ts-checkbox> `);
        const label = el.shadowRoot!.querySelector('.checkbox')!;
        const input = el.shadowRoot!.querySelector('.checkbox__input')!;

        const labelPosition = getComputedStyle(label).position;
        const inputPosition = getComputedStyle(input).position;

        expect(labelPosition).to.equal('relative');
        expect(inputPosition).to.equal('absolute');
    });

    describe('when submitting a form', () => {
        it('should submit the correct value when a value is provided', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-checkbox name="a" value="1" checked></ts-checkbox>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => {
                formData = new FormData(form);
                event.preventDefault();
            });
            let formData: FormData;

            form.addEventListener('submit', submitHandler);
            button.click();

            await waitUntil(() => submitHandler.calledOnce);

            expect(formData!.get('a')).to.equal('1');
        });

        it('should submit "on" when no value is provided', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-checkbox name="a" checked></ts-checkbox>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => {
                formData = new FormData(form);
                event.preventDefault();
            });
            let formData: FormData;

            form.addEventListener('submit', submitHandler);
            button.click();

            await waitUntil(() => submitHandler.calledOnce);

            expect(formData!.get('a')).to.equal('on');
        });

        it('should be invalid when setCustomValidity() is called with a non-empty value', async () => {
            const checkbox = await fixture<HTMLFormElement>(html` <ts-checkbox></ts-checkbox> `);

            // Submitting the form after setting custom validity should not trigger the handler
            checkbox.setCustomValidity('Invalid selection');
            await checkbox.updateComplete;

            expect(checkbox.checkValidity()).to.be.false;
            expect(checkbox.checkValidity()).to.be.false;
            expect(checkbox.hasAttribute('data-invalid')).to.be.true;
            expect(checkbox.hasAttribute('data-valid')).to.be.false;
            expect(checkbox.hasAttribute('data-user-invalid')).to.be.false;
            expect(checkbox.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(checkbox);
            await checkbox.updateComplete;

            expect(checkbox.hasAttribute('data-user-invalid')).to.be.true;
            expect(checkbox.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should be invalid when required and unchecked', async () => {
            const checkbox = await fixture<HTMLFormElement>(html` <ts-checkbox required></ts-checkbox> `);
            expect(checkbox.checkValidity()).to.be.false;
        });

        it('should be valid when required and checked', async () => {
            const checkbox = await fixture<HTMLFormElement>(html` <ts-checkbox required checked></ts-checkbox> `);
            expect(checkbox.checkValidity()).to.be.true;
        });

        it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <div>
                    <form id="f">
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-checkbox form="f" name="a" value="1" checked></ts-checkbox>
                </div>
            `);
            const form = el.querySelector('form')!;
            const formData = new FormData(form);

            expect(formData.get('a')).to.equal('1');
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <form novalidate><ts-checkbox required></ts-checkbox></form>
            `);
            const checkbox = el.querySelector<TsCheckbox>('ts-checkbox')!;

            expect(checkbox.hasAttribute('data-required')).to.be.true;
            expect(checkbox.hasAttribute('data-optional')).to.be.false;
            expect(checkbox.hasAttribute('data-invalid')).to.be.true;
            expect(checkbox.hasAttribute('data-valid')).to.be.false;
            expect(checkbox.hasAttribute('data-user-invalid')).to.be.false;
            expect(checkbox.hasAttribute('data-user-valid')).to.be.false;
        });
    });

    describe('when resetting a form', () => {
        it('should reset the element to its initial value', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-checkbox name="a" value="1" checked></ts-checkbox>
                    <ts-button type="reset">Reset</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const checkbox: TsCheckbox = form.querySelector('ts-checkbox')!;
            checkbox.checked = false;

            await checkbox.updateComplete;
            setTimeout(() => button.click());

            await oneEvent(form, 'reset');
            await checkbox.updateComplete;

            expect(checkbox.checked).to.true;

            checkbox.defaultChecked = false;

            setTimeout(() => button.click());
            await oneEvent(form, 'reset');
            await checkbox.updateComplete;

            expect(checkbox.checked).to.false;
        });
    });

    describe('click', () => {
        it('should click the inner input', async () => {
            const el = await fixture<TsCheckbox>(html`<ts-checkbox></ts-checkbox>`);
            const checkbox = el.shadowRoot!.querySelector('input')!;
            const clickSpy = sinon.spy();

            checkbox.addEventListener('click', clickSpy, { once: true });

            el.click();
            await el.updateComplete;

            expect(clickSpy.called).to.equal(true);
            expect(el.checked).to.equal(true);
        });
    });

    describe('focus', () => {
        it('should focus the inner input', async () => {
            const el = await fixture<TsCheckbox>(html`<ts-checkbox></ts-checkbox>`);
            const checkbox = el.shadowRoot!.querySelector('input')!;
            const focusSpy = sinon.spy();

            checkbox.addEventListener('focus', focusSpy, { once: true });

            el.focus();
            await el.updateComplete;

            expect(focusSpy.called).to.equal(true);
            expect(el.shadowRoot!.activeElement).to.equal(checkbox);
        });

        it('should not jump the page to the bottom when focusing a checkbox at the bottom of an element with overflow: auto;', async () => {
            const el = await fixture<HTMLDivElement>(html`
                <div style="display: flex; flex-direction: column; overflow: auto; max-height: 400px; gap: 8px;">
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                    <ts-checkbox>Checkbox</ts-checkbox>
                </div>
                ;
            `);

            const checkboxes = el.querySelectorAll<TsCheckbox>('ts-checkbox');
            const lastSwitch = checkboxes[checkboxes.length - 1];

            expect(window.scrollY).to.equal(0);
            // Without these 2 timeouts, tests will pass unexpectedly in Safari.
            await aTimeout(10);
            lastSwitch!.focus();
            await aTimeout(10);
            expect(window.scrollY).to.equal(0);
        });
    });

    describe('blur', () => {
        it('should blur the inner input', async () => {
            const el = await fixture<TsCheckbox>(html`<ts-checkbox></ts-checkbox>`);
            const checkbox = el.shadowRoot!.querySelector('input')!;
            const blurSpy = sinon.spy();

            checkbox.addEventListener('blur', blurSpy, { once: true });

            el.focus();
            await el.updateComplete;

            el.blur();
            await el.updateComplete;

            expect(blurSpy.called).to.equal(true);
            expect(el.shadowRoot!.activeElement).to.equal(null);
        });
    });

    describe('indeterminate', () => {
        it('should render indeterminate icon until checked', async () => {
            const el = await fixture<TsCheckbox>(html`<ts-checkbox indeterminate></ts-checkbox>`);
            let indeterminateIcon = el.shadowRoot!.querySelector('[part~="indeterminate-icon"]')!;

            expect(indeterminateIcon).not.to.be.null;

            el.click();
            await el.updateComplete;

            indeterminateIcon = el.shadowRoot!.querySelector('[part~="indeterminate-icon"]')!;

            expect(indeterminateIcon).to.be.null;
        });

        runFormControlBaseTests('ts-checkbox');
    });

    describe('<ts-checkbox> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsCheckbox>(html`<ts-checkbox></ts-checkbox>`);
            const cssText = getCssText(el);

            // base typography + colors
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            // sizing presets
            expect(cssText).to.include('--toggle-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('--toggle-size: var(--ts-semantic-typography-ui-font-size-md);');

            // control box
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);',
            );
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');
            expect(cssText).to.include('transition:');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-fast) border-color');

            // hover
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');

            // focus
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');

            // checked / indeterminate
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-hover);');

            // label
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('line-height: var(--toggle-size);');

            // required mark
            expect(cssText).to.include('color: var(--ts-semantic-color-text-danger-default);');
        });
    });
});
