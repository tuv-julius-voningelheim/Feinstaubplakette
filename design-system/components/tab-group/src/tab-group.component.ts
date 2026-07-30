import { html } from 'lit';
import { eventOptions, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { scrollIntoView } from '@utils/internal/scroll.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';
import { TsResizeObserver } from '@components/resize-observer/index.js';
import type { TsTab } from '@components/tab/index.js';
import type { TsTabPanel } from '@components/tab-panel/index.js';

import styles from './TsTabGroupStyles.js';

import '@utils/internal/scrollend-polyfill.js';

/**
 * @summary Tab groups organize content into a container that shows one section at a time.
 * @documentation https://create.tuvsud.com/latest/components/tab-group/develop-fV7WgF29
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 *
 * @slot - Used for grouping tab panels in the tab group. Must be `<ts-tab-panel>` elements.
 * @slot nav - Used for grouping tabs in the tab group. Must be `<ts-tab>` elements.
 *
 * @event {{ name: String }} ts-tab-show - Emitted when a tab is shown.
 * @event {{ name: String }} ts-tab-hide - Emitted when a tab is hidden.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The tab group's navigation container where tabs are slotted in.
 * @csspart tabs - The container that wraps the tabs.
 * @csspart active-tab-indicator - The line that highlights the currently selected tab.
 * @csspart body - The tab group's body where tab panels are slotted in.
 * @csspart scroll-button - The previous/next scroll buttons that show when tabs are scrollable, an `<ts-icon-button>`.
 * @csspart scroll-button--start - The starting scroll button.
 * @csspart scroll-button--end - The ending scroll button.
 * @csspart scroll-button__base - The scroll button's exported `base` part.
 *
 * @cssproperty --indicator-color - The color of the active tab indicator.
 * @cssproperty --track-color - The color of the indicator's track (the line that separates tabs from panels).
 * @cssproperty --track-width - The width of the indicator's track (the line that separates tabs from panels).
 */
export default class TsTabGroupComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = {
        'ts-icon-button': TsIconButton,
        'ts-resize-observer': TsResizeObserver,
    };

    private activeTab?: TsTab;
    private mutationObserver!: MutationObserver;
    private resizeObserver!: ResizeObserver;
    private tabs: TsTab[] = [];
    private focusableTabs: TsTab[] = [];
    private panels: TsTabPanel[] = [];
    private readonly localize = new LocalizeController(this);

    @query('.tab-group') tabGroup!: HTMLElement;
    @query('.tab-group__body') body!: HTMLSlotElement;
    @query('.tab-group__nav') nav!: HTMLElement;
    @query('.tab-group__indicator') indicator!: HTMLElement;

    @state() private hasScrollControls = false;

    @state() private shouldHideScrollStartButton = false;
    @state() private shouldHideScrollEndButton = false;

    /** The placement of the tabs. */
    @property() placement: 'top' | 'bottom' | 'start' | 'end' = 'top';

    /**
     * When set to auto, navigating tabs with the arrow keys will instantly show the corresponding tab panel.
     * When set to manual, the tab will receive focus but will not show until the user presses spacebar or enter.
     */
    @property() activation: 'auto' | 'manual' = 'auto';

    /** Disables the scroll arrows that appear when tabs overflow. */
    @property({ attribute: 'no-scroll-controls', type: Boolean })
    noScrollControls = false;

    /** Prevent scroll buttons from being hidden when inactive. */
    @property({ attribute: 'fixed-scroll-controls', type: Boolean })
    fixedScrollControls = false;

    override connectedCallback() {
        const whenAllDefined = Promise.all([
            customElements.whenDefined('ts-tab'),
            customElements.whenDefined('ts-tab-panel'),
        ]);

        super.connectedCallback();

        this.resizeObserver = new ResizeObserver(() => {
            this.repositionIndicator();
            this.updateScrollControls();
        });

        this.mutationObserver = new MutationObserver(mutations => {
            // Make sure to only observe the direct children of the tab group
            // instead of other sub elements that might be slotted in.
            const instanceMutations = mutations.filter(({ target }) => {
                if (target === this) return true; // Allow self updates
                if ((target as HTMLElement).closest('ts-tab-group') !== this) return false;

                // We should only care about changes to the tab or tab panel
                const tagName = (target as HTMLElement).tagName;
                return tagName === 'TS-TAB' || tagName === 'TS-TAB-PANEL';
            });

            if (instanceMutations.length === 0) {
                return;
            }

            // Update aria labels when the DOM changes
            if (instanceMutations.some(m => !['aria-labelledby', 'aria-controls'].includes(m.attributeName!))) {
                this.setAriaLabels();
            }

            // Sync tabs when disabled states change
            if (instanceMutations.some(m => m.attributeName === 'disabled')) {
                this.syncTabsAndPanels();
                // sync tabs when active state on tab changes
            } else if (instanceMutations.some(m => m.attributeName === 'active')) {
                const tabs = instanceMutations
                    .filter(
                        m =>
                            m.attributeName === 'active' &&
                            (m.target as HTMLElement).tagName.toLowerCase() === 'ts-tab',
                    )
                    .map(m => m.target as TsTab);
                const newActiveTab = tabs.find(tab => tab.active);

                if (newActiveTab) {
                    this.setActiveTab(newActiveTab);
                }
            }
        });

        // After the first update...
        this.updateComplete.then(() => {
            this.syncTabsAndPanels();

            this.mutationObserver.observe(this, {
                attributes: true,
                attributeFilter: ['active', 'disabled', 'name', 'panel'],
                childList: true,
                subtree: true,
            });

            this.resizeObserver.observe(this.nav);

            // Wait for tabs and tab panels to be registered
            whenAllDefined.then(() => {
                // Set initial tab state when the tabs become visible
                const intersectionObserver = new IntersectionObserver((entries, observer) => {
                    if (entries[0]!.intersectionRatio > 0) {
                        this.setAriaLabels();
                        this.setActiveTab(this.getActiveTab() ?? this.tabs[0]!, {
                            emitEvents: false,
                        });
                        observer.unobserve(entries[0]!.target);
                    }
                });
                intersectionObserver.observe(this.tabGroup);
            });
        });
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.mutationObserver?.disconnect();

        if (this.nav) {
            this.resizeObserver?.unobserve(this.nav);
        }
    }

    private getAllTabs() {
        const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="nav"]')!;

        return slot.assignedElements() as TsTab[];
    }

    private getAllPanels() {
        return [...this.body.assignedElements()].filter(el => el.tagName === 'TS-TAB-PANEL') as [TsTabPanel];
    }

    private getActiveTab() {
        return this.tabs.find(el => el.active);
    }

    private handleClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const tab: TsTab = target.closest('ts-tab')!;
        const tabGroup = tab?.closest('ts-tab-group');

        // Ensure the target tab is in this tab group
        if (tabGroup !== this) {
            return;
        }

        if (tab !== null) {
            this.setActiveTab(tab, { scrollBehavior: 'smooth' });
        }
    }

    private handleClose(event: Event) {
        const target = event.target as TsTab;
        const tab: TsTab = target.closest('ts-tab')!;
        const tabGroup = tab?.closest('ts-tab-group');

        // Ensure the target tab is in this tab group
        if (tabGroup !== this) {
            return;
        }

        // If the closing tab is active, activate an adjacent tab
        if (tab.active) {
            // Try to activate the next tab, or the previous one if there's no next tab
            const currentIndex = this.tabs.indexOf(tab);
            let nextTab: TsTab | undefined;

            // Try next non-disabled tab
            for (let i = currentIndex + 1; i < this.tabs.length; i++) {
                if (!this.tabs[i]!.disabled && this.tabs[i] !== tab) {
                    nextTab = this.tabs[i];
                    break;
                }
            }

            // If no next tab, try previous non-disabled tab
            if (!nextTab) {
                for (let i = currentIndex - 1; i >= 0; i--) {
                    if (!this.tabs[i]!.disabled && this.tabs[i] !== tab) {
                        nextTab = this.tabs[i];
                        break;
                    }
                }
            }

            // Activate the next tab before removing the current one
            if (nextTab) {
                this.setActiveTab(nextTab, { scrollBehavior: 'smooth' });
            }
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        const tab: TsTab = target.closest('ts-tab')!;
        const tabGroup = tab?.closest('ts-tab-group');

        // Ensure the target tab is in this tab group
        if (tabGroup !== this) {
            return;
        }

        // Activate a tab
        if (['Enter', ' '].includes(event.key)) {
            if (tab !== null) {
                this.setActiveTab(tab, { scrollBehavior: 'smooth' });
                event.preventDefault();
            }
        }

        // Move focus left or right
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            const activeEl = this.tabs.find(t => t.matches(':focus'));
            const isRtl = this.localize.dir() === 'rtl';
            let nextTab: TsTab | undefined | null = null;

            if (activeEl?.tagName === 'TS-TAB') {
                if (event.key === 'Home') {
                    nextTab = this.focusableTabs[0];
                } else if (event.key === 'End') {
                    nextTab = this.focusableTabs[this.focusableTabs.length - 1];
                } else if (
                    (['top', 'bottom'].includes(this.placement) &&
                        event.key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) ||
                    (['start', 'end'].includes(this.placement) && event.key === 'ArrowUp')
                ) {
                    const currentIndex = this.tabs.findIndex(el => el === activeEl);
                    nextTab = this.findNextFocusableTab(currentIndex, 'backward');
                } else if (
                    (['top', 'bottom'].includes(this.placement) &&
                        event.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) ||
                    (['start', 'end'].includes(this.placement) && event.key === 'ArrowDown')
                ) {
                    const currentIndex = this.tabs.findIndex(el => el === activeEl);
                    nextTab = this.findNextFocusableTab(currentIndex, 'forward');
                }

                if (!nextTab) {
                    return;
                }

                nextTab.tabIndex = 0;
                nextTab.focus({ preventScroll: true });

                if (this.activation === 'auto') {
                    this.setActiveTab(nextTab, { scrollBehavior: 'smooth' });
                } else {
                    this.tabs.forEach(tabEl => {
                        tabEl.tabIndex = tabEl === nextTab ? 0 : -1;
                    });
                }

                if (['top', 'bottom'].includes(this.placement)) {
                    scrollIntoView(nextTab, this.nav, 'horizontal');
                }

                event.preventDefault();
            }
        }
    }

    private handleScrollToStart() {
        this.nav.scroll({
            left:
                this.localize.dir() === 'rtl'
                    ? this.nav.scrollLeft + this.nav.clientWidth
                    : this.nav.scrollLeft - this.nav.clientWidth,
            behavior: 'smooth',
        });
    }

    private handleScrollToEnd() {
        this.nav.scroll({
            left:
                this.localize.dir() === 'rtl'
                    ? this.nav.scrollLeft - this.nav.clientWidth
                    : this.nav.scrollLeft + this.nav.clientWidth,
            behavior: 'smooth',
        });
    }

    private setActiveTab(tab: TsTab, options?: { emitEvents?: boolean; scrollBehavior?: 'auto' | 'smooth' }) {
        options = {
            emitEvents: true,
            scrollBehavior: 'auto',
            ...options,
        };

        if (tab !== this.activeTab && !tab.disabled) {
            const previousTab = this.activeTab;
            this.activeTab = tab;

            // Sync active tab and panel
            this.tabs.forEach(el => {
                el.active = el === this.activeTab;
                el.tabIndex = el === this.activeTab ? 0 : -1;
            });
            this.panels.forEach(el => (el.active = el.name === this.activeTab?.panel));
            this.syncIndicator();

            if (['top', 'bottom'].includes(this.placement)) {
                scrollIntoView(this.activeTab, this.nav, 'horizontal', options.scrollBehavior);
            }

            // Emit events
            if (options.emitEvents) {
                if (previousTab) {
                    this.emit('ts-tab-hide', { detail: { name: previousTab.panel } });
                }

                this.emit('ts-tab-show', { detail: { name: this.activeTab.panel } });
            }
        }
    }

    private setAriaLabels() {
        // Link each tab with its corresponding panel
        this.tabs.forEach(tab => {
            const panel = this.panels.find(el => el.name === tab.panel);
            if (panel) {
                tab.setAttribute('aria-controls', panel.getAttribute('id')!);
                panel.setAttribute('aria-labelledby', tab.getAttribute('id')!);
            }
        });
    }

    private repositionIndicator() {
        const currentTab = this.getActiveTab();

        if (!currentTab) {
            return;
        }

        const width = currentTab.clientWidth;
        const height = currentTab.clientHeight;
        const isRtl = this.localize.dir() === 'rtl';

        // We can't used offsetLeft/offsetTop here due to a shadow parent issue where neither can getBoundingClientRect
        // because it provides invalid values for animating elements: https://bugs.chromium.org/p/chromium/issues/detail?id=920069
        const allTabs = this.getAllTabs();
        const precedingTabs = allTabs.slice(0, allTabs.indexOf(currentTab));
        const offset = precedingTabs.reduce(
            (previous, current) => ({
                left: previous.left + current.clientWidth,
                top: previous.top + current.clientHeight,
            }),
            { left: 0, top: 0 },
        );

        switch (this.placement) {
            case 'top':
            case 'bottom':
                this.indicator.style.width = `${width}px`;
                this.indicator.style.height = '0';
                this.indicator.style.translate = isRtl ? `${-1 * offset.left}px` : `${offset.left}px`;
                break;

            case 'start':
            case 'end':
                this.indicator.style.width = '0';
                this.indicator.style.height = `${height}px`;
                this.indicator.style.translate = `0 ${offset.top}px`;
                break;
        }
    }

    // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
    private syncTabsAndPanels() {
        this.tabs = this.getAllTabs();
        this.focusableTabs = this.tabs.filter(el => !el.disabled);

        this.panels = this.getAllPanels();
        this.syncIndicator();
        this.updateTabPlacements();

        // After updating, show or hide scroll controls as needed
        this.updateComplete.then(() => this.updateScrollControls());
    }

    private findNextFocusableTab(currentIndex: number, direction: 'forward' | 'backward') {
        let nextTab = null;
        const iterator = direction === 'forward' ? 1 : -1;
        let nextIndex = currentIndex + iterator;

        while (currentIndex < this.tabs.length) {
            nextTab = this.tabs[nextIndex] || null;

            if (nextTab === null) {
                // This is where wrapping happens. If we're moving forward and get to the end,
                // then we jump to the beginning. If we're moving backward and get to the start, then we jump to the end
                if (direction === 'forward') {
                    nextTab = this.focusableTabs[0];
                } else {
                    nextTab = this.focusableTabs[this.focusableTabs.length - 1];
                }
                break;
            }

            if (!nextTab.disabled) {
                break;
            }

            nextIndex += iterator;
        }

        return nextTab;
    }

    /**
     * The reality of the browser means that we can't expect the scroll position to be exactly what we want it to be, so
     * we add one pixel of wiggle room to our calculations.
     */
    private scrollOffset = 1;

    @eventOptions({ passive: true })
    private updateScrollButtons() {
        if (this.hasScrollControls && !this.fixedScrollControls) {
            const hideStart = this.scrollFromStart() <= this.scrollOffset;
            const hideEnd = this.isScrolledToEnd();
            // Only assign (and thus trigger re-render) when value actually changes
            if (hideStart !== this.shouldHideScrollStartButton) this.shouldHideScrollStartButton = hideStart;
            if (hideEnd !== this.shouldHideScrollEndButton) this.shouldHideScrollEndButton = hideEnd;
        }
    }

    private isScrolledToEnd() {
        return this.scrollFromStart() + this.nav.clientWidth >= this.nav.scrollWidth - this.scrollOffset;
    }

    private scrollFromStart() {
        return this.localize.dir() === 'rtl' ? -this.nav.scrollLeft : this.nav.scrollLeft;
    }

    @watch('noScrollControls', { waitUntilFirstUpdate: true })
    updateScrollControls() {
        const next =
            !this.noScrollControls &&
            ['top', 'bottom'].includes(this.placement) &&
            this.nav.scrollWidth > this.nav.clientWidth + 1;

        if (next !== this.hasScrollControls) {
            this.hasScrollControls = next;
        }

        this.updateScrollButtons();
    }

    @watch('placement', { waitUntilFirstUpdate: true })
    handlePlacementChange() {
        this.syncIndicator();
        this.updateScrollControls();
        this.updateTabPlacements();
    }

    syncIndicator() {
        const tab = this.getActiveTab();

        if (tab) {
            this.indicator.style.display = 'block';
            this.repositionIndicator();
        } else {
            this.indicator.style.display = 'none';
        }
    }

    private updateTabPlacements() {
        this.tabs.forEach(tab => {
            tab.placement = this.placement;
        });
    }

    /** Shows the specified tab panel. */
    show(panel: string) {
        const tab = this.tabs.find(el => el.panel === panel);

        if (tab) {
            this.setActiveTab(tab, { scrollBehavior: 'smooth' });
        }
    }

    override render() {
        const isRtl = this.localize.dir() === 'rtl';

        return html`
            <div
                part="base"
                class=${classMap({
                    'tab-group': true,
                    'tab-group--top': this.placement === 'top',
                    'tab-group--bottom': this.placement === 'bottom',
                    'tab-group--start': this.placement === 'start',
                    'tab-group--end': this.placement === 'end',
                    'tab-group--rtl': this.localize.dir() === 'rtl',
                    'tab-group--has-scroll-controls': this.hasScrollControls,
                })}
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
                @ts-close=${this.handleClose}
            >
                <div class="tab-group__nav-container" part="nav">
                    ${
                        this.hasScrollControls
                            ? html`
                                  <ts-icon-button
                                      part="scroll-button scroll-button--start"
                                      exportparts="base:scroll-button__base"
                                      class=${classMap({
                                          'tab-group__scroll-button': true,
                                          'tab-group__scroll-button--start': true,
                                          'tab-group__scroll-button--start--hidden': this.shouldHideScrollStartButton,
                                      })}
                                      name=${isRtl ? 'arrow_forward_ios' : 'arrow_back_ios'}
                                      library="system"
                                      tabindex=${this.shouldHideScrollStartButton ? '-1' : '0'}
                                      aria-hidden=${this.shouldHideScrollStartButton ? 'true' : 'false'}
                                      label=${this.localize.term('scrollToStart')}
                                      @click=${this.handleScrollToStart}
                                  />
                              `
                            : ''
                    }

                    <div class="tab-group__nav" @scrollend=${this.updateScrollButtons}>
                        <div part="tabs" class="tab-group__tabs" role="tablist">
                            <div part="active-tab-indicator" class="tab-group__indicator"></div>
                            <ts-resize-observer @ts-resize=${this.syncIndicator}>
                                <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
                            </ts-resize-observer>
                        </div>
                    </div>

                    ${
                        this.hasScrollControls
                            ? html`
                                  <ts-icon-button
                                      part="scroll-button scroll-button--end"
                                      exportparts="base:scroll-button__base"
                                      class=${classMap({
                                          'tab-group__scroll-button': true,
                                          'tab-group__scroll-button--end': true,
                                          'tab-group__scroll-button--end--hidden': this.shouldHideScrollEndButton,
                                      })}
                                      name=${isRtl ? 'arrow_back_ios' : 'arrow_forward_ios'}
                                      library="system"
                                      tabindex=${this.shouldHideScrollEndButton ? '-1' : '0'}
                                      aria-hidden=${this.shouldHideScrollEndButton ? 'true' : 'false'}
                                      label=${this.localize.term('scrollToEnd')}
                                      @click=${this.handleScrollToEnd}
                                  />
                              `
                            : ''
                    }
                </div>

                <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
        `;
    }
}
