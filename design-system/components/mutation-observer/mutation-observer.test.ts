import { expect, fixture, html } from '@open-wc/testing';

import '@tuvsud/design-system/mutation-observer';

describe('<ts-mutation-observer>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <ts-mutation-observer></ts-mutation-observer> `);

        expect(el).to.exist;
    });
});
