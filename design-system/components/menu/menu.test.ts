import { expect, fixture, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';
import type { TsSelectEvent } from '@utils/events/ts-select.js';

import type { TsMenu } from '@components/menu/index.js';
import type { TsMenuItem } from '@components/menu-item/index.js';

import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';

describe('menu component <ts-menu>', () => {
    it('can be selected via keyboard', async () => {
        const menu = await fixture<TsMenu>(html`
            <ts-menu>
                <ts-menu-item value="item-1">Item 1</ts-menu-item>
                <ts-menu-item value="item-2">Item 2</ts-menu-item>
                <ts-menu-item value="item-3">Item 3</ts-menu-item>
                <ts-menu-item value="item-4">Item 4</ts-menu-item>
            </ts-menu>
        `);
        const [item1, item2] = menu.querySelectorAll('ts-menu-item');
        const selectHandler = sinon.spy((event: TsSelectEvent) => {
            const item = event.detail.item;
            if (item !== item2) {
                expect.fail('Incorrect item selected');
            }
        });

        menu.addEventListener('ts-select', selectHandler);

        (item1 as TsMenuItem).focus();
        await (item1 as TsMenuItem).updateComplete;
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });

        expect(selectHandler).to.have.been.calledOnce;
    });

    it('does not select disabled items when clicking', async () => {
        const menu = await fixture<TsMenu>(html`
            <ts-menu>
                <ts-menu-item value="item-1">Item 1</ts-menu-item>
                <ts-menu-item value="item-2" disabled>Item 2</ts-menu-item>
                <ts-menu-item value="item-3">Item 3</ts-menu-item>
                <ts-menu-item value="item-4">Item 4</ts-menu-item>
            </ts-menu>
        `);
        const item2 = menu.querySelectorAll('ts-menu-item')[1];
        const selectHandler = sinon.spy();

        menu.addEventListener('ts-select', selectHandler);

        await clickOnElement(item2!);

        expect(selectHandler).to.not.have.been.calledOnce;
    });

    it('does not select disabled items when pressing enter', async () => {
        const menu = await fixture<TsMenu>(html`
            <ts-menu>
                <ts-menu-item value="item-1">Item 1</ts-menu-item>
                <ts-menu-item value="item-2" disabled>Item 2</ts-menu-item>
                <ts-menu-item value="item-3">Item 3</ts-menu-item>
                <ts-menu-item value="item-4">Item 4</ts-menu-item>
            </ts-menu>
        `);
        const [item1, item2] = menu.querySelectorAll('ts-menu-item');
        const selectHandler = sinon.spy();

        menu.addEventListener('ts-select', selectHandler);

        (item1! as TsMenuItem).focus();
        await (item1! as TsMenuItem).updateComplete;
        await sendKeys({ press: 'ArrowDown' });
        expect(document.activeElement).to.equal(item2);
        await sendKeys({ press: 'Enter' });
        await (item2! as TsMenuItem).updateComplete;

        expect(selectHandler).to.not.have.been.called;
    });

    it('Should fire "ts-select" when clicking an element within a menu-item', async () => {
        const selectHandler = sinon.spy(() => {});

        const menu: TsMenu = await fixture(html`
            <ts-menu>
                <ts-menu-item>
                    <span>Menu item</span>
                </ts-menu-item>
            </ts-menu>
        `);

        menu.addEventListener('ts-select', selectHandler);
        const span = menu.querySelector('span')!;
        await clickOnElement(span);

        expect(selectHandler).to.have.been.calledOnce;
    });

    it('Should be able to check a checkbox menu item in a submenu', async () => {
        const menu: TsMenu = await fixture(html`
            <ts-menu style="max-width: 200px;">
                <ts-menu-item>
                    <span>Menu item</span>
                    <ts-menu slot="submenu">
                        <ts-menu-item type="checkbox" checked>Checkbox</ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        `);

        const menuItem = menu.querySelector<TsMenuItem>('ts-menu-item')!;
        const checkbox = menu.querySelector<TsMenuItem>("[type='checkbox']")!;

        expect(checkbox.checked).to.equal(true);
        await clickOnElement(menuItem); // Focus the menu item
        menuItem.focus(); // Explicitly focus for WebKit (does not focus non-form elements on click)
        await menuItem.updateComplete;
        await sendKeys({ press: 'ArrowRight' }); // Open the submenu
        await menuItem.updateComplete; // Wait for the submenu popup to render
        // Wait until the popup has positioned the checkbox and it has non-zero dimensions,
        // otherwise sendMouse gets [0,0] in WebKit and hangs the browser.
        await waitUntil(() => checkbox.getBoundingClientRect().width > 0, 'Checkbox should be visible in submenu');
        await clickOnElement(checkbox); // Click the checkbox
        await checkbox.updateComplete;
        expect(checkbox.checked).to.equal(false);
    });

    describe('<ts-menu> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsMenu>(html`<ts-menu></ts-menu>`);
            const cssText = getCssText(el);

            // host
            expect(cssText).to.include('background: var(--ts-semantic-color-surface-base-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-neutral-subtle-default);',
            );
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-300) 0;');

            // slotted divider
            expect(cssText).to.include('--spacing: var(--ts-semantic-size-space-300);');
        });
    });
});
