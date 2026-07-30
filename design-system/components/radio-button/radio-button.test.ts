import { expect, fixture, html } from '@open-wc/testing';

import type { TsRadioButton } from '@components/radio-button/index.js';
import type { TsRadioGroup } from '@components/radio-group/index.js';

import '@tuvsud/design-system/radio';
import '@tuvsud/design-system/radio-group';
import '@tuvsud/design-system/radio-button';

describe('radio button group <ts-radio-button>', () => {
    it('should not get checked when disabled', async () => {
        const radioGroup = await fixture<TsRadioGroup>(html`
            <ts-radio-group value="1">
                <ts-radio-button id="radio-1" value="1"></ts-radio-button>
                <ts-radio-button id="radio-2" value="2" disabled></ts-radio-button>
            </ts-radio-group>
        `);
        const radio1 = radioGroup.querySelector<TsRadioButton>('#radio-1')!;
        const radio2 = radioGroup.querySelector<TsRadioButton>('#radio-2')!;

        radio2.click();
        await Promise.all([radio1.updateComplete, radio2.updateComplete]);

        expect(radio1.checked).to.be.true;
        expect(radio2.checked).to.be.false;
    });

    it('should receive positional data attributes from <ts-button-group>', async () => {
        const radioGroup = await fixture<TsRadioGroup>(html`
            <ts-radio-group value="1">
                <ts-radio-button id="radio-1" value="1"></ts-radio-button>
                <ts-radio-button id="radio-2" value="2"></ts-radio-button>
                <ts-radio-button id="radio-3" value="3"></ts-radio-button>
            </ts-radio-group>
        `);
        const radio1 = radioGroup.querySelector<TsRadioButton>('#radio-1')!;
        const radio2 = radioGroup.querySelector<TsRadioButton>('#radio-2')!;
        const radio3 = radioGroup.querySelector<TsRadioButton>('#radio-3')!;

        await Promise.all([
            radioGroup.updateComplete,
            radio1.updateComplete,
            radio2.updateComplete,
            radio3.updateComplete,
        ]);

        expect(radio1).to.have.attribute('data-ts-button-group__button');
        expect(radio1).to.have.attribute('data-ts-button-group__button--first');
        expect(radio2).to.have.attribute('data-ts-button-group__button');
        expect(radio2).to.have.attribute('data-ts-button-group__button--inner');
        expect(radio3).to.have.attribute('data-ts-button-group__button');
        expect(radio3).to.have.attribute('data-ts-button-group__button--last');
    });
});
