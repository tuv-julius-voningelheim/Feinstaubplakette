import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';

import type { TsRadio } from '@components/radio/index.js';
import type { TsRadioButton } from '@components/radio-button/index.js';
import type { TsRadioGroup } from '@components/radio-group/index.js';

import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/radio-group';
import '@tuvsud/design-system/radio-button';

describe('radio group component <ts-radio-group>', () => {
    describe('validation tests', () => {
        it('should be invalid initially when required and no radio is checked', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group required>
                    <ts-radio value="1"></ts-radio>
                    <ts-radio value="2"></ts-radio>
                </ts-radio-group>
            `);

            expect(radioGroup.checkValidity()).to.be.false;
        });

        it('should become valid when an option is checked', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group required>
                    <ts-radio value="1"></ts-radio>
                    <ts-radio value="2"></ts-radio>
                </ts-radio-group>
            `);

            radioGroup.value = '1';
            await radioGroup.updateComplete;

            expect(radioGroup.checkValidity()).to.be.true;
        });

        it(`should be valid when required and one radio is checked`, async () => {
            const el = await fixture<TsRadioGroup>(html`
                <ts-radio-group label="Select an option" value="1" required>
                    <ts-radio name="option" value="1">Option 1</ts-radio>
                    <ts-radio name="option" value="2">Option 2</ts-radio>
                    <ts-radio name="option" value="3">Option 3</ts-radio>
                </ts-radio-group>
            `);

            expect(el.checkValidity()).to.be.true;
        });

        it(`should be invalid when required and no radios are checked`, async () => {
            const el = await fixture<TsRadioGroup>(html`
                <ts-radio-group label="Select an option" required>
                    <ts-radio name="option" value="1">Option 1</ts-radio>
                    <ts-radio name="option" value="2">Option 2</ts-radio>
                    <ts-radio name="option" value="3">Option 3</ts-radio>
                </ts-radio-group>
            `);

            expect(el.checkValidity()).to.be.false;
        });

        it(`should be valid when required and a different radio is checked`, async () => {
            const el = await fixture<TsRadioGroup>(html`
                <ts-radio-group label="Select an option" value="3" required>
                    <ts-radio name="option" value="1">Option 1</ts-radio>
                    <ts-radio name="option" value="2">Option 2</ts-radio>
                    <ts-radio name="option" value="3">Option 3</ts-radio>
                </ts-radio-group>
            `);

            expect(el.checkValidity()).to.be.true;
        });

        it(`should be invalid when custom validity is set`, async () => {
            const el = await fixture<TsRadioGroup>(html`
                <ts-radio-group label="Select an option">
                    <ts-radio name="option" value="1">Option 1</ts-radio>
                    <ts-radio name="option" value="2">Option 2</ts-radio>
                    <ts-radio name="option" value="3">Option 3</ts-radio>
                </ts-radio-group>
            `);

            el.setCustomValidity('Error');

            expect(el.checkValidity()).to.be.false;
        });

        it('should receive the correct validation attributes ("states") when valid', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group value="1" required>
                    <ts-radio value="1"></ts-radio>
                    <ts-radio value="2"></ts-radio>
                </ts-radio-group>
            `);
            const secondRadio = radioGroup.querySelectorAll('ts-radio')[1];

            expect(radioGroup.checkValidity()).to.be.true;
            expect(radioGroup.hasAttribute('data-required')).to.be.true;
            expect(radioGroup.hasAttribute('data-optional')).to.be.false;
            expect(radioGroup.hasAttribute('data-invalid')).to.be.false;
            expect(radioGroup.hasAttribute('data-valid')).to.be.true;
            expect(radioGroup.hasAttribute('data-user-invalid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(secondRadio!);
            await (secondRadio as TsRadio).updateComplete;

            expect(radioGroup.checkValidity()).to.be.true;
            expect(radioGroup.hasAttribute('data-user-invalid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-valid')).to.be.true;
        });

        it('should receive the correct validation attributes ("states") when invalid', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group required>
                    <ts-radio value="1"></ts-radio>
                    <ts-radio value="2"></ts-radio>
                </ts-radio-group>
            `);
            const secondRadio = radioGroup.querySelectorAll('ts-radio')[1];

            expect(radioGroup.hasAttribute('data-required')).to.be.true;
            expect(radioGroup.hasAttribute('data-optional')).to.be.false;
            expect(radioGroup.hasAttribute('data-invalid')).to.be.true;
            expect(radioGroup.hasAttribute('data-valid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-invalid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-valid')).to.be.false;

            await clickOnElement(secondRadio!);
            radioGroup.value = '';
            await radioGroup.updateComplete;

            expect(radioGroup.hasAttribute('data-user-invalid')).to.be.true;
            expect(radioGroup.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
            const el = await fixture<HTMLFormElement>(html`
                <form novalidate>
                    <ts-radio-group required>
                        <ts-radio value="1"></ts-radio>
                        <ts-radio value="2"></ts-radio>
                    </ts-radio-group>
                </form>
            `);
            const radioGroup = el.querySelector<TsRadioGroup>('ts-radio-group')!;

            expect(radioGroup.hasAttribute('data-required')).to.be.true;
            expect(radioGroup.hasAttribute('data-optional')).to.be.false;
            expect(radioGroup.hasAttribute('data-invalid')).to.be.true;
            expect(radioGroup.hasAttribute('data-valid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-invalid')).to.be.false;
            expect(radioGroup.hasAttribute('data-user-valid')).to.be.false;
        });

        it('should show a constraint validation error when setCustomValidity() is called', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-radio-group value="1">
                        <ts-radio id="radio-1" name="a" value="1"></ts-radio>
                        <ts-radio id="radio-2" name="a" value="2"></ts-radio>
                    </ts-radio-group>
                    <ts-button type="submit">Submit</ts-button>
                </form>
            `);
            const button: HTMLElement = form.querySelector('ts-button')!;
            const radioGroup = form.querySelector<TsRadioGroup>('ts-radio-group')!;
            const submitHandler = sinon.spy((event: SubmitEvent) => event.preventDefault());

            // Submitting the form after setting custom validity should not trigger the handler
            radioGroup.setCustomValidity('Invalid selection');
            form.addEventListener('submit', submitHandler);
            button.click();

            await aTimeout(100);

            expect(submitHandler).to.not.have.been.called;
        });
    });

    describe('when a size is applied', () => {
        it('should apply the same size to all radios', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group size="large">
                    <ts-radio id="radio-1" value="1"></ts-radio>
                    <ts-radio id="radio-2" value="2"></ts-radio>
                </ts-radio-group>
            `);
            const [radio1, radio2] = radioGroup.querySelectorAll('ts-radio')!;

            expect((radio1 as TsRadio).size).to.equal('large');
            expect((radio2 as TsRadio).size).to.equal('large');
        });

        it('should apply the same size to all radio buttons', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group size="large">
                    <ts-radio-button id="radio-1" value="1"></ts-radio-button>
                    <ts-radio-button id="radio-2" value="2"></ts-radio-button>
                </ts-radio-group>
            `);
            const [radio1, radio2] = radioGroup.querySelectorAll('ts-radio-button')!;

            expect((radio1 as TsRadioButton).size).to.equal('large');
            expect((radio2 as TsRadioButton).size).to.equal('large');
        });

        it('should update the size of all radio buttons when size changes', async () => {
            const radioGroup = await fixture<TsRadioGroup>(html`
                <ts-radio-group size="small">
                    <ts-radio-button id="radio-1" value="1"></ts-radio-button>
                    <ts-radio-button id="radio-2" value="2"></ts-radio-button>
                </ts-radio-group>
            `);
            const [radio1, radio2] = radioGroup.querySelectorAll('ts-radio-button')!;

            expect((radio1 as TsRadioButton).size).to.equal('small');
            expect((radio2 as TsRadioButton).size).to.equal('small');

            radioGroup.size = 'large';
            await radioGroup.updateComplete;

            expect((radio1 as TsRadioButton).size).to.equal('large');
            expect((radio2 as TsRadioButton).size).to.equal('large');
        });
    });

    describe('<ts-radio-group> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsRadioGroup>(html`<ts-radio-group></ts-radio-group>`);
            const cssText = getCssText(el);

            // required marker
            expect(cssText).to.include('color: var(--ts-semantic-color-text-danger-default);');
        });
    });
});
