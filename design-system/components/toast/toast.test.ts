import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { resetMouse } from '@web/test-runner-commands';
import sinon from 'sinon';

import { clickOnElement, moveMouseOnElement } from '@utils/internal/test.js';

import type { TsIconButton } from '@components/icon-button/index.js';
import type { TsToast } from '@components/toast/index.js';

import '@tuvsud/design-system/toast';

const gettoastContainer = (toast: TsToast): HTMLElement => {
    return toast.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;
};

const expecttoastToBeVisible = (toast: TsToast): void => {
    const toastContainer = gettoastContainer(toast);
    const style = window.getComputedStyle(toastContainer);
    expect(toastContainer.hidden).to.equal(false);
    expect(style.display).not.to.equal('none');
    expect(style.visibility).not.to.equal('hidden');
    expect(style.visibility).not.to.equal('collapse');
};

const expecttoastToBeInvisible = (toast: TsToast): void => {
    const toastContainer = gettoastContainer(toast);
    const style = window.getComputedStyle(toastContainer);
    expect(toastContainer.hidden).to.equal(true);
    expect(style.display, 'toast should be invisible').to.equal('none');
};

const expectEventsInOrder = async (el: HTMLElement, events: string[], action: () => void | Promise<void>) => {
    const seen: string[] = [];
    const handlers = events.map(type => {
        const fn = () => seen.push(type);
        el.addEventListener(type, fn as EventListener);
        return { type, fn };
    });

    const promises = events.map(type => oneEvent(el, type));
    await Promise.resolve(action());
    for (const p of promises) {
        await p;
    }

    for (const { type, fn } of handlers) {
        el.removeEventListener(type, fn as EventListener);
    }

    expect(seen).to.deep.equal(events);
};

const expectHideAndAfterHideToBeEmittedInCorrectOrder = async (toast: TsToast, action: () => void | Promise<void>) => {
    await expectEventsInOrder(toast, ['ts-hide', 'ts-after-hide'], action);
    expecttoastToBeInvisible(toast);
};

const expectShowAndAfterShowToBeEmittedInCorrectOrder = async (toast: TsToast, action: () => void | Promise<void>) => {
    await expectEventsInOrder(toast, ['ts-show', 'ts-after-show'], action);
    expecttoastToBeVisible(toast);
};

const getCloseButton = (toast: TsToast): TsIconButton | null | undefined =>
    toast.shadowRoot?.querySelector<TsIconButton>('[part="close-button"]');

