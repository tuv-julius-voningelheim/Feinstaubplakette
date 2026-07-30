import { elementUpdated, expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { getFormControls, serialize } from '@utils/helper/form.js';
import { getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsInput } from '@components/input/index.js';

import '@tuvsud/design-system/input';
import '@tuvsud/design-system/textarea';
import '@tuvsud/design-system/checkbox';

describe('input component <ts-input>', () => {
    it('should pass accessibility tests', async () => {
        const el = await fixture<TsInput>(html`<ts-input label="Name"></ts-input>`);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
        expect(el.type).to.equal('text');
        expect(el.size).to.equal('medium');
        expect(el.name).to.equal('');
        expect(el.value).to.equal('');
        expect(el.defaultValue).to.equal('');
        expect(el.title).to.equal('');
        expect(el.filled).to.be.false;
        expect(el.pill).to.be.false;
        expect(el.label).to.equal('');
        expect(el.helpText).to.equal('');
        expect(el.clearable).to.be.false;
        expect(el.passwordToggle).to.be.false;
        expect(el.passwordVisible).to.be.false;
        expect(el.noSpinButtons).to.be.false;
        expect(el.placeholder).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.readonly).to.be.false;
        expect(el.minlength).to.be.undefined;
        expect(el.maxlength).to.be.undefined;
        expect(el.min).to.be.undefined;
        expect(el.max).to.be.undefined;
        expect(el.step).to.be.undefined;
        expect(el.pattern).to.be.undefined;
        expect(el.required).to.be.false;
        expect(el.autocapitalize).to.be.undefined;
        expect(el.autocorrect).to.be.undefined;
        expect(el.autocomplete).to.be.undefined;
        expect(el.autofocus).to.be.undefined;
        expect(el.enterkeyhint).to.be.undefined;
        expect(el.spellcheck).to.be.true;
        expect(el.inputmode).to.be.undefined;
        expect(el.valueAsDate).to.be.null;
        expect(isNaN(el.valueAsNumber)).to.be.true;
    });

    it('should have title if title attribute is set', async () => {
        const el = await fixture<TsInput>(html`<ts-input title="Test"></ts-input>`);
        const input = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="input"]')!;
        expect(input.title).to.equal('Test');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsInput>(html`<ts-input disabled></ts-input>`);
        const input = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="input"]')!;
        expect(input.disabled).to.be.true;
    });

    describe('value methods', () => {
        it('should set the value as a number when using valueAsNumber', async () => {
            const el: HTMLElement = document.createElement('ts-input');
            (el as TsInput).type = 'number';
            const num = 12345;

            (el as TsInput).valueAsNumber = num;
            expect((el as TsInput).value).to.equal(num.toString());
            expect((el as TsInput).valueAsNumber).to.equal(num);

            document.body.appendChild(el);
            await elementUpdated(el);

            const otherNum = 4567;
            (el as TsInput).valueAsNumber = otherNum;
            await elementUpdated(el);
            expect((el as TsInput).value).to.equal(otherNum.toString());
            expect((el as TsInput).valueAsNumber).to.equal(otherNum);

            (el as TsInput).valueAsNumber = num;
            await elementUpdated(el);
            expect((el as TsInput).value).to.equal(num.toString());
            expect(Number((el as TsInput).valueAsNumber)).to.equal(num);

            el.remove();
        });
    });

    it('should focus the input when clicking on the label', async () => {
        const el = await fixture<TsInput>(html`<ts-input label="Name"></ts-input>`);
        const label = el.shadowRoot!.querySelector('[part~="form-control-label"]')!;
        const focusHandler = sinon.spy();

        el.addEventListener('ts-focus', focusHandler);
        (label as HTMLLabelElement).click();
        await waitUntil(() => focusHandler.calledOnce);
        expect(focusHandler).to.have.been.calledOnce;
    });

    describe('when using constraint validation', () => {
        it('should be valid by default', async () => {
            const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
            expect(el.checkValidity()).to.be.true;
        });

        it('should be invalid when required and empty', async () => {
            const el = await fixture<TsInput>(html`<ts-input required></ts-input>`);
            expect(el.reportValidity()).to.be.false;
            expect(el.checkValidity()).to.be.false;
        });

        it('should be invalid when required and disabled is removed', async () => {
            const el = await fixture<TsInput>(html`<ts-input disabled required></ts-input>`);
            el.disabled = false;
            await el.updateComplete;
            expect(el.checkValidity()).to.be.false;
        });

        it('should receive the correct validation attributes ("states") when valid', async () => {
            const el = await fixture<TsInput>(html`<ts-input required value="a"></ts-input>`);

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.false;
            expect(el.hasAttribute('data-valid')).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            el.focus();
            await el.updateComplete;
            await sendKeys({ press: 'b' });
            await el.updateComplete;
            el.blur();
            await el.updateComplete;

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.true;
        });

        it('should receive the correct validation attributes ("states") when invalid', async () => {
            const el = await fixture<TsInput>(html`<ts-input required></ts-input>`);

            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.true;
            expect(el.hasAttribute('data-valid')).to.be.false;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            el.focus();
            await el.updateComplete;
            await sendKeys({ press: 'a' });
            await sendKeys({ press: 'Backspace' });
            await el.updateComplete;
            el.blur();
            await el.updateComplete;

            expect(el.hasAttribute('data-user-invalid')).to.be.true;
            expect(el.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const wrapper = await fixture<HTMLFormElement>(
                html`<form novalidate><ts-input required></ts-input></form>`,
            );
            const input = wrapper.querySelector<TsInput>('ts-input')!;
            expect(input.hasAttribute('data-required')).to.be.true;
            expect(input.hasAttribute('data-optional')).to.be.false;
            expect(input.hasAttribute('data-invalid')).to.be.true;
            expect(input.hasAttribute('data-valid')).to.be.false;
            expect(input.hasAttribute('data-user-invalid')).to.be.false;
            expect(input.hasAttribute('data-user-valid')).to.be.false;
        });
    });

    describe('when submitting a form', () => {
        it('should serialize its name and value with FormData', async () => {
            const form = await fixture<HTMLFormElement>(html`<form><ts-input name="a" value="1"></ts-input></form>`);
            const formData = new FormData(form);
            expect(formData.get('a')).to.equal('1');
        });

        it('should serialize its name and value with JSON', async () => {
            const form = await fixture<HTMLFormElement>(html`<form><ts-input name="a" value="1"></ts-input></form>`);
            const json = serialize(form) as { a: '1' };
            expect(json.a).to.equal('1');
        });

        it('should submit the form when pressing enter in a form without a submit button', async () => {
            const form = await fixture<HTMLFormElement>(html`<form><ts-input></ts-input></form>`);
            const input = form.querySelector<TsInput>('ts-input')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => event.preventDefault());

            form.addEventListener('submit', submitHandler);
            input.focus();
            await sendKeys({ press: 'Enter' });
            await waitUntil(() => submitHandler.calledOnce);
            expect(submitHandler).to.have.been.calledOnce;
        });

        it('should prevent submission when pressing enter in an input and canceling the keydown event', async () => {
            const form = await fixture<HTMLFormElement>(html`<form><ts-input></ts-input></form>`);
            const input = form.querySelector<TsInput>('ts-input')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => event.preventDefault());
            const keydownHandler = sinon.spy((event: KeyboardEvent) => {
                if (event.key === 'Enter') event.preventDefault();
            });

            form.addEventListener('submit', submitHandler);
            input.addEventListener('keydown', keydownHandler);
            input.focus();
            await sendKeys({ press: 'Enter' });
            await waitUntil(() => keydownHandler.calledOnce);

            expect(keydownHandler).to.have.been.calledOnce;
            expect(submitHandler).to.not.have.been.called;
        });

        it('should be invalid when setCustomValidity() is called with a non-empty value', async () => {
            const input = await fixture<TsInput>(html`<ts-input></ts-input>`);
            input.setCustomValidity('Invalid selection');
            await input.updateComplete;

            expect(input.checkValidity()).to.be.false;
            expect(input.hasAttribute('data-invalid')).to.be.true;
            expect(input.hasAttribute('data-valid')).to.be.false;
            expect(input.hasAttribute('data-user-invalid')).to.be.false;
            expect(input.hasAttribute('data-user-valid')).to.be.false;

            input.focus();
            await sendKeys({ type: 'test' });
            await input.updateComplete;
            input.blur();
            await input.updateComplete;

            expect(input.hasAttribute('data-user-invalid')).to.be.true;
            expect(input.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
            const el = await fixture<HTMLDivElement>(html`
                <div>
                    <form id="f">
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-input form="f" name="a" value="1"></ts-input>
                </div>
            `);
            const form = el.querySelector<HTMLFormElement>('form')!;
            const formData = new FormData(form);
            expect(formData.get('a')).to.equal('1');
        });
    });

    describe('when calling HTMLFormElement.reportValidity()', () => {
        it('should be invalid when the input is empty and form.reportValidity() is called', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-input required value=""></ts-input>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            expect(form.reportValidity()).to.be.false;
        });

        it('should be valid when the input is empty, reportValidity() is called, and the form has novalidate', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form novalidate>
                    <ts-input required value=""></ts-input>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            expect(form.reportValidity()).to.be.true;
        });

        it('should be invalid when a native input is empty and form.reportValidity() is called', async () => {
            const form = await fixture<HTMLFormElement>(html`
        <form>
          <input required value=""></input>
          <ts-button type="submit">Submit</ts-button>
        </form>
      `);
            expect(form.reportValidity()).to.be.false;
        });
    });

    describe('when the value changes', () => {
        it('should emit ts-change and ts-input when the user types in the input', async () => {
            const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
            const inputHandler = sinon.spy();
            const changeHandler = sinon.spy();

            el.addEventListener('ts-input', inputHandler);
            el.addEventListener('ts-change', changeHandler);
            el.focus();
            await sendKeys({ type: 'abc' });
            el.blur();
            await el.updateComplete;

            expect(changeHandler).to.have.been.calledOnce;
            expect(inputHandler).to.have.been.calledThrice;
        });

        it('should not emit ts-change or ts-input when the value is set programmatically', async () => {
            const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.value = 'abc';
            await el.updateComplete;
        });

        it('should not emit ts-change or ts-input when calling setRangeText()', async () => {
            const el = await fixture<TsInput>(html`<ts-input value="hi there"></ts-input>`);
            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.focus();
            el.setSelectionRange(0, 2);
            el.setRangeText('hello');
            await el.updateComplete;
        });
    });

    describe('when type="number"', () => {
        it('should be valid when the value is within the boundary of a step', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step=".5" value="1.5"></ts-input>`);
            expect(el.checkValidity()).to.be.true;
        });

        it('should be invalid when the value is not within the boundary of a step', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step=".5" value="1.25"></ts-input>`);
            expect(el.checkValidity()).to.be.false;
        });

        it('should update validity when step changes', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step=".5" value="1.5"></ts-input>`);
            expect(el.checkValidity()).to.be.true;
            el.step = 1;
            await el.updateComplete;
            expect(el.checkValidity()).to.be.false;
        });

        it('should increment by step when stepUp() is called', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step="2" value="2"></ts-input>`);
            el.stepUp();
            await el.updateComplete;
            expect(el.value).to.equal('4');
        });

        it('should decrement by step when stepDown() is called', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step="2" value="2"></ts-input>`);
            el.stepDown();
            await el.updateComplete;
            expect(el.value).to.equal('0');
        });

        it('should not emit ts-input or ts-change when stepUp() is called programmatically', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step="2" value="2"></ts-input>`);
            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.stepUp();
            await el.updateComplete;
        });

        it('should not emit ts-input and ts-change when stepDown() is called programmatically', async () => {
            const el = await fixture<TsInput>(html`<ts-input type="number" step="2" value="2"></ts-input>`);
            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.stepDown();
            await el.updateComplete;
        });
    });

    describe('when using spellcheck', () => {
        it('should enable spellcheck when no attribute is present', async () => {
            const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
            const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
            expect(input.getAttribute('spellcheck')).to.equal('true');
            expect(input.spellcheck).to.be.true;
        });

        it('should enable spellcheck when set to "true"', async () => {
            const el = await fixture<TsInput>(html`<ts-input spellcheck="true"></ts-input>`);
            const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
            expect(input.getAttribute('spellcheck')).to.equal('true');
            expect(input.spellcheck).to.be.true;
        });

        it('should disable spellcheck when set to "false"', async () => {
            const el = await fixture<TsInput>(html`<ts-input spellcheck="false"></ts-input>`);
            const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
            expect(input.getAttribute('spellcheck')).to.equal('false');
            expect(input.spellcheck).to.be.false;
        });
    });

    describe('when using FormControlController', () => {
        it('should submit with the correct form when the form attribute changes', async () => {
            const el = await fixture<HTMLDivElement>(html`
                <div>
                    <form id="f1">
                        <input type="hidden" name="b" value="2" />
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <form id="f2">
                        <input type="hidden" name="c" value="3" />
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-input form="f1" name="a" value="1"></ts-input>
                </div>
            `);
            const form = el.querySelector<HTMLFormElement>('#f2')!;
            const input = el.querySelector<TsInput>('ts-input')!;
            input.form = 'f2';
            await input.updateComplete;

            const formData = new FormData(form);
            expect(formData.get('a')).to.equal('1');
            expect(formData.get('b')).to.be.null;
            expect(formData.get('c')).to.equal('3');
        });
    });

    describe('when using the getFormControls() function', () => {
        it('should return both native and Shoelace form controls in the correct DOM order', async () => {
            const el = await fixture<HTMLDivElement>(html`
                <div>
                    <input type="text" name="a" value="1" form="f1" />
                    <ts-input type="text" name="b" value="2" form="f1"></ts-input>
                    <form id="f1">
                        <input type="hidden" name="c" value="3" />
                        <input type="text" name="d" value="4" />
                        <ts-input name="e" value="5"></ts-input>
                        <textarea name="f">6</textarea>
                        <ts-textarea name="g" value="7"></ts-textarea>
                        <ts-checkbox name="h" value="8"></ts-checkbox>
                    </form>
                    <input type="text" name="i" value="9" form="f1" />
                    <ts-input type="text" name="j" value="10" form="f1"></ts-input>
                </div>
            `);
            const form = el.querySelector<HTMLFormElement>('form')!;
            const formControls = getFormControls(form) as HTMLInputElement[];
            expect(formControls.length).to.equal(10);
            expect(formControls.map(fc => (fc as HTMLInputElement).value).join('')).to.equal('12345678910');
        });
    });

    describe('when using the setRangeText() function', () => {
        it('should set replacement text in the correct location', async () => {
            const el = await fixture<TsInput>(html`<ts-input value="test"></ts-input>`);
            el.focus();
            el.setSelectionRange(1, 3);
            el.setRangeText('boom');
            await el.updateComplete;
            expect(el.value).to.equal('tboomt');
        });
    });

    describe('<ts-input> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsInput>(html`<ts-input></ts-input>`);
            const cssText = getCssText(el);

            // base
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) color');

            // standard
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-base-default);',
            );
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-base-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-focused);');
            expect(cssText).to.include('box-shadow: 0 0 0 2px var(--ts-semantic-color-border-primary-focused);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-disabled);');

            // filled
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('outline: solid 3px var(--ts-semantic-color-border-primary-focused);');

            // control
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('caret-color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-neutral-default);');

            // icon slots
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-base-default);');

            // small
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('padding: 0 var(--ts-semantic-size-space-400);');

            // medium
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('padding: 0 var(--ts-semantic-size-space-400);');

            // large
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-xl);');
            expect(cssText).to.include('padding: 0 var(--ts-semantic-size-space-600);');

            // pill
            expect(cssText).to.include('border-radius: 32px;');
            expect(cssText).to.include('border-radius: 40px;');
            expect(cssText).to.include('border-radius: 48px;');

            // clear + password toggle
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-icon-base-hover);');
        });
    });

    runFormControlBaseTests('ts-input');
});
