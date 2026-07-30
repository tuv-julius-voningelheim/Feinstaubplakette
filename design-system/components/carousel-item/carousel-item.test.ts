import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsCarouselItem } from '@components/carousel-item/index.js';

import '@tuvsud/design-system/carousel-item';

describe('<ts-carousel-item>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <ts-carousel-item></ts-carousel-item> `);

        expect(el).to.exist;
    });

    it('should pass accessibility tests', async () => {
        // Arrange
        const el = await fixture(html` <ts-carousel-item></ts-carousel-item> `);

        // Assert
        await expect(el).to.be.accessible();
    });

    describe('<ts-carousel-item> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsCarouselItem>(html`<ts-carousel-item></ts-carousel-item>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('--aspect-ratio: inherit;');
            expect(cssText).to.include('aspect-ratio: var(--aspect-ratio);');
        });
    });
});
