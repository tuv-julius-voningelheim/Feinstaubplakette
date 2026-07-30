import { expect, fixture, html } from '@open-wc/testing';

import type { TsButtonGroup } from '@components/button-group/index.js';

import '@tuvsud/design-system/button';
import '@tuvsud/design-system/button-group';

describe('button group component <ts-button-group>', () => {
    describe('defaults ', () => {
        it('passes accessibility test', async () => {
            const group = await fixture<TsButtonGroup>(html`
                <ts-button-group>
                    <ts-button>Button 1 Label</ts-button>
                    <ts-button>Button 2 Label</ts-button>
                    <ts-button>Button 3 Label</ts-button>
                </ts-button-group>
            `);
            await expect(group).to.be.accessible();
        });

        it('default label empty', async () => {
            const group = await fixture<TsButtonGroup>(html`
                <ts-button-group>
                    <ts-button>Button 1 Label</ts-button>
                    <ts-button>Button 2 Label</ts-button>
                    <ts-button>Button 3 Label</ts-button>
                </ts-button-group>
            `);
            expect(group.label).to.equal('');
        });
    });

    describe('slotted button data attributes', () => {
        it('slotted buttons have the right data attributes applied based on their order', async () => {
            const group = await fixture<TsButtonGroup>(html`
                <ts-button-group>
                    <ts-button>Button 1 Label</ts-button>
                    <ts-button>Button 2 Label</ts-button>
                    <ts-button>Button 3 Label</ts-button>
                </ts-button-group>
            `);

            const allButtons = group.querySelectorAll('ts-button');
            const hasGroupAttrib = Array.from(allButtons).every(button =>
                button.hasAttribute('data-ts-button-group__button'),
            );
            expect(hasGroupAttrib).to.be.true;

            expect(allButtons[0]).to.have.attribute('data-ts-button-group__button--first');
            expect(allButtons[1]).to.have.attribute('data-ts-button-group__button--inner');
            expect(allButtons[2]).to.have.attribute('data-ts-button-group__button--last');
        });
    });
});
