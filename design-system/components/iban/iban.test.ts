import { expect, fixture, html } from '@open-wc/testing';

import type { TsIban } from '@components/iban/index.js';

import '@tuvsud/design-system/iban';

describe('<ts-iban>', () => {
    let el: TsIban;

    beforeEach(async () => {
        el = await fixture<TsIban>(html`<ts-iban help-text="Enter IBAN"></ts-iban>`);
    });

    it('renders with initial state', () => {
        expect(el.value).to.equal('');
        expect(el.helpText).to.equal('Enter IBAN');
    });

    it('formats value and verifies validity on change (valid IBAN)', async () => {
        el.value = 'DE89370400440532013000'; // valid German IBAN
        el.dispatchEvent(new CustomEvent('ts-change'));

        expect(el.value).to.include(' '); // formatted with spaces
        expect(el.validity.valid).to.be.true;
        expect(el.helpText).to.equal('Enter IBAN'); // restored after blur
    });

    it('sets error state on invalid IBAN', async () => {
        el.value = 'INVALID123';
        el.checkValidity();

        expect(el.validity.valid).to.be.false;
        expect(el.validationMessage).to.equal('Invalid IBAN');
    });
});
