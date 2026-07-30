import { aTimeout, expect, fixture, oneEvent, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';

import type { HTMLTemplateResult } from 'lit';

import { queryByTestId } from '@utils/internal/data-testid-helpers.js';
import { clickOnElement, getCssText } from '@utils/internal/test.js';
import type { TsTabShowEvent } from '@utils/events/ts-tab-show.js';

import type { TsTab } from '@components/tab/index.js';
import type { TsTabGroup } from '@components/tab-group/index.js';

import '@tuvsud/design-system/tab';
import '@tuvsud/design-system/tab-group';
import '@tuvsud/design-system/tab-panel';
import '@tuvsud/design-system/icon-button';

interface ClientRectangles {
    body?: DOMRect;
    navigation?: DOMRect;
}

const waitForScrollButtonsToBeRendered = async (tabGroup: TsTabGroup): Promise<void> => {
    await waitUntil(() => {
        const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
        return scrollButtons?.length === 2;
    });
};

const getClientRectangles = (tabGroup: TsTabGroup): ClientRectangles => {
    const shadowRoot = tabGroup.shadowRoot;
    if (shadowRoot) {
        const nav = shadowRoot.querySelector<HTMLElement>('[part=nav]');
        const body = shadowRoot.querySelector<HTMLElement>('[part=body]');
        return {
            body: body?.getBoundingClientRect(),
            navigation: nav?.getBoundingClientRect(),
        };
    }
    return {};
};

const expectHeaderToBeVisible = (container: HTMLElement, dataTestId: string): void => {
    const generalHeader = queryByTestId<TsTab>(container, dataTestId);
    expect(generalHeader).not.to.be.null;
    expect(generalHeader).to.be.visible;
};

const expectOnlyOneTabPanelToBeActive = async (container: HTMLElement, dataTestIdOfActiveTab: string) => {
    await waitUntil(() => {
        const tabPanels = Array.from(container.getElementsByTagName('ts-tab-panel'));
        const activeTabPanels = tabPanels.filter(element => element.hasAttribute('active'));
        return activeTabPanels.length === 1;
    });
    const tabPanels = Array.from(container.getElementsByTagName('ts-tab-panel'));
    const activeTabPanels = tabPanels.filter(element => element.hasAttribute('active'));
    expect(activeTabPanels).to.have.lengthOf(1);
    expect(activeTabPanels[0]).to.have.attribute('data-testid', dataTestIdOfActiveTab);
};

const expectPromiseToHaveName = async (showEventPromise: Promise<TsTabShowEvent>, expectedName: string) => {
    const showEvent = await showEventPromise;
    expect(showEvent.detail.name).to.equal(expectedName);
};

const waitForHeaderToBeActive = async (container: HTMLElement, headerTestId: string): Promise<TsTab> => {
    const generalHeader = queryByTestId<TsTab>(container, headerTestId);
    await waitUntil(() => {
        return generalHeader?.hasAttribute('active');
    });
    if (generalHeader) {
        return generalHeader;
    } else {
        throw new Error(`did not find error with testid=${headerTestId}`);
    }
};

describe('tab group component <ts-tab-group>', () => {
    it('renders', async () => {
        const tabGroup = await fixture<TsTabGroup>(html`
            <ts-tab-group>
                <ts-tab slot="nav" panel="general">General</ts-tab>
                <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
            </ts-tab-group>
        `);

        expect(tabGroup).to.be.visible;
    });

    it('should not throw error when unmounted too fast', async () => {
        const el = await fixture(html` <div></div> `);

        el.innerHTML = '<ts-tab-group></ts-tab-group>';
        el.innerHTML = '';
    });

    it('is accessible', async () => {
        const tabGroup = await fixture<TsTabGroup>(html`
            <ts-tab-group>
                <ts-tab slot="nav" panel="general">General</ts-tab>
                <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
            </ts-tab-group>
        `);

        await expect(tabGroup).to.be.accessible();
    });

    it('displays all tabs', async () => {
        const tabGroup = await fixture<TsTabGroup>(html`
            <ts-tab-group>
                <ts-tab slot="nav" panel="general" data-testid="general-tab-header">General</ts-tab>
                <ts-tab slot="nav" panel="disabled" disabled data-testid="disabled-tab-header">Disabled</ts-tab>
                <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                <ts-tab-panel name="disabled">This is a disabled tab panel.</ts-tab-panel>
            </ts-tab-group>
        `);

        expectHeaderToBeVisible(tabGroup, 'general-tab-header');
        expectHeaderToBeVisible(tabGroup, 'disabled-tab-header');
    });

    it('shows the first tab to be active by default', async () => {
        const tabGroup = await fixture<TsTabGroup>(html`
            <ts-tab-group>
                <ts-tab slot="nav" panel="general">General</ts-tab>
                <ts-tab slot="nav" panel="custom">Custom</ts-tab>
                <ts-tab-panel name="general" data-testid="general-tab-content"
                    >This is the general tab panel.</ts-tab-panel
                >
                <ts-tab-panel name="custom">This is the custom tab panel.</ts-tab-panel>
            </ts-tab-group>
        `);

        await expectOnlyOneTabPanelToBeActive(tabGroup, 'general-tab-content');
    });

    describe('proper positioning', () => {
        it('shows the header above the tabs by default', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general">General</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);

            await aTimeout(0);

            const clientRectangles = getClientRectangles(tabGroup);
            expect(clientRectangles.body?.top).to.be.greaterThanOrEqual(
                clientRectangles.navigation?.bottom || -Infinity,
            );
        });

        it('shows the header below the tabs by setting placement to bottom', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general">General</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);
            tabGroup.placement = 'bottom';

            await aTimeout(0);

            const clientRectangles = getClientRectangles(tabGroup);
            expect(clientRectangles.body?.bottom).to.be.lessThanOrEqual(clientRectangles.navigation?.top || +Infinity);
        });

        it('shows the header left of the tabs by setting placement to start', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general">General</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);
            tabGroup.placement = 'start';

            await aTimeout(0);

            const clientRectangles = getClientRectangles(tabGroup);
            expect(clientRectangles.body?.left).to.be.greaterThanOrEqual(
                clientRectangles.navigation?.right || -Infinity,
            );
        });

        it('shows the header right of the tabs by setting placement to end', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general">General</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);
            tabGroup.placement = 'end';

            await aTimeout(0);

            const clientRectangles = getClientRectangles(tabGroup);
            expect(clientRectangles.body?.right).to.be.lessThanOrEqual(clientRectangles.navigation?.left || -Infinity);
        });
    });

    describe('scrolling behavior', () => {
        const generateTabs = (n: number): HTMLTemplateResult[] => {
            const result: HTMLTemplateResult[] = [];
            for (let i = 0; i < n; i++) {
                result.push(
                    html`<ts-tab slot="nav" panel="tab-${i}">Tab ${i}</ts-tab>
                        <ts-tab-panel name="tab-${i}">Content of tab ${i}0</ts-tab-panel> `,
                );
            }
            return result;
        };

        before(() => {
            // disabling failing on resize observer ... unfortunately on webkit this is not really specific
            // https://github.com/WICG/resize-observer/issues/38#issuecomment-422126006
            // https://stackoverflow.com/a/64197640
            const errorHandler = window.onerror;
            window.onerror = (
                event: string | Event,
                source?: string | undefined,
                lineno?: number | undefined,
                colno?: number | undefined,
                error?: Error | undefined,
            ) => {
                if ((event as string).includes('ResizeObserver') || event === 'Script error.') {
                    return true;
                } else if (errorHandler) {
                    return errorHandler(event, source, lineno, colno, error);
                } else {
                    return true;
                }
            };
        });

        it('shows scroll buttons on too many tabs', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`<ts-tab-group> ${generateTabs(30)} </ts-tab-group>`);

            await waitForScrollButtonsToBeRendered(tabGroup);

            const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
            expect(scrollButtons, 'Both scroll buttons should be shown').to.have.length(2);

            tabGroup.disconnectedCallback();
        });

        it('does not show scroll buttons on too many tabs if deactivated', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`<ts-tab-group> ${generateTabs(30)} </ts-tab-group>`);
            tabGroup.noScrollControls = true;

            await aTimeout(0);

            const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
            expect(scrollButtons).to.have.length(0);
        });

        it('does not show scroll buttons if all tabs fit on the screen', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`<ts-tab-group> ${generateTabs(2)} </ts-tab-group>`);

            await aTimeout(0);

            const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
            expect(scrollButtons).to.have.length(0);
        });

        it('does not show scroll buttons if placement is start', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`<ts-tab-group> ${generateTabs(50)} </ts-tab-group>`);
            tabGroup.placement = 'start';

            await aTimeout(0);

            const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
            expect(scrollButtons).to.have.length(0);
        });

        it('does not show scroll buttons if placement is end', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`<ts-tab-group> ${generateTabs(50)} </ts-tab-group>`);
            tabGroup.placement = 'end';

            await aTimeout(0);

            const scrollButtons = tabGroup.shadowRoot?.querySelectorAll('ts-icon-button');
            expect(scrollButtons).to.have.length(0);
        });
    });

    describe('tab selection', () => {
        const expectCustomTabToBeActiveAfter = async (
            tabGroup: TsTabGroup,
            action: () => Promise<void>,
        ): Promise<void> => {
            const generalHeader = await waitForHeaderToBeActive(tabGroup, 'general-header');
            generalHeader.focus();

            const customHeader = queryByTestId<TsTab>(tabGroup, 'custom-header');
            expect(customHeader).not.to.have.attribute('active');

            const showEventPromise = oneEvent(tabGroup, 'ts-tab-show') as Promise<TsTabShowEvent>;
            await action();

            expect(customHeader).to.have.attribute('active');
            await expectPromiseToHaveName(showEventPromise, 'custom');
            return expectOnlyOneTabPanelToBeActive(tabGroup, 'custom-tab-content');
        };

        const expectGeneralTabToBeStillActiveAfter = async (
            tabGroup: TsTabGroup,
            action: () => Promise<void>,
        ): Promise<void> => {
            const generalHeader = await waitForHeaderToBeActive(tabGroup, 'general-header');
            generalHeader.focus();

            let showEventFired = false;
            let hideEventFired = false;
            oneEvent(tabGroup, 'ts-tab-show').then(() => (showEventFired = true));
            oneEvent(tabGroup, 'ts-tab-hide').then(() => (hideEventFired = true));
            await action();

            expect(generalHeader).to.have.attribute('active');
            expect(showEventFired).to.be.false;
            expect(hideEventFired).to.be.false;
            return expectOnlyOneTabPanelToBeActive(tabGroup, 'general-tab-content');
        };

        it('selects a tab by clicking on it', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom" data-testid="custom-header">Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom" data-testid="custom-tab-content"
                        >This is the custom tab panel.</ts-tab-panel
                    >
                </ts-tab-group>
            `);

            const customHeader = queryByTestId<TsTab>(tabGroup, 'custom-header');
            return expectCustomTabToBeActiveAfter(tabGroup, () => clickOnElement(customHeader!));
        });

        it('selects a tab by changing it via active property', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom" data-testid="custom-header">Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom" data-testid="custom-tab-content"
                        >This is the custom tab panel.</ts-tab-panel
                    >
                </ts-tab-group>
            `);

            const customHeader = queryByTestId<TsTab>(tabGroup, 'custom-header')!;
            const generalHeader = await waitForHeaderToBeActive(tabGroup, 'general-header');
            generalHeader.focus();

            expect(customHeader).not.to.have.attribute('active');

            const showEventPromise = oneEvent(tabGroup, 'ts-tab-show') as Promise<TsTabShowEvent>;
            customHeader.active = true;

            await tabGroup.updateComplete;
            expect(customHeader).to.have.attribute('active');
            await expectPromiseToHaveName(showEventPromise, 'custom');
            return expectOnlyOneTabPanelToBeActive(tabGroup, 'custom-tab-content');
        });

        it('does not change if the active tab is reselected', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom">Custom</ts-tab>
                    <ts-tab-panel name="general" data-testid="general-tab-content"
                        >This is the general tab panel.</ts-tab-panel
                    >
                    <ts-tab-panel name="custom">This is the custom tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);

            const generalHeader = queryByTestId(tabGroup, 'general-header');
            return expectGeneralTabToBeStillActiveAfter(tabGroup, () => clickOnElement(generalHeader!));
        });

        it('does not change if a disabled tab is clicked', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="disabled" data-testid="disabled-header" disabled>disabled</ts-tab>
                    <ts-tab-panel name="general" data-testid="general-tab-content"
                        >This is the general tab panel.</ts-tab-panel
                    >
                    <ts-tab-panel name="disabled">This is the disabled tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);

            const disabledHeader = queryByTestId(tabGroup, 'disabled-header');
            return expectGeneralTabToBeStillActiveAfter(tabGroup, () => clickOnElement(disabledHeader!));
        });

        it('selects a tab by using the arrow keys', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom" data-testid="custom-header">Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom" data-testid="custom-tab-content"
                        >This is the custom tab panel.</ts-tab-panel
                    >
                </ts-tab-group>
            `);

            return expectCustomTabToBeActiveAfter(tabGroup, () => sendKeys({ press: 'ArrowRight' }));
        });

        it('selects a tab by using the arrow keys and enter if activation is set to manual', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom" data-testid="custom-header">Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom" data-testid="custom-tab-content"
                        >This is the custom tab panel.</ts-tab-panel
                    >
                </ts-tab-group>
            `);
            tabGroup.activation = 'manual';

            const generalHeader = await waitForHeaderToBeActive(tabGroup, 'general-header');
            generalHeader.focus();

            const customHeader = queryByTestId<TsTab>(tabGroup, 'custom-header');
            expect(customHeader).not.to.have.attribute('active');

            const showEventPromise = oneEvent(tabGroup, 'ts-tab-show') as Promise<TsTabShowEvent>;
            await sendKeys({ press: 'ArrowRight' });
            await aTimeout(0);
            expect(generalHeader).to.have.attribute('active');

            await sendKeys({ press: 'Enter' });

            expect(customHeader).to.have.attribute('active');
            await expectPromiseToHaveName(showEventPromise, 'custom');
            return expectOnlyOneTabPanelToBeActive(tabGroup, 'custom-tab-content');
        });

        it('does not allow selection of disabled tabs with arrow keys', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="disabled" disabled>Disabled</ts-tab>
                    <ts-tab-panel name="general" data-testid="general-tab-content"
                        >This is the general tab panel.</ts-tab-panel
                    >
                    <ts-tab-panel name="disabled">This is the custom tab panel.</ts-tab-panel>
                </ts-tab-group>
            `);

            return expectGeneralTabToBeStillActiveAfter(tabGroup, () => sendKeys({ press: 'ArrowRight' }));
        });

        it('selects a tab by using the show function', async () => {
            const tabGroup = await fixture<TsTabGroup>(html`
                <ts-tab-group>
                    <ts-tab slot="nav" panel="general" data-testid="general-header">General</ts-tab>
                    <ts-tab slot="nav" panel="custom" data-testid="custom-header">Custom</ts-tab>
                    <ts-tab-panel name="general">This is the general tab panel.</ts-tab-panel>
                    <ts-tab-panel name="custom" data-testid="custom-tab-content"
                        >This is the custom tab panel.</ts-tab-panel
                    >
                </ts-tab-group>
            `);

            return expectCustomTabToBeActiveAfter(tabGroup, () => {
                tabGroup.show('custom');
                return aTimeout(0);
            });
        });
    });

    describe('<ts-tab-group> css variables', () => {
        it('uses the correct CSS variables in styles', async () => {
            const el = await fixture<TsTabGroup>(html`<ts-tab-group></ts-tab-group>`);
            const cssText = getCssText(el);

            // host custom props
            expect(cssText).to.include('--indicator-color: var(--ts-semantic-color-border-primary-default);');
            expect(cssText).to.include('--track-color: var(--ts-semantic-color-border-base-default);');
            expect(cssText).to.include('--track-width: 2px;');

            // base
            expect(cssText).to.include('color: var(--ts-semantic-color-text-base-default);');

            // indicator transition
            expect(cssText).to.include('transition:');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-fast) translate ease');
            expect(cssText).to.include('var(--ts-semantic-transition-duration-fast) width ease');

            // scroll buttons
            expect(cssText).to.include('width: var(--ts-semantic-size-space-400);');
            expect(cssText).to.include('padding: 0 var(--ts-semantic-size-space-600);');

            // tab-group top
            expect(cssText).to.include('border-bottom: solid var(--track-width) var(--track-color);');
            expect(cssText).to.include('border-bottom: solid var(--track-width) var(--indicator-color);');
            expect(cssText).to.include('--padding: var(--ts-semantic-size-space-400) 0;');

            // tab-group bottom
            expect(cssText).to.include('border-top: solid var(--track-width) var(--track-color);');
            expect(cssText).to.include('border-top: solid var(--track-width) var(--indicator-color);');

            // tab-group start
            expect(cssText).to.include('border-inline-end: solid var(--track-width) var(--track-color);');
            expect(cssText).to.include('border-right: solid var(--track-width) var(--indicator-color);');
            expect(cssText).to.include('--padding: 0 var(--ts-semantic-size-space-400);');

            // tab-group end
            expect(cssText).to.include('border-left: solid var(--track-width) var(--track-color);');
            expect(cssText).to.include('border-inline-start: solid var(--track-width) var(--indicator-color);');
        });
    });
});
