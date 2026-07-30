import { aTimeout, expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { clickOnElement } from '@utils/internal/test.js';
import { runFormControlBaseTests } from '@utils/internal/test/form-control-base.tests.js';

import type { TsCombobox } from '@components/combobox/index.js';
import type { TsOption } from '@components/option/index.js';

import '@tuvsud/design-system/combobox';
import '@tuvsud/design-system/option';
import '@tuvsud/design-system/popup';

describe('combobox component <ts-combobox>', () => {
    runFormControlBaseTests('ts-combobox');

    describe('accessibility', () => {
        it('should pass accessibility tests when closed', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox label="Select a fruit">
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                    <ts-option value="cherry">Cherry</ts-option>
                </ts-combobox>
            `);
            await expect(el).to.be.accessible();
        });
    });

    it('should be disabled with the disabled attribute', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox disabled>
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
            </ts-combobox>
        `);
        expect(el.displayInput.disabled).to.be.true;
    });

    it('should show a placeholder when no option is selected', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox placeholder="Choose a fruit">
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
            </ts-combobox>
        `);
        const displayInput = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="display-input"]')!;
        expect(displayInput.placeholder).to.equal('Choose a fruit');
    });

    it('should pre-select an option when value is set', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox value="banana">
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
                <ts-option value="cherry">Cherry</ts-option>
            </ts-combobox>
        `);
        await el.updateComplete;
        expect(el.value).to.equal('banana');
        expect(el.displayInput.value).to.equal('Banana');
    });

    it('should open the dropdown when show() is called', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox>
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
            </ts-combobox>
        `);
        await el.show();
        expect(el.open).to.be.true;
    });

    it('should close the dropdown when hide() is called', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox open>
                <ts-option value="apple">Apple</ts-option>
                <ts-option value="banana">Banana</ts-option>
            </ts-combobox>
        `);
        await el.hide();
        expect(el.open).to.be.false;
    });

    it('should emit ts-show and ts-after-show when opening', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox>
                <ts-option value="apple">Apple</ts-option>
            </ts-combobox>
        `);
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);

        await el.show();

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
    });

    it('should emit ts-hide and ts-after-hide when closing', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox open>
                <ts-option value="apple">Apple</ts-option>
            </ts-combobox>
        `);
        await oneEvent(el, 'ts-after-show');
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);

        await el.hide();

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
    });

    it('should emit ts-focus and ts-blur', async () => {
        const el = await fixture<TsCombobox>(html`
            <ts-combobox>
                <ts-option value="apple">Apple</ts-option>
            </ts-combobox>
        `);
        const focusHandler = sinon.spy();
        const blurHandler = sinon.spy();

        el.addEventListener('ts-focus', focusHandler);
        el.addEventListener('ts-blur', blurHandler);

        el.focus();
        await waitUntil(() => focusHandler.calledOnce);
        el.blur();
        await waitUntil(() => blurHandler.calledOnce);

        expect(focusHandler).to.have.been.calledOnce;
        expect(blurHandler).to.have.been.calledOnce;
    });

    describe('filtering', () => {
        it('should filter options when the user types', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                    <ts-option value="cherry">Cherry</ts-option>
                </ts-combobox>
            `);

            el.focus();
            await el.show();
            await sendKeys({ type: 'app' });
            await el.updateComplete;

            const options = el.querySelectorAll<TsOption>('ts-option');
            expect(options[0]!.hidden).to.be.false; // apple matches
            expect(options[1]!.hidden).to.be.true; // banana hidden
            expect(options[2]!.hidden).to.be.true; // cherry hidden
        });

        it('should emit ts-filter with the current query when the user types', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                </ts-combobox>
            `);
            const filterHandler = sinon.spy();
            el.addEventListener('ts-combobox-filter', filterHandler);

            el.focus();
            await el.show();
            await sendKeys({ type: 'an' });
            await el.updateComplete;

            expect(filterHandler.callCount).to.be.greaterThan(0);
            const lastCall = filterHandler.lastCall.args[0] as CustomEvent;
            expect(lastCall.detail.value).to.include('an');
        });

        it('should show no-options message when no options match', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox no-options-text="Nothing found">
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                </ts-combobox>
            `);

            el.focus();
            await el.show();
            await sendKeys({ type: 'xyz' });
            await el.updateComplete;

            expect(el.hasVisibleOptions).to.be.false;
        });

        it('should restore all options when the filter is cleared', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                    <ts-option value="cherry">Cherry</ts-option>
                </ts-combobox>
            `);

            el.focus();
            await el.show();
            await sendKeys({ type: 'app' });
            await el.updateComplete;

            // Now clear the filter
            const input = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="display-input"]')!;
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            await el.updateComplete;

            const options = el.querySelectorAll<TsOption>('ts-option');
            options.forEach(opt => expect(opt.hidden).to.be.false);
        });
    });

    describe('selection', () => {
        it('should update value and display label when an option is clicked', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                    <ts-option value="cherry">Cherry</ts-option>
                </ts-combobox>
            `);

            await el.show();
            const bananaOption = el.querySelector<TsOption>('[value="banana"]')!;
            await clickOnElement(bananaOption);
            await el.updateComplete;

            expect(el.value).to.equal('banana');
            expect(el.displayInput.value).to.equal('Banana');
        });

        it('should emit ts-change and ts-select when an option is selected', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                </ts-combobox>
            `);
            const changeHandler = sinon.spy();
            const selectHandler = sinon.spy();

            el.addEventListener('ts-change', changeHandler);
            el.addEventListener('ts-combobox-select', selectHandler);

            await el.show();
            const bananaOption = el.querySelector<TsOption>('[value="banana"]')!;
            await clickOnElement(bananaOption);
            await el.updateComplete;
            await aTimeout(0);

            expect(changeHandler).to.have.been.calledOnce;
            expect(selectHandler).to.have.been.calledOnce;

            const selectEvent = selectHandler.lastCall.args[0] as CustomEvent;
            expect(selectEvent.detail.value).to.equal('banana');
            expect(selectEvent.detail.label).to.equal('Banana');
        });

        it('should not allow selection when the option is disabled', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox value="apple">
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana" disabled>Banana</ts-option>
                </ts-combobox>
            `);

            await el.show();
            const disabledOption = el.querySelector<TsOption>('[disabled]')!;
            await clickOnElement(disabledOption);
            await el.updateComplete;

            expect(el.value).to.equal('apple');
        });

        it('should close the dropdown after selecting an option', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                </ts-combobox>
            `);

            await el.show();
            expect(el.open).to.be.true;

            const appleOption = el.querySelector<TsOption>('[value="apple"]')!;
            await clickOnElement(appleOption);
            await el.updateComplete;
            await aTimeout(200); // animation

            expect(el.open).to.be.false;
        });
    });

    describe('clearing', () => {
        it('should clear the value when the clear button is clicked', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox value="apple" clearable>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                </ts-combobox>
            `);
            await el.updateComplete;

            const clearButton = el.shadowRoot!.querySelector<HTMLButtonElement>('[part~="clear-button"]')!;
            clearButton.click();
            await el.updateComplete;
            await aTimeout(0);

            expect(el.value).to.equal('');
            expect(el.displayInput.value).to.equal('');
        });

        it('should emit ts-clear when the clear button is clicked', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox value="apple" clearable>
                    <ts-option value="apple">Apple</ts-option>
                </ts-combobox>
            `);
            await el.updateComplete;

            const clearHandler = sinon.spy();
            el.addEventListener('ts-clear', clearHandler);

            const clearButton = el.shadowRoot!.querySelector<HTMLButtonElement>('[part~="clear-button"]')!;
            clearButton.click();
            await el.updateComplete;
            await aTimeout(0);

            expect(clearHandler).to.have.been.calledOnce;
        });
    });

    describe('keyboard navigation', () => {
        it('should navigate options with ArrowDown and select with Enter', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                    <ts-option value="banana">Banana</ts-option>
                    <ts-option value="cherry">Cherry</ts-option>
                </ts-combobox>
            `);

            el.focus();
            await el.show();
            await el.updateComplete;

            await sendKeys({ press: 'ArrowDown' });
            await el.updateComplete;
            await sendKeys({ press: 'ArrowDown' });
            await el.updateComplete;

            el.focus();
            await sendKeys({ press: 'Enter' });
            await el.updateComplete;
            await aTimeout(0);

            expect(el.value).to.be.oneOf(['apple', 'banana', 'cherry']);
        });

        it('should close the dropdown with Escape', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox>
                    <ts-option value="apple">Apple</ts-option>
                </ts-combobox>
            `);

            await el.show();
            expect(el.open).to.be.true;

            el.focus();
            await sendKeys({ press: 'Escape' });
            await el.updateComplete;
            await aTimeout(200);

            expect(el.open).to.be.false;
        });
    });

    describe('form integration', () => {
        it('should submit the selected value with form data', async () => {
            const form = await fixture<HTMLFormElement>(html`
                <form>
                    <ts-combobox name="fruit" value="banana">
                        <ts-option value="apple">Apple</ts-option>
                        <ts-option value="banana">Banana</ts-option>
                    </ts-combobox>
                </form>
            `);
            await form.querySelector<TsCombobox>('ts-combobox')!.updateComplete;

            const formData = new FormData(form);
            expect(formData.get('fruit')).to.equal('banana');
        });

        it('should be invalid when required and no value is set', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox required>
                    <ts-option value="apple">Apple</ts-option>
                </ts-combobox>
            `);
            await el.updateComplete;
            expect(el.checkValidity()).to.be.false;
        });

        it('should be valid when required and a value is set', async () => {
            const el = await fixture<TsCombobox>(html`
                <ts-combobox required value="apple">
                    <ts-option value="apple">Apple</ts-option>
                </ts-combobox>
            `);
            await el.updateComplete;
            expect(el.checkValidity()).to.be.true;
        });
    });
});