describe('toast component <ts-toast>', () => {
    let clock: sinon.SinonFakeTimers | null = null;

    afterEach(async () => {
        clock?.restore();
        clock = null;
        await resetMouse();
    });

    describe('toast render', () => {
        it('renders', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline" open>I am an toast</ts-toast>`);
            expecttoastToBeVisible(toast);
        });

        it('is accessible', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline" open>I am an toast</ts-toast>`);
            await expect(toast).to.be.accessible();
        });
    });

    describe('toast visibility', () => {
        it('should be visible with the open attribute', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline" open>I am an toast</ts-toast>`);
            expecttoastToBeVisible(toast);
        });

        it('should not be visible without the open attribute', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline">I am an toast</ts-toast>`);
            expecttoastToBeInvisible(toast);
        });

        it('should emit ts-show and ts-after-show when calling show()', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline">I am an toast</ts-toast>`);
            expecttoastToBeInvisible(toast);
            await expectShowAndAfterShowToBeEmittedInCorrectOrder(toast, () => toast.show());
        });

        it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline" open>I am an toast</ts-toast>`);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => toast.hide());
        });

        it('should emit ts-show and ts-after-show when setting open = true', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline">I am an toast</ts-toast>`);
            await expectShowAndAfterShowToBeEmittedInCorrectOrder(toast, () => {
                toast.open = true;
            });
        });

        it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
            const toast = await fixture<TsToast>(html`<ts-toast placement="inline" open>I am an toast</ts-toast>`);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => {
                toast.open = false;
            });
        });
    });

    describe('close button', () => {
        it('shows a close button if the toast has the closable attribute', async () => {
            const toast = await fixture<TsToast>(
                html`<ts-toast placement="inline" open closable>I am an toast</ts-toast>`,
            );
            const closeButton = getCloseButton(toast);
            expect(closeButton).to.be.visible;
        });

        it('clicking the close button closes the toast', async () => {
            const toast = await fixture<TsToast>(
                html`<ts-toast placement="inline" open closable>I am an toast</ts-toast>`,
            );
            const closeButton = getCloseButton(toast);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => clickOnElement(closeButton!));
        });

        it('clicking around the close button does not close the toast', async () => {
            const wrapper = await fixture<HTMLDivElement>(
                html`<div class="wrapper" style="padding: 24px; background-color: red;">
                    <ts-toast placement="inline" open closable>I am an toast</ts-toast>
                </div>`,
            );
            const toast = wrapper.querySelector('ts-toast') as TsToast;
            const closeButton = getCloseButton(toast)!;

            const tryClick = async (where: 'top' | 'bottom' | 'right', dx: number, dy: number) => {
                const afterHide = oneEvent(toast, 'ts-after-hide');
                await clickOnElement(closeButton, where, dx, dy);
                await aTimeout(0);
                let hid = false;
                afterHide.then(() => (hid = true));
                await aTimeout(0);
                expect(hid).to.equal(false);
                expecttoastToBeVisible(toast);
            };

            await tryClick('top', 0, -4);
            await tryClick('bottom', 0, 4);
            await tryClick('right', 4, 0);
        });
    });

    describe('timer controlled closing', () => {
        it('closes after a predefined amount of time', async () => {
            clock = sinon.useFakeTimers();
            const toast = await fixture<TsToast>(
                html`<ts-toast placement="inline" open duration="3000">I am an toast</ts-toast>`,
            );
            expecttoastToBeVisible(toast);

            clock.tick(2999);
            expecttoastToBeVisible(toast);

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => {
                clock!.tick(1);
            });
        });

        it('pauses on mouse enter and resumes on mouse leave', async () => {
            clock = sinon.useFakeTimers();
            const toast = await fixture<TsToast>(
                html`<ts-toast placement="inline" open duration="3000">I am an toast</ts-toast>`,
            );
            expecttoastToBeVisible(toast);

            clock.tick(1000);

            const base = gettoastContainer(toast);
            await moveMouseOnElement(base);

            clock.tick(5000);
            expecttoastToBeVisible(toast);

            await resetMouse();

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => {
                clock!.tick(2000);
            });
        });

        it('resets the closing timer after opening', async () => {
            clock = sinon.useFakeTimers();
            const toast = await fixture<TsToast>(
                html`<ts-toast placement="inline" duration="3000">I am an toast</ts-toast>`,
            );
            expecttoastToBeInvisible(toast);

            clock.tick(1000);

            const afterShowPromise = oneEvent(toast, 'ts-after-show');
            toast.show();
            await afterShowPromise;

            clock.tick(2999);

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(toast, () => {
                clock!.tick(1);
            });
        });
    });

    describe('toast variants', () => {
        const variants = ['primary', 'success', 'neutral', 'warning', 'danger'];

        variants.forEach(variant => {
            it(`adapts to the variant: ${variant}`, async () => {
                const toast = await fixture<TsToast>(
                    html`<ts-toast placement="inline" variant="${variant}" open>I am an toast</ts-toast>`,
                );
                const toastContainer = gettoastContainer(toast);
                expect(toastContainer).to.have.class(`toast--${variant}`);
            });
        });
    });

    describe('css Style variables', () => {
        it('uses the expected tokens in styles', async () => {
            const el = await fixture<TsToast>(html`<ts-toast placement="inline">toast</ts-toast>`);
            const sheets = Array.from(el.shadowRoot!.adoptedStyleSheets);
            const cssText = sheets
                .map(s =>
                    Array.from(s.cssRules)
                        .map(r => r.cssText)
                        .join('\n'),
                )
                .join('\n');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-primary-subtle-default);');
            expect(cssText).to.include(
                'border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-primary-default);',
            );
            expect(cssText).to.include('border-radius: var(--ts-semantic-size-radius-md);');
            expect(cssText).to.include(
                'font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;',
            );
            expect(cssText).to.include('font-size: var(--ts-semantic-typography-ui-font-size-sm);');
            expect(cssText).to.include('font-weight: var(--ts-semantic-typography-font-weight-regular);');
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            expect(cssText).to.include('gap: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);');

            expect(cssText).to.include('.toast--success {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-success-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-subtle-default);');

            expect(cssText).to.include('.toast--neutral {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-neutral-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-subtle-default);');

            expect(cssText).to.include('.toast--warning {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-warning-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-subtle-default);');

            expect(cssText).to.include('.toast--danger {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-danger-subtle-default);');

            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-neutral-default);');
        });
    });
});
