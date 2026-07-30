import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsMenuItem } from '@components/menu-item/index.js';

import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/popup';

type TSSelectEvent = CustomEvent<{ item: TsMenuItem }>;

describe('menu item component<ts-menu-item>', () => {
    it('should pass accessibility tests', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item>Item 1</ts-menu-item>
                <ts-menu-item>Item 2</ts-menu-item>
                <ts-menu-item>Item 3</ts-menu-item>
                <ts-divider></ts-divider>
                <ts-menu-item type="checkbox" checked>Checked</ts-menu-item>
                <ts-menu-item type="checkbox">Unchecked</ts-menu-item>
            </ts-menu>
        `);
        await expect(el).to.be.accessible();
    });

    it('should pass accessibility tests when using a submenu', async () => {
        const el = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item>
                    Submenu
                    <ts-menu slot="submenu">
                        <ts-menu-item>Submenu Item 1</ts-menu-item>
                        <ts-menu-item>Submenu Item 2</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);
        await expect(el).to.be.accessible();
    });

    it('should have the correct default properties', async () => {
        const el = await fixture<TsMenuItem>(html`<ts-menu-item>Test</ts-menu-item>`);
        expect(el.value).to.equal('');
        expect(el.disabled).to.be.false;
        expect(el.loading).to.equal(false);
        expect(el.getAttribute('aria-disabled')).to.equal('false');
    });

    it('should render the correct aria attributes when disabled', async () => {
        const el = await fixture<TsMenuItem>(html`<ts-menu-item disabled>Test</ts-menu-item>`);
        expect(el.getAttribute('aria-disabled')).to.equal('true');
    });

    describe('when loading', () => {
        it('should have a spinner present', async () => {
            const el = await fixture<TsMenuItem>(html`<ts-menu-item loading>Menu Item Label</ts-menu-item>`);
            expect(el.shadowRoot!.querySelector('ts-spinner')).to.exist;
        });
    });

    it('should return a text label when calling getTextLabel()', async () => {
        const el = await fixture<TsMenuItem>(html`<ts-menu-item>Test</ts-menu-item>`);
        expect(el.getTextLabel()).to.equal('Test');
    });

    it('should emit the slotchange event when the label changes', async () => {
        const el = await fixture<TsMenuItem>(html`<ts-menu-item>Text</ts-menu-item>`);
        const slotChangeHandler = sinon.spy();
        el.addEventListener('slotchange', slotChangeHandler);
        el.textContent = 'New Text';
        await waitUntil(() => slotChangeHandler.calledOnce);
        expect(slotChangeHandler).to.have.been.calledOnce;
    });

    it('should render a hidden menu item when the inert attribute is used', async () => {
        const root = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item inert>Item 1</ts-menu-item>
                <ts-menu-item>Item 2</ts-menu-item>
                <ts-menu-item>Item 3</ts-menu-item>
            </ts-menu>
        `);
        const item1 = root.querySelector('ts-menu-item')!;
        expect(getComputedStyle(item1).display).to.equal('none');
    });

    it('should not render a ts-popup if slot="submenu" is missing, but the slot exists hidden', async () => {
        const root = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item>
                    Item 1
                    <ts-menu>
                        <ts-menu-item>Nested Item 1</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);
        const menuItem = root.querySelector('ts-menu-item')!;
        expect(menuItem.shadowRoot!.querySelector('ts-popup')).to.be.null;
        const submenuSlot = menuItem.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="submenu"]')!;
        expect(submenuSlot.hidden).to.be.true;
    });

    it('should render a ts-popup if slot="submenu" is present', async () => {
        const root = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item id="test">
                    Item 1
                    <ts-menu slot="submenu">
                        <ts-menu-item>Nested Item 1</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);
        const menuItem = root.querySelector('ts-menu-item')! as TsMenuItem;
        // The submenuController sets isConnected=true in hostUpdated(), which is triggered by the
        // slotchange event after initial render. Wait for that second update cycle to complete.
        await menuItem.updateComplete;
        expect(menuItem.shadowRoot!.querySelector('ts-popup')).to.not.be.null;
        const submenuSlot = menuItem.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="submenu"]')!;
        expect(submenuSlot.hidden).to.be.false;
    });

    it('should focus first submenu item with ArrowRight on parent, then select on Enter', async () => {
        const root = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item id="item-1">
                    Submenu
                    <ts-menu slot="submenu">
                        <ts-menu-item value="submenu-item-1">Nested Item 1</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);
        const selectHandler = sinon.spy((event: TSSelectEvent) => {
            expect(event.detail.item.value).to.equal('submenu-item-1');
        });
        root.addEventListener('ts-select', selectHandler as unknown as EventListener);
        const parentItem: TsMenuItem = root.querySelector('#item-1')!;
        const submenuItem = root.querySelector<TsMenuItem>('[value="submenu-item-1"]')!;

        parentItem.focus();
        await parentItem.updateComplete;
        await sendKeys({ press: 'ArrowRight' });
        // handleSubmenuEntry sets focus via host.updateComplete.then(), wait until focus arrives
        await waitUntil(() => document.activeElement === submenuItem, 'Focus should move to submenu item');
        await sendKeys({ press: 'Enter' });
        await waitUntil(() => selectHandler.calledOnce, 'ts-select should be emitted once');
        expect(selectHandler).to.have.been.calledOnce;
    });

    it('should return focus to outer menu item with ArrowLeft from nested item', async () => {
        const root = await fixture<HTMLElement>(html`
            <ts-menu>
                <ts-menu-item value="outer-item-1">
                    Submenu
                    <ts-menu slot="submenu">
                        <ts-menu-item value="inner-item-1">Nested Item 1</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);

        const outerItem = root.querySelector<TsMenuItem>('[value="outer-item-1"]')!;
        const innerItem = root.querySelector<TsMenuItem>('[value="inner-item-1"]')!;

        outerItem.focus();
        await outerItem.updateComplete;

        await sendKeys({ press: 'ArrowRight' }); // open submenu and move focus to inner item
        // handleSubmenuEntry sets focus asynchronously via host.updateComplete.then()
        await waitUntil(() => document.activeElement === innerItem, 'Focus should move to inner item');

        await sendKeys({ press: 'ArrowLeft' }); // return focus to outer item
        await waitUntil(() => document.activeElement === outerItem, 'Focus should return to outer item');

        expect(outerItem.value).to.equal('outer-item-1');
    });

    describe('<ts-menu-item> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsMenuItem>(html`<ts-menu-item></ts-menu-item>`);
            const cssText = getCssText(el);

            // host
            expect(cssText).to.include('--submenu-offset: -2px;');

            // base menu-item
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-medium);');
            expect(cssText).to.include('line-height: var(--ts-line-height-300);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('transition: var(--ts-semantic-transition-duration-fast) fill;');

            // prefix / suffix spacing
            expect(cssText).to.include('margin-inline-end: var(--ts-semantic-size-space-300);');
            expect(cssText).to.include('margin-inline-start: var(--ts-semantic-size-space-300);');

            // safe triangle
            expect(cssText).to.include('z-index: calc(var(--ts-semantic-distance-zindex-dropdown) - 1);');
            expect(cssText).to.include('clip-path: polygon(');
            expect(cssText).to.include('var(--safe-triangle-cursor-x');
            expect(cssText).to.include('var(--safe-triangle-submenu-start-x');
            expect(cssText).to.include('var(--safe-triangle-submenu-end-x');

            // hover / focus / expanded
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-base-hover);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-hover);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-default);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-inverted-default);');

            // popup
            expect(cssText).to.include('box-shadow: var(--ts-semantic-shadow-light-lg);');
            expect(cssText).to.include('z-index: var(--ts-semantic-distance-zindex-dropdown);');
            expect(cssText).to.include('margin-left: var(--submenu-offset);');

            // rtl popup
            expect(cssText).to.include('margin-left: calc(-1 * var(--submenu-offset));');

            // slotted submenu auto-size
            expect(cssText).to.include('max-width: var(--auto-size-available-width) !important;');
            expect(cssText).to.include('max-height: var(--auto-size-available-height) !important;');
        });
    });
});
