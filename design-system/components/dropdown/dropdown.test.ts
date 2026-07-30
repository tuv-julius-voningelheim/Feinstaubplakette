import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import sinon from 'sinon';

import { clickOnElement, getCssText } from '@utils/internal/test.js';

import type { TsDropdown } from '@components/dropdown/index.js';

import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/button';

describe('dropdown component <ts-dropdown>', () => {
    it('should be visible with the open attribute', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown open>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;

        expect(panel.hidden).to.be.false;
    });

    it('should not be visible without the open attribute', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;

        expect(panel.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when calling show()', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.show();

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(panel.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown open>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.hide();

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(panel.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when setting open = true', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.open = true;

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(panel.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown open>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const panel = el.shadowRoot!.querySelector<HTMLElement>('[part~="panel"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.open = false;

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(panel.hidden).to.be.true;
    });

    it('should still open on arrow navigation when no menu items', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu></ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.focus();
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;

        expect(el.open).to.be.true;
    });

    it('should open on arrow down navigation', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;
        const firstMenuItem = el.querySelectorAll('ts-menu-item')[0];

        trigger.focus();
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;

        expect(el.open).to.be.true;
        expect(document.activeElement).to.equal(firstMenuItem);
    });

    it('should open on arrow up navigation', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;
        const secondMenuItem = el.querySelectorAll('ts-menu-item')[1];

        trigger.focus();
        await sendKeys({ press: 'ArrowUp' });
        await el.updateComplete;

        expect(el.open).to.be.true;
        expect(document.activeElement).to.equal(secondMenuItem);
    });

    it('should navigate to first focusable item on arrow navigation', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-label>Top Label</ts-menu-label>
                    <ts-menu-item>Item 1</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;
        const item = el.querySelector('ts-menu-item')!;

        await clickOnElement(trigger);
        if ('updateComplete' in trigger) await (trigger as LitElement).updateComplete;
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;

        expect(document.activeElement).to.equal(item);
    });

    it('should close on escape key', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown open>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.focus();
        await sendKeys({ press: 'Escape' });
        await el.updateComplete;

        expect(el.open).to.be.false;
    });

    it('should not open on arrow navigation when no menu exists', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <div>Some custom content</div>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.focus();
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;

        expect(el.open).to.be.false;
    });

    it('should open on enter key', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.focus();
        await el.updateComplete;
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(el.open).to.be.true;
    });

    it('should focus on menu items when clicking the trigger and arrowing through options', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                    <ts-menu-item>Item 2</ts-menu-item>
                    <ts-menu-item>Item 3</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger = el.querySelector('ts-button')!;
        const secondMenuItem = el.querySelectorAll('ts-menu-item')[1];

        await clickOnElement(trigger);

        if ('updateComplete' in trigger) await (trigger as LitElement).updateComplete;
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;
        await sendKeys({ press: 'ArrowDown' });
        await el.updateComplete;

        expect(document.activeElement).to.equal(secondMenuItem);
    });

    it('should open on enter key when no menu exists', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <div>Some custom content</div>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.focus();
        await el.updateComplete;
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(el.open).to.be.true;
    });

    it('should hide when clicked outside container and initially open', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown open>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);

        await sendMouse({ type: 'click', position: [0, 0] });
        await el.updateComplete;

        expect(el.open).to.be.false;
    });

    it('should hide when clicked outside container', async () => {
        const el = await fixture<TsDropdown>(html`
            <ts-dropdown>
                <ts-button slot="trigger" caret>Toggle</ts-button>
                <ts-menu>
                    <ts-menu-item>Item 1</ts-menu-item>
                </ts-menu>
            </ts-dropdown>
        `);
        const trigger: HTMLElement = el.querySelector('ts-button')!;

        trigger.click();
        await el.updateComplete;
        await sendMouse({ type: 'click', position: [0, 0] });
        await el.updateComplete;

        expect(el.open).to.be.false;
    });

    describe('when a ts-menu is provided and the dropdown is opened', () => {
        before(() => {
            @customElement('custom-wrapper')
            class Wrapper extends LitElement {
                override render() {
                    return html`<nested-dropdown></nested-dropdown>`;
                }
            }
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            Wrapper;

            @customElement('nested-dropdown')
            class NestedDropdown extends LitElement {
                override render() {
                    return html`
                        <ts-dropdown>
                            <ts-button slot="trigger" caret>Toggle</ts-button>
                            <ts-menu>
                                <ts-menu-item>Item 1</ts-menu-item>
                            </ts-menu>
                        </ts-dropdown>
                    `;
                }
            }
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            NestedDropdown;
        });

        it('should remain open on tab key', async () => {
            const el = await fixture<TsDropdown>(html`<custom-wrapper></custom-wrapper>`);

            const dropdown: TsDropdown = el
                .shadowRoot!.querySelector('nested-dropdown')!
                .shadowRoot!.querySelector('ts-dropdown')!;

            const trigger: HTMLElement = dropdown.querySelector('ts-button')!;

            trigger.focus();
            await dropdown.updateComplete;
            await sendKeys({ press: 'Enter' });
            await dropdown.updateComplete;
            await sendKeys({ press: 'Tab' });
            await dropdown.updateComplete;

            expect(dropdown.open).to.be.true;
        });
    });

    describe('when arbitrary content is provided and the dropdown is opened', () => {
        before(() => {
            @customElement('custom-wrapper-arbitrary')
            class WrapperArbitrary extends LitElement {
                override render() {
                    return html`<nested-dropdown-arbitrary></nested-dropdown-arbitrary>`;
                }
            }
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            WrapperArbitrary;

            @customElement('nested-dropdown-arbitrary')
            class NestedDropdownArbitrary extends LitElement {
                override render() {
                    return html`
                        <ts-dropdown>
                            <ts-button slot="trigger" caret>Toggle</ts-button>
                            <ul>
                                <li><a href="/settings" tabindex="0">Settings</a></li>
                                <li><a href="/profile" tabindex="0">Profile</a></li>
                            </ul>
                        </ts-dropdown>
                    `;
                }
            }
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            NestedDropdownArbitrary;
        });

        it('should remain open on tab key', async () => {
            const el = await fixture<TsDropdown>(html`<custom-wrapper-arbitrary></custom-wrapper-arbitrary>`);

            const dropdown: TsDropdown = el
                .shadowRoot!.querySelector('nested-dropdown-arbitrary')!
                .shadowRoot!.querySelector('ts-dropdown')!;

            const trigger: HTMLElement = dropdown.querySelector('ts-button')!;

            trigger.focus();
            await dropdown.updateComplete;
            await sendKeys({ press: 'Enter' });
            await dropdown.updateComplete;
            await sendKeys({ press: 'Tab' });
            await dropdown.updateComplete;

            expect(dropdown.open).to.be.true;
        });
    });

    describe('<ts-dropdown> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsDropdown>(html`<ts-dropdown></ts-dropdown>`);
            const cssText = getCssText(el);

            // popup
            expect(cssText).to.include('z-index: var(--ts-semantic-distance-zindex-dropdown);');

            // panel typography and style
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('box-shadow: var(--ts-semantic-shadow-light-lg);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');

            // slotted menu auto-size
            expect(cssText).to.include('max-width: var(--auto-size-available-width) !important;');
            expect(cssText).to.include('max-height: var(--auto-size-available-height) !important;');
        });
    });
});
