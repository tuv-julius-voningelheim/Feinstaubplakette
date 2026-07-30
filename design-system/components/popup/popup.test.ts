import { expect, fixture, html } from '@open-wc/testing';

import { getCssText } from '@utils/internal/test.js';

import type { TsPopup } from '@components/popup/index.js';

import '@tuvsud/design-system/popup';

describe('popup component <ts-popup>', () => {
    let element: TsPopup;

    it('should render a component', async () => {
        const el = await fixture(html` <ts-popup></ts-popup> `);

        expect(el).to.exist;
    });

    it('should properly handle positioning when active changes', async () => {
        element = await fixture('<ts-popup></ts-popup>');

        element.active = true;
        await element.updateComplete;

        // Simulate a scroll event
        const event = new Event('scroll');
        window.dispatchEvent(event);

        element.active = false;
        await element.updateComplete;

        // The component should not throw an error when the window is scrolled
        expect(() => {
            element.active = true;
            window.dispatchEvent(event);
        }).not.to.throw();
    });

    describe('<ts-popup> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsPopup>(html`<ts-popup></ts-popup>`);
            const cssText = getCssText(el);

            expect(cssText).to.include('--popup-bg-color: var(--ts-semantic-color-background-neutral-subtle-active);');
            expect(cssText).to.include('--arrow-size: 6px;');
            expect(cssText).to.include('--arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);');
            expect(cssText).to.include('--arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));');

            expect(cssText).to.include('--arrow-color: var(--ts-semantic-color-background-neutral-subtle-active);');

            expect(cssText).to.include('max-width: var(--auto-size-available-width, none);');
            expect(cssText).to.include('max-height: var(--auto-size-available-height, none);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            expect(cssText).to.include('background: var(--arrow-color);');

            expect(cssText).to.include('z-index: calc(var(--ts-semantic-distance-zindex-dropdown) - 1);');
            expect(cssText).to.include('clip-path: polygon(');
            expect(cssText).to.include('var(--hover-bridge-top-left-x, 0)');
            expect(cssText).to.include('var(--hover-bridge-bottom-right-y, 0)');
        });
    });
});
