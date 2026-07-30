import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsSkeleton } from '@components/skeleton/index.js';

import '@tuvsud/design-system/skeleton';

describe('skeleton component <ts-skeleton>', () => {
    it('should render default skeleton', async () => {
        const el = await fixture<TsSkeleton>(html` <ts-skeleton></ts-skeleton> `);

        await expect(el).to.be.accessible();

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const indicator = el.shadowRoot!.querySelector<HTMLElement>('[part~="indicator"]')!;

        expect(base.getAttribute('class')).to.equal(' skeleton ');
        expect(indicator.getAttribute('class')).to.equal('skeleton__indicator');
    });

    it('should set pulse effect by attribute', async () => {
        const el = await fixture<TsSkeleton>(html` <ts-skeleton effect="pulse"></ts-skeleton> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('class')).to.equal(' skeleton skeleton--pulse ');
    });

    it('should set sheen effect by attribute', async () => {
        const el = await fixture<TsSkeleton>(html` <ts-skeleton effect="sheen"></ts-skeleton> `);

        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.getAttribute('class')).to.equal(' skeleton skeleton--sheen ');
    });

    describe('<ts-skeleton> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsSkeleton>(html`<ts-skeleton></ts-skeleton>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--border-radius: var(--ts-semantic-size-radius-pill);');
            expect(cssText).to.include('--color: var(--ts-core-color-neutral-200);');
            expect(cssText).to.include('--sheen-color: var(--ts-core-color-neutral-300);');

            // indicator
            expect(cssText).to.include('background: var(--color);');
            expect(cssText).to.include('border-radius: var(--border-radius);');

            // sheen animation
            /*expect(cssText).to.include(
                'background: linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));',
            );
            expect(cssText).to.include('animation: sheen 8s ease-in-out infinite;');

            // pulse animation
            expect(cssText).to.include('animation: pulse 2s ease-in-out 0.5s infinite;');

            */

            // forced colors
            expect(cssText).to.include('--color: var(--ts-semantic-color-text-base-default);');
        });
    });
});
