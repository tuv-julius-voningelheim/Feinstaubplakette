import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { serialize } from '@utils/helper/form.js';
import { getCssText } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsTextarea } from '@components/textarea/index.js';

import '@tuvsud/design-system/textarea';

describe('<ts-textarea>', () => {
    runFormControlBaseTests('ts-textarea');

    it('should pass accessibility tests', async () => {
        const el = await fixture<TsTextarea>(html` <ts-textarea label="Name"></ts-textarea> `);
        await expect(el).to.be.accessible();
    });

    it('default properties', async () => {
        const el = await fixture<TsTextarea>(html` <ts-textarea></ts-textarea> `);

        expect(el.size).to.equal('medium');
        expect(el.name).to.equal('');
        expect(el.value).to.equal('');
        expect(el.defaultValue).to.equal('');
        expect(el.title).to.equal('');
        expect(el.filled).to.be.false;
        expect(el.label).to.equal('');
        expect(el.helpText).to.equal('');
        expect(el.placeholder).to.equal('');
        expect(el.rows).to.equal(4);
        expect(el.resize).to.equal('vertical');
        expect(el.disabled).to.be.false;
        expect(el.readonly).to.be.false;
        expect(el.minlength).to.be.undefined;
        expect(el.maxlength).to.be.undefined;
        expect(el.required).to.be.false;
        expect(el.autocapitalize).to.be.undefined;
        expect(el.autocorrect).to.be.undefined;
        expect(el.autocomplete).to.be.undefined;
        expect(el.autofocus).to.be.undefined;
        expect(el.enterkeyhint).to.be.undefined;
        expect(el.spellcheck).to.be.true;
        expect(el.inputmode).to.be.undefined;
    });

    it('should have title if title attribute is set', async () => {
        const el = await fixture<TsTextarea>(html` <ts-textarea title="Test"></ts-textarea> `);
        const textarea = el.shadowRoot!.querySelector('textarea')!;

        expect(textarea.title).to.equal('Test');
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsTextarea>(html` <ts-textarea disabled></ts-textarea> `);
        const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('[part~="textarea"]')!;

        expect(textarea.disabled).to.be.true;
    });

    it('should focus the textarea when clicking on the label', async () => {
        const el = await fixture<TsTextarea>(html` <ts-textarea label="Name"></ts-textarea> `);
        const label = el.shadowRoot!.querySelector('[part~="form-control-label"]')!;
        const submitHandler = sinon.spy();

        el.addEventListener('ts-focus', submitHandler);
        (label as HTMLLabelElement).click();
        await waitUntil(() => submitHandler.calledOnce);

        expect(submitHandler).to.have.been.calledOnce;
    });

    describe('when the value changes', () => {
        it('should emit ts-change and ts-input when the user types in the textarea', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea></ts-textarea> `);
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
            const el = await fixture<TsTextarea>(html` <ts-textarea></ts-textarea> `);

            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.value = 'abc';

            await el.updateComplete;
        });

        it('should not emit ts-change or ts-input when calling setRangeText()', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea value="hi there"></ts-textarea> `);

            el.addEventListener('ts-change', () => expect.fail('ts-change should not be emitted'));
            el.addEventListener('ts-input', () => expect.fail('ts-input should not be emitted'));
            el.focus();
            el.setSelectionRange(0, 2);
            el.setRangeText('hello');

            await el.updateComplete;
        });
    });

    describe('when using constraint validation', () => {
        it('should be valid by default', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea></ts-textarea> `);

            expect(el.checkValidity()).to.be.true;
        });

        it('should be invalid when required and empty', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea required></ts-textarea> `);

            expect(el.checkValidity()).to.be.false;
        });

        it('should be invalid when required and after removing disabled ', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea disabled required></ts-textarea> `);

            el.disabled = false;
            await el.updateComplete;

            expect(el.checkValidity()).to.be.false;
        });

        it('should be invalid when required and disabled is removed', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea disabled required></ts-textarea> `);
            el.disabled = false;
            await el.updateComplete;
            expect(el.checkValidity()).to.be.false;
        });

        it('should receive the correct validation attributes ("states") when valid', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea required value="a"></ts-textarea> `);

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.false;
            expect(el.hasAttribute('data-valid')).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            el.focus();
            await sendKeys({ press: 'b' });
            await el.updateComplete;
            el.blur();
            await el.updateComplete;

            expect(el.checkValidity()).to.be.true;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.true;
        });

        it('should receive the correct validation attributes ("states") when invalid', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea required></ts-textarea> `);

            expect(el.hasAttribute('data-required')).to.be.true;
            expect(el.hasAttribute('data-optional')).to.be.false;
            expect(el.hasAttribute('data-invalid')).to.be.true;
            expect(el.hasAttribute('data-valid')).to.be.false;
            expect(el.hasAttribute('data-user-invalid')).to.be.false;
            expect(el.hasAttribute('data-user-valid')).to.be.false;

            el.focus();
            await sendKeys({ press: 'a' });
            await sendKeys({ press: 'Backspace' });
            await el.updateComplete;
            el.blur();
            await el.updateComplete;

            expect(el.hasAttribute('data-user-invalid')).to.be.true;
            expect(el.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <form novalidate><ts-textarea required></ts-textarea></form>
            `);
            const textarea = el.querySelector<TsTextarea>('ts-textarea')!;

            expect(textarea.hasAttribute('data-required')).to.be.true;
            expect(textarea.hasAttribute('data-optional')).to.be.false;
            expect(textarea.hasAttribute('data-invalid')).to.be.true;
            expect(textarea.hasAttribute('data-valid')).to.be.false;
            expect(textarea.hasAttribute('data-user-invalid')).to.be.false;
            expect(textarea.hasAttribute('data-user-valid')).to.be.false;
        });
    });

    describe('when submitting a form', () => {
        it('should serialize its name and value with FormData', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form><ts-textarea name="a" value="1"></ts-textarea></form>
            `);
            const formData = new FormData(form);
            expect(formData.get('a')).to.equal('1');
        });

        it('should serialize its name and value with JSON', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form><ts-textarea name="a" value="1"></ts-textarea></form>
            `);
            const json = serialize(form);
            expect(json.a).to.equal('1');
        });

        it('should be invalid when setCustomValidity() is called with a non-empty value', async () => {
            const textarea = await fixture<HTMLFormElement>(html` <ts-textarea></ts-textarea> `);

            textarea.setCustomValidity('Invalid selection');
            await textarea.updateComplete;

            expect(textarea.checkValidity()).to.be.false;
            expect(textarea.hasAttribute('data-invalid')).to.be.true;
            expect(textarea.hasAttribute('data-valid')).to.be.false;
            expect(textarea.hasAttribute('data-user-invalid')).to.be.false;
            expect(textarea.hasAttribute('data-user-valid')).to.be.false;

            textarea.focus();
            await sendKeys({ type: 'test' });
            await textarea.updateComplete;
            textarea.blur();
            await textarea.updateComplete;

            expect(textarea.hasAttribute('data-user-invalid')).to.be.true;
            expect(textarea.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <div>
                    <form id="f">
                        <ts-button type="submit">Submit</ts-button>
                    </form>
                    <ts-textarea form="f" name="a" value="1"></ts-textarea>
                </div>
            `);
            const form = el.querySelector('form')!;
            const formData = new FormData(form);

            expect(formData.get('a')).to.equal('1');
        });
    });

    describe('when using spellcheck', () => {
        it('should enable spellcheck when no attribute is present', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea></ts-textarea> `);
            const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
            expect(textarea.getAttribute('spellcheck')).to.equal('true');
            expect(textarea.spellcheck).to.be.true;
        });

        it('should enable spellcheck when set to "true"', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea spellcheck="true"></ts-textarea> `);
            const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
            expect(textarea.getAttribute('spellcheck')).to.equal('true');
            expect(textarea.spellcheck).to.be.true;
        });

        it('should disable spellcheck when set to "false"', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea spellcheck="false"></ts-textarea> `);
            const textarea = el.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
            expect(textarea.getAttribute('spellcheck')).to.equal('false');
            expect(textarea.spellcheck).to.be.false;
        });
    });

    describe('when using the setRangeText() function', () => {
        it('should set replacement text in the correct location', async () => {
            const el = await fixture<TsTextarea>(html` <ts-textarea value="test"></ts-textarea> `);

            el.focus();
            el.setSelectionRange(1, 3);
            el.setRangeText('boom');
            await el.updateComplete;
            expect(el.value).to.equal('tboomt');
        });
    });

    describe('<ts-textarea> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTextarea>(html`<ts-textarea></ts-textarea>`);
            const cssText = getCssText(el);

            // Base styles
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');

            // Standard variant
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-base-default);',
            );

            // Disabled state
            expect(cssText).to.include(
                'background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);',
            );
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-disabled);');

            // Placeholder
            expect(cssText).to.include('color: var(--ts-semantic-color-text-neutral-default);');

            // Sizes
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-xl);');
        });
    });
});
