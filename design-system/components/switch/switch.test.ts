import { aTimeout, expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsSwitch } from '@components/switch/index.js';

import '@tuvsud/design-system/switch';

describe('switch component <ts-switch>', () => {
    runFormControlBaseTests('ts-switch');

    it('should pass accessibility tests', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch>Switch</ts-switch> `);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);

        expect(el.name).to.equal('');
        expect(el.value).to.be.undefined;
        expect(el.title).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.required).to.be.false;
        expect(el.checked).to.be.false;
        expect(el.defaultChecked).to.be.false;
        expect(el.helpText).to.equal('');
    });

    it('should have title if title attribute is set', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch title="Test"></ts-switch> `);
        const input = el.shadowRoot!.querySelector('input')!;

        expect(input.title).to.equal('Test');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch disabled></ts-switch> `);
        const input = el.shadowRoot!.querySelector<HTMLInputElement>('input')!;

        expect(input.disabled).to.be.true;
    });

    it('should be valid by default', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);

        expect(el.checkValidity()).to.be.true;
    });

    it('should emit ts-change and ts-input when clicked', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);
        const changeHandler = sinon.spy();
        const inputHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);
        el.addEventListener('ts-input', inputHandler);
        el.click();
        await el.updateComplete;

        expect(changeHandler).to.have.been.calledOnce;
        expect(inputHandler).to.have.been.calledOnce;
        expect(el.checked).to.be.true;
    });

    it('should emit ts-change when toggled with spacebar', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);
        const changeHandler = sinon.spy();
        const inputHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);
        el.addEventListener('ts-input', inputHandler);
        el.focus();
        await sendKeys({ press: ' ' });

        expect(changeHandler).to.have.been.calledOnce;
        expect(inputHandler).to.have.been.calledOnce;
        expect(el.checked).to.be.true;
    });

    it('should emit ts-change and ts-input when toggled with the right arrow', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);
        const changeHandler = sinon.spy();
        const inputHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);
        el.addEventListener('ts-input', inputHandler);
        el.focus();
        await sendKeys({ press: 'ArrowRight' });
        await el.updateComplete;

        expect(changeHandler).to.have.been.calledOnce;
        expect(inputHandler).to.have.been.calledOnce;
        expect(el.checked).to.be.true;
    });

    it('should emit ts-change and ts-input when toggled with the left arrow', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch checked></ts-switch> `);
        const changeHandler = sinon.spy();
        const inputHandler = sinon.spy();

        el.addEventListener('ts-change', changeHandler);
        el.addEventListener('ts-input', inputHandler);
        el.focus();
        await sendKeys({ press: 'ArrowLeft' });
        await el.updateComplete;

        expect(changeHandler).to.have.been.calledOnce;
        expect(inputHandler).to.have.been.calledOnce;
        expect(el.checked).to.be.false;
    });

    it('should not emit ts-change or ts-input when checked is set by JavaScript', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);
        el.addEventListener('ts-change', () => expect.fail('ts-change incorrectly emitted'));
        el.addEventListener('ts-input', () => expect.fail('ts-change incorrectly emitted'));
        el.checked = true;
        await el.updateComplete;
        el.checked = false;
        await el.updateComplete;
    });

    it('should hide the native input with the correct positioning to scroll correctly when contained in an overflow', async () => {
        const el = await fixture<TsSwitch>(html` <ts-switch></ts-switch> `);
        const label = el.shadowRoot!.querySelector('.switch')!;
        const input = el.shadowRoot!.querySelector('.switch__input')!;

        const labelPosition = getComputedStyle(label).position;
        const inputPosition = getComputedStyle(input).position;

        expect(labelPosition).to.equal('relative');
        expect(inputPosition).to.equal('absolute');
    });

    describe('when submitting a form', () => {
        it('should submit the correct value when a value is provided', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-switch name="a" value="1" checked></ts-switch>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const submitHandler = sinon.spy((event: SubmitEvent) => {
                formData = new FormData(form);
                event.preventDefault();
            });
            let formData: FormData;

            form.addEventListener('submit', submitHandler);
            form.requestSubmit();

            await waitUntil(() => submitHandler.calledOnce);

            expect(formData!.get('a')).to.equal('1');
        });

        it('should submit "on" when no value is provided', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-switch name="a" checked></ts-switch>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const submitHandler = sinon.spy((event: SubmitEvent) => {
                formData = new FormData(form);
                event.preventDefault();
            });
            let formData: FormData;

            form.addEventListener('submit', submitHandler);
            form.requestSubmit();

            await waitUntil(() => submitHandler.calledOnce);

            expect(formData!.get('a')).to.equal('on');
        });

        it('should show a constraint validation error when setCustomValidity() is called', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-switch name="a" value="1" checked></ts-switch>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const tsSwitch: TsSwitch = form.querySelector('ts-switch')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => event.preventDefault());

            // Submitting the form after setting custom validity should not trigger the handler
            tsSwitch.setCustomValidity('Invalid selection');
            form.addEventListener('submit', submitHandler);
            button.click();
            await aTimeout(100);

            expect(submitHandler).to.not.have.been.called;
        });

        it('should be invalid when required and unchecked', async () => {
            const tsSwitch = await fixture<HTMLFormElement>(html` <ts-switch required></ts-switch> `);
            expect(tsSwitch.checkValidity()).to.be.false;
        });

        it('should be valid when required and checked', async () => {
            const tsSwitch = await fixture<HTMLFormElement>(html` <ts-switch required checked></ts-switch> `);
            expect(tsSwitch.checkValidity()).to.be.true;
        });

        it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <div>
                    <form id="f">
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-switch form="f" name="a" value="1" checked></ts-switch>
                </div>
            `);
            const form = el.querySelector('form')!;
            const formData = new FormData(form);

            expect(formData.get('a')).to.equal('1');
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const el = await fixture<HTMLFormElement>(html` <form novalidate><ts-switch required></ts-switch></form> `);
            const tsSwitch = el.querySelector<TsSwitch>('ts-switch')!;

            expect(tsSwitch.hasAttribute('data-required')).to.be.true;
            expect(tsSwitch.hasAttribute('data-optional')).to.be.false;
            expect(tsSwitch.hasAttribute('data-invalid')).to.be.true;
            expect(tsSwitch.hasAttribute('data-valid')).to.be.false;
            expect(tsSwitch.hasAttribute('data-user-invalid')).to.be.false;
            expect(tsSwitch.hasAttribute('data-user-valid')).to.be.false;
        });
    });

    it('should not jump the page to the bottom when focusing a switch at the bottom of an element with overflow: auto;', async () => {
        const el = await fixture<HTMLDivElement>(html`
            <div style="display: flex; flex-direction: column; overflow: auto; max-height: 400px;">
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
                <ts-switch>Switch</ts-switch>
            </div>
            ;
        `);

        const switches = el.querySelectorAll<TsSwitch>('ts-switch');
        const lastSwitch = switches[switches.length - 1];

        expect(window.scrollY).to.equal(0);
        // Without these 2 timeouts, tests will pass unexpectedly in Safari.
        await aTimeout(10);
        lastSwitch!.focus();
        await aTimeout(10);
        expect(window.scrollY).to.equal(0);
    });

    describe('<ts-switch> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsSwitch>(html`<ts-switch></ts-switch>`);
            const cssText = getCssText(el);

            // size props
            expect(cssText).to.include('--height: 24px;');
            expect(cssText).to.include('--thumb-size: calc(var(--height) - 5px);');
            expect(cssText).to.include('--width: calc(var(--height) * 2);');

            // control styles
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-neutral-default);',
            );
            expect(cssText).to.include('border-radius: 9999px;');

            // thumb styles
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-neutral-default);',
            );
            expect(cssText).to.include('transition:');

            // checked state
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-primary-default);');

            // focus
            expect(cssText).to.include('outline: solid 2px var(--ts-semantic-color-border-primary-focused);');

            // disabled
            expect(cssText).to.include('opacity: 0.5;');
            expect(cssText).to.include('cursor: not-allowed;');

            // required
            expect(cssText).to.include('color: var(--ts-semantic-color-text-danger-default);');
        });
    });
});
