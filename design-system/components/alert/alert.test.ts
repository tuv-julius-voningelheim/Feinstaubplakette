import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { resetMouse } from '@web/test-runner-commands';
import sinon from 'sinon';

import { clickOnElement, moveMouseOnElement } from '@utils/internal/test.js';

import type { TsAlert } from '@components/alert/index.js';
import type { TsIconButton } from '@components/icon-button/index.js';

import '@tuvsud/design-system/alert';

const getAlertContainer = (alert: TsAlert): HTMLElement => {
    return alert.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!;
};

const expectAlertToBeVisible = (alert: TsAlert): void => {
    const alertContainer = getAlertContainer(alert);
    const style = window.getComputedStyle(alertContainer);
    expect(alertContainer.hidden).to.equal(false);
    expect(style.display).not.to.equal('none');
    expect(style.visibility).not.to.equal('hidden');
    expect(style.visibility).not.to.equal('collapse');
};

const expectAlertToBeInvisible = (alert: TsAlert): void => {
    const alertContainer = getAlertContainer(alert);
    const style = window.getComputedStyle(alertContainer);
    expect(alertContainer.hidden).to.equal(true);
    expect(style.display, 'alert should be invisible').to.equal('none');
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

const expectHideAndAfterHideToBeEmittedInCorrectOrder = async (alert: TsAlert, action: () => void | Promise<void>) => {
    await expectEventsInOrder(alert, ['ts-hide', 'ts-after-hide'], action);
    expectAlertToBeInvisible(alert);
};

const expectShowAndAfterShowToBeEmittedInCorrectOrder = async (alert: TsAlert, action: () => void | Promise<void>) => {
    await expectEventsInOrder(alert, ['ts-show', 'ts-after-show'], action);
    expectAlertToBeVisible(alert);
};

const getCloseButton = (alert: TsAlert): TsIconButton | null | undefined =>
    alert.shadowRoot?.querySelector<TsIconButton>('[part="close-button"]');

describe('alert component <ts-alert>', () => {
    let clock: sinon.SinonFakeTimers | null = null;

    afterEach(async () => {
        clock?.restore();
        clock = null;
        await resetMouse();
    });

    describe('alert render', () => {
        it('renders', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open>I am an alert</ts-alert>`);
            expectAlertToBeVisible(alert);
        });

        it('is accessible', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open>I am an alert</ts-alert>`);
            await expect(alert).to.be.accessible();
        });
    });

    describe('alert visibility', () => {
        it('should be visible with the open attribute', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open>I am an alert</ts-alert>`);
            expectAlertToBeVisible(alert);
        });

        it('should not be visible without the open attribute', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert>I am an alert</ts-alert>`);
            expectAlertToBeInvisible(alert);
        });

        it('should emit ts-show and ts-after-show when calling show()', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert>I am an alert</ts-alert>`);
            expectAlertToBeInvisible(alert);
            await expectShowAndAfterShowToBeEmittedInCorrectOrder(alert, () => alert.show());
        });

        it('should emit ts-hide and ts-after-hide when calling hide()', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open>I am an alert</ts-alert>`);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => alert.hide());
        });

        it('should emit ts-show and ts-after-show when setting open = true', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert>I am an alert</ts-alert>`);
            await expectShowAndAfterShowToBeEmittedInCorrectOrder(alert, () => {
                alert.open = true;
            });
        });

        it('should emit ts-hide and ts-after-hide when setting open = false', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open>I am an alert</ts-alert>`);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => {
                alert.open = false;
            });
        });
    });

    describe('close button', () => {
        it('shows a close button if the alert has the closable attribute', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open closable>I am an alert</ts-alert>`);
            const closeButton = getCloseButton(alert);
            expect(closeButton).to.be.visible;
        });

        it('clicking the close button closes the alert', async () => {
            const alert = await fixture<TsAlert>(html`<ts-alert open closable>I am an alert</ts-alert>`);
            const closeButton = getCloseButton(alert);
            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => clickOnElement(closeButton!));
        });

        it('clicking around the close button does not close the alert', async () => {
            const wrapper = await fixture<HTMLDivElement>(
                html`<div class="wrapper" style="padding: 24px; background-color: red;">
                    <ts-alert open closable>I am an alert</ts-alert>
                </div>`,
            );
            const alert = wrapper.querySelector('ts-alert') as TsAlert;
            const closeButton = getCloseButton(alert)!;

            const tryClick = async (where: 'top' | 'bottom' | 'right', dx: number, dy: number) => {
                const afterHide = oneEvent(alert, 'ts-after-hide');
                await clickOnElement(closeButton, where, dx, dy);
                await aTimeout(0);
                let hid = false;
                afterHide.then(() => (hid = true));
                await aTimeout(0);
                expect(hid).to.equal(false);
                expectAlertToBeVisible(alert);
            };

            await tryClick('top', 0, -4);
            await tryClick('bottom', 0, 4);
            await tryClick('right', 4, 0);
        });
    });

    describe('timer controlled closing', () => {
        it('closes after a predefined amount of time', async () => {
            clock = sinon.useFakeTimers();
            const alert = await fixture<TsAlert>(html`<ts-alert open duration="3000">I am an alert</ts-alert>`);
            expectAlertToBeVisible(alert);

            clock.tick(2999);
            expectAlertToBeVisible(alert);

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => {
                clock!.tick(1);
            });
        });

        it('pauses on mouse enter and resumes on mouse leave', async () => {
            clock = sinon.useFakeTimers();
            const alert = await fixture<TsAlert>(html`<ts-alert open duration="3000">I am an alert</ts-alert>`);
            expectAlertToBeVisible(alert);

            clock.tick(1000);
            await moveMouseOnElement(alert);

            clock.tick(2999);
            expectAlertToBeVisible(alert);

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => {
                clock!.tick(1);
            });
        });

        it('resets the closing timer after opening', async () => {
            clock = sinon.useFakeTimers();
            const alert = await fixture<TsAlert>(html`<ts-alert duration="3000">I am an alert</ts-alert>`);
            expectAlertToBeInvisible(alert);

            clock.tick(1000);

            const afterShowPromise = oneEvent(alert, 'ts-after-show');
            alert.show();
            await afterShowPromise;

            clock.tick(2999);

            await expectHideAndAfterHideToBeEmittedInCorrectOrder(alert, () => {
                clock!.tick(1);
            });
        });
    });

    describe('alert variants', () => {
        const variants = ['primary', 'success', 'neutral', 'warning', 'danger'];

        variants.forEach(variant => {
            it(`adapts to the variant: ${variant}`, async () => {
                const alert = await fixture<TsAlert>(
                    html`<ts-alert variant="${variant}" open>I am an alert</ts-alert>`,
                );
                const alertContainer = getAlertContainer(alert);
                expect(alertContainer).to.have.class(`alert--${variant}`);
            });
        });
    });

    describe('css Style variables', () => {
        it('uses the expected tokens in styles', async () => {
            const el = await fixture<TsAlert>(html`<ts-alert>Alert</ts-alert>`);
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

            expect(cssText).to.include('.alert--success {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-success-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-success-subtle-default);');

            expect(cssText).to.include('.alert--neutral {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-neutral-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-neutral-subtle-default);');

            expect(cssText).to.include('.alert--warning {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-warning-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-warning-subtle-default);');

            expect(cssText).to.include('.alert--danger {');
            expect(cssText).to.include('border-color: var(--ts-semantic-color-border-danger-default);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-background-danger-subtle-default);');

            expect(cssText).to.include('height: calc(var(--ts-semantic-size-width-sm) * 3);');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-neutral-default);');

            expect(cssText).to.include('.alert--primary .alert__countdown-elapsed {');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-primary-default);');

            expect(cssText).to.include('.alert--success .alert__countdown-elapsed {');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-success-default);');

            expect(cssText).to.include('.alert--neutral .alert__countdown-elapsed {');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-neutral-default);');

            expect(cssText).to.include('.alert--warning .alert__countdown-elapsed {');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-warning-default);');

            expect(cssText).to.include('.alert--danger .alert__countdown-elapsed {');
            expect(cssText).to.include('background-color: var(--ts-semantic-color-border-danger-default);');
        });
    });
});
