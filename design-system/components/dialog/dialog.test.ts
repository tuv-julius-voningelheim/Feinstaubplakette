import { aTimeout, elementUpdated, expect, fixture, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html, LitElement } from 'lit';
import sinon from 'sinon';

import { getCssText } from '@utils/internal/test.js';

import type { TsDialog } from '@components/dialog/index.js';

import '@tuvsud/design-system/dialog';

describe('dialog component <ts-dialog>', () => {
    it('should be visible with the open attribute', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.hidden).to.be.false;
    });

    it('should not be visible without the open attribute', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

        expect(base.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when calling show()', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.show();

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.hide();

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.true;
    });

    it('should emit ts-show and ts-after-show when setting open = true', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const showHandler = sinon.spy();
        const afterShowHandler = sinon.spy();

        el.addEventListener('ts-show', showHandler);
        el.addEventListener('ts-after-show', afterShowHandler);
        el.open = true;

        await waitUntil(() => showHandler.calledOnce);
        await waitUntil(() => afterShowHandler.calledOnce);

        expect(showHandler).to.have.been.calledOnce;
        expect(afterShowHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.false;
    });

    it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
        const hideHandler = sinon.spy();
        const afterHideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);
        el.addEventListener('ts-after-hide', afterHideHandler);
        el.open = false;

        await waitUntil(() => hideHandler.calledOnce);
        await waitUntil(() => afterHideHandler.calledOnce);

        expect(hideHandler).to.have.been.calledOnce;
        expect(afterHideHandler).to.have.been.calledOnce;
        expect(base.hidden).to.be.true;
    });

    it('should not close when ts-request-close is prevented', async () => {
        const el = await fixture<TsDialog>(html`
            <ts-dialog open>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</ts-dialog>
        `);
        const overlay = el.shadowRoot!.querySelector<HTMLElement>('[part~="overlay"]')!;

        el.addEventListener('ts-request-close', event => {
            event.preventDefault();
        });
        overlay.click();

        expect(el.open).to.be.true;
    });

    it('should allow initial focus to be set', async () => {
        const el = await fixture<TsDialog>(html` <ts-dialog><input /></ts-dialog>`);
        const input = el.querySelector('input')!;
        const initialFocusHandler = sinon.spy((event: Event) => {
            event.preventDefault();
            input.focus();
        });

        el.addEventListener('ts-initial-focus', initialFocusHandler);
        el.show();

        await waitUntil(() => initialFocusHandler.calledOnce);

        expect(initialFocusHandler).to.have.been.calledOnce;
        expect(document.activeElement).to.equal(input);
    });

    it('should close when pressing Escape', async () => {
        const el = await fixture<TsDialog>(html`<ts-dialog open></ts-dialog>`);
        const hideHandler = sinon.spy();

        el.addEventListener('ts-hide', hideHandler);

        await sendKeys({ press: 'Escape' });
        await waitUntil(() => hideHandler.calledOnce);

        expect(el.open).to.be.false;
    });

    it('should properly cycle through tabbable elements when ts-dialog is used in a shadowRoot', async () => {
        class AContainer extends LitElement {
            get dialog() {
                return this.shadowRoot?.querySelector('ts-dialog');
            }

            openDialog() {
                (this.dialog! as TsDialog).show();
            }

            override render() {
                return html`
                    <h1>Dialog Example</h1>
                    <ts-dialog label="Dialog" class="dialog-overview">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        <br />
                        <label><input type="checkbox" />A</label>
                        <label><input type="checkbox" />B</label>
                        <button>Button</button>
                    </ts-dialog>
                    <ts-button @click=${this.openDialog}>Open Dialog</ts-button>
                `;
            }
        }

        if (!window.customElements.get('a-container')) {
            window.customElements.define('a-container', AContainer);
        }

        const testCase = await fixture(html`
            <div>
                <a-container></a-container>
                <p>
                    Open the dialog, then use <kbd>Tab</kbd> to cycle through the inputs. Focus should be trapped, but
                    it reaches things outside the dialog.
                </p>
            </div>
        `);

        const container = testCase.querySelector('a-container');

        if (!container) {
            throw Error('Could not find <a-container> element.');
        }

        await elementUpdated(container);
        const dialog = container.shadowRoot?.querySelector('ts-dialog');

        if (!dialog) {
            throw Error('Could not find <ts-dialog> element.');
        }

        const closeButton = dialog.shadowRoot?.querySelector('ts-icon-button');
        const checkbox1 = dialog.querySelector("input[type='checkbox']");
        const checkbox2 = dialog.querySelectorAll("input[type='checkbox']")[1];
        const button = dialog.querySelector('button');

        // Opens modal.
        const openModalButton = container.shadowRoot?.querySelector('ts-button');

        (openModalButton as HTMLElement).click();

        // Test tab cycling
        await pressTab();

        expect(container.shadowRoot?.activeElement).to.equal(dialog);
        expect(dialog.shadowRoot?.activeElement).to.equal(closeButton);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(checkbox1);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(checkbox2);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(button);

        await pressTab();
        expect(dialog.shadowRoot?.activeElement).to.equal(closeButton);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(checkbox1);

        // Test Shift+Tab cycling

        // I found these timeouts were needed for WebKit locally.
        await aTimeout(10);
        await sendKeys({ down: 'Shift' });
        await aTimeout(10);

        await pressTab();
        expect(dialog.shadowRoot?.activeElement).to.equal(closeButton);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(button);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(checkbox2);

        await pressTab();
        expect(container.shadowRoot?.activeElement).to.equal(checkbox1);

        await pressTab();
        expect(dialog.shadowRoot?.activeElement).to.equal(closeButton);

        // End shift+tab cycling
        await sendKeys({ up: 'Shift' });
    });

    describe('<ts-dialog> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsDialog>(html`<ts-dialog></ts-dialog>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--width: 31rem;');
            expect(cssText).to.include('--header-spacing: var(--ts-semantic-size-space-600);');
            expect(cssText).to.include('--body-spacing: var(--ts-semantic-size-space-600);');
            expect(cssText).to.include('--footer-spacing: var(--ts-semantic-size-space-600);');

            // container
            expect(cssText).to.include('z-index: var(--ts-semantic-distance-zindex-dialog);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            // panel
            expect(cssText).to.include('width: var(--width);');
            expect(cssText).to.include('max-width: calc(100% - var(--ts-semantic-size-space-800));');
            expect(cssText).to.include('max-height: calc(100% - var(--ts-semantic-size-space-800));');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-surface-base-default);');
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include('box-shadow: var(--ts-semantic-shadow-light-xl);');

            // title
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-xl);');
            expect(cssText).to.include('padding: var(--header-spacing);');

            // header actions
            expect(cssText).to.include('gap: var(--ts-semantic-size-space-100);');
            expect(cssText).to.include('padding: 0 var(--header-spacing);');
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-md);');

            // body
            expect(cssText).to.include('padding: var(--body-spacing);');

            // footer
            expect(cssText).to.include('padding: var(--footer-spacing);');
            expect(cssText).to.include('margin-inline-start: var(--ts-semantic-size-space-300);');

            // overlay
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-disabled);');

            // forced colors
            expect(cssText).to.include('border: solid 1px var(--ts-semantic-color-border-base-default);');
        });
    });
});

// We wait 50ms just to give the browser some time to figure out the current focus.
// 50 was the magic number I found locally :shrug:
async function pressTab() {
    await aTimeout(50);
    await sendKeys({ press: 'Tab' });
    await aTimeout(50);
}
