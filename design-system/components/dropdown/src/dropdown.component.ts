import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import { getDeepestActiveElement } from '@utils/internal/active-elements.js';
import { animateTo, stopAnimations } from '@utils/internal/animate.js';
import { getAnimation, setDefaultAnimation } from '@utils/internal/animation-registry.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { getTabbableBoundary } from '@utils/internal/tabbable.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';
import type { TsSelectEvent } from '@utils/events/ts-select.js';

import { TsPopup } from '@components/popup/index.js';
import type { TsButton } from '@components/button/index.js';
import type { TsIconButton } from '@components/icon-button/index.js';
import type { TsMenu } from '@components/menu/index.js';

import styles from './TsDropdownStyles.js';

/**
 * @summary Dropdowns expose additional content that "drops down" in a panel.
 * @documentation https://create.tuvsud.com/latest/components/dropdown/develop-rW4gyLIG
 * @status stable
 * @since 1.0
 *
 * @dependency ts-popup
 *
 * @slot - The dropdown's main content.
 * @slot trigger - The dropdown's trigger, usually a `<ts-button>` element.
 *
 * @event ts-show - Emitted when the dropdown opens.
 * @event ts-after-show - Emitted after the dropdown opens and all animations are complete.
 * @event ts-hide - Emitted when the dropdown closes.
 * @event ts-after-hide - Emitted after the dropdown closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper, an `<ts-popup>` element.
 * @csspart base__popup - The popup's exported `popup` part. Use this to target the tooltip's popup container.
 * @csspart trigger - The container that wraps the trigger.
 * @csspart panel - The panel that gets shown when the dropdown is open.
 *
 * @animation dropdown.show - The animation to use when showing the dropdown.
 * @animation dropdown.hide - The animation to use when hiding the dropdown.
 */
export default class TsDropdownComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-popup': TsPopup };

    @query('.dropdown') popup!: TsPopup;
    @query('.dropdown__trigger') trigger!: HTMLSlotElement;
    @query('.dropdown__panel') panel!: HTMLSlotElement;

    private readonly localize = new LocalizeController(this);
    private closeWatcher!: CloseWatcher | null;

    /**
     * Indicates whether or not the dropdown is open. You can toggle this attribute to show and hide the dropdown, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the dropdown's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel
     * inside of the viewport.
     */
    @property({ reflect: true }) placement:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'left'
        | 'left-start'
        | 'left-end' = 'bottom-start';

    /** Disables the dropdown so the panel will not open. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /**
     * By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for
     * dropdowns that allow for multiple interactions.
     */
    @property({ attribute: 'stay-open-on-select', type: Boolean, reflect: true }) stayOpenOnSelect = false;

    /**
     * The dropdown will close when the user interacts outside of this element (e.g. clicking). Useful for composing other
     * components that use a dropdown internally.
     */
    @property({ attribute: false }) containingElement?: HTMLElement;

    /** The distance in pixels from which to offset the panel away from its trigger. */
    @property({ type: Number }) distance = 0;

    /** The distance in pixels from which to offset the panel along its trigger. */
    @property({ type: Number }) skidding = 0;

    /**
     * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
     * `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.
     */
    @property({ type: Boolean }) hoist = false;

    /**
     * Syncs the popup width or height to that of the trigger element.
     */
    @property({ reflect: true }) sync: 'width' | 'height' | 'both' | undefined = undefined;

    override connectedCallback() {
        super.connectedCallback();

        if (!this.containingElement) {
            this.containingElement = this;
        }
    }

    override firstUpdated() {
        this.panel.hidden = !this.open;

        // If the dropdown is visible on init, update its position
        if (this.open) {
            this.addOpenListeners();
            this.popup.active = true;
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.removeOpenListeners();
        this.hide();
    }

    focusOnTrigger() {
        const trigger = this.trigger.assignedElements({ flatten: true })[0] as HTMLElement | undefined;
        if (typeof trigger?.focus === 'function') {
            trigger.focus();
        }
    }

    getMenu() {
        return this.panel.assignedElements({ flatten: true }).find(el => el.tagName === 'TS-MENU') as
            TsMenu | undefined;
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        // Close when escape is pressed inside an open dropdown. We need to listen on the panel itself and stop propagation
        // in case any ancestors are also listening for this key.
        if (this.open && event.key === 'Escape') {
            event.stopPropagation();
            this.hide();
            this.focusOnTrigger();
        }
    };

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        // Close when escape or tab is pressed
        if (event.key === 'Escape' && this.open && !this.closeWatcher) {
            event.stopPropagation();
            this.focusOnTrigger();
            this.hide();
            return;
        }

        // Handle tabbing
        if (event.key === 'Tab') {
            // Tabbing within an open menu should close the dropdown and refocus the trigger
            if (this.open && document.activeElement?.tagName === 'TS-MENU-ITEM') {
                event.preventDefault();
                this.hide();
                this.focusOnTrigger();
                return;
            }

            const computeClosestContaining = (element: Element | null | undefined, tagName: string): Element | null => {
                if (!element) return null;

                const closest = element.closest(tagName);
                if (closest) return closest;

                const rootNode = element.getRootNode();
                if (rootNode instanceof ShadowRoot) {
                    return computeClosestContaining(rootNode.host, tagName);
                }

                return null;
            };

            // Tabbing outside of the containing element closes the panel
            //
            // If the dropdown is used within a shadow DOM, we need to obtain the activeElement within that shadowRoot,
            // otherwise `document.activeElement` will only return the name of the parent shadow DOM element.
            setTimeout(() => {
                const activeElement =
                    this.containingElement?.getRootNode() instanceof ShadowRoot
                        ? getDeepestActiveElement()
                        : document.activeElement;

                if (
                    !this.containingElement ||
                    computeClosestContaining(activeElement, this.containingElement.tagName) !== this.containingElement
                ) {
                    this.hide();
                }
            });
        }
    };

    private handleDocumentMouseDown = (event: MouseEvent) => {
        // Close when clicking outside of the containing element
        const path = event.composedPath();
        if (this.containingElement && !path.includes(this.containingElement)) {
            this.hide();
        }
    };

    private handlePanelSelect = (event: TsSelectEvent) => {
        const target = event.target as HTMLElement;

        // Hide the dropdown when a menu item is selected
        if (!this.stayOpenOnSelect && target.tagName === 'TS-MENU') {
            this.hide();
            this.focusOnTrigger();
        }
    };

    handleTriggerClick() {
        if (this.open) {
            this.hide();
        } else {
            this.show();
            this.focusOnTrigger();
        }
    }

    async handleTriggerKeyDown(event: KeyboardEvent) {
        // When spacebar/enter is pressed, show the panel but don't focus on the menu. This let's the user press the same
        // key again to hide the menu in case they don't want to make a selection.
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault();
            this.handleTriggerClick();
            return;
        }

        const menu = this.getMenu();

        if (menu) {
            const menuItems = menu.getAllItems();
            const firstMenuItem = menuItems[0];
            const lastMenuItem = menuItems[menuItems.length - 1];

            // When up/down is pressed, we make the assumption that the user is familiar with the menu and plans to make a
            // selection. Rather than toggle the panel, we focus on the menu (if one exists) and activate the first item for
            // faster navigation.
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();

                // Show the menu if it's not already open
                if (!this.open) {
                    this.show();

                    // Wait for the dropdown to open before focusing, but not the animation
                    await this.updateComplete;
                }

                if (menuItems.length > 0) {
                    // Focus on the first/last menu item after showing
                    this.updateComplete.then(() => {
                        if (event.key === 'ArrowDown' || event.key === 'Home') {
                            menu.setCurrentItem(firstMenuItem!);
                            firstMenuItem!.focus();
                        }

                        if (event.key === 'ArrowUp' || event.key === 'End') {
                            menu.setCurrentItem(lastMenuItem!);
                            lastMenuItem!.focus();
                        }
                    });
                }
            }
        }
    }

    handleTriggerKeyUp(event: KeyboardEvent) {
        // Prevent space from triggering a click event in Firefox
        if (event.key === ' ') {
            event.preventDefault();
        }
    }

    handleTriggerSlotChange() {
        this.updateAccessibleTrigger();
    }

    //
    // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
    // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
    // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
    // a child of the slotted element, or an element in the slotted element's shadow root.
    //
    // For example, the accessible trigger of an <ts-button> is a <button> located inside its shadow root.
    //
    // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
    //
    updateAccessibleTrigger() {
        const assignedElements = this.trigger.assignedElements({ flatten: true }) as HTMLElement[];
        const accessibleTrigger = assignedElements.find(el => getTabbableBoundary(el).start);
        let target: HTMLElement;

        if (accessibleTrigger) {
            switch (accessibleTrigger.tagName) {
                // Shoelace buttons have to update the internal button so it's announced correctly by screen readers
                case 'TS-BUTTON':
                case 'TS-ICON-BUTTON':
                    target = (accessibleTrigger as TsButton | TsIconButton).button;
                    break;

                default:
                    target = accessibleTrigger;
            }

            target.setAttribute('aria-haspopup', 'true');
            target.setAttribute('aria-expanded', this.open ? 'true' : 'false');
        }
    }

    /** Shows the dropdown panel. */
    async show() {
        if (this.open) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    /** Hides the dropdown panel */
    async hide() {
        if (!this.open) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    /**
     * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
     * is activated.
     */
    reposition() {
        this.popup.reposition();
    }

    addOpenListeners() {
        this.panel.addEventListener('ts-select', this.handlePanelSelect);
        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy();
            this.closeWatcher = new CloseWatcher();
            this.closeWatcher.onclose = () => {
                this.hide();
                this.focusOnTrigger();
            };
        } else {
            this.panel.addEventListener('keydown', this.handleKeyDown);
        }
        document.addEventListener('keydown', this.handleDocumentKeyDown);
        document.addEventListener('mousedown', this.handleDocumentMouseDown);
    }

    removeOpenListeners() {
        if (this.panel) {
            this.panel.removeEventListener('ts-select', this.handlePanelSelect);
            this.panel.removeEventListener('keydown', this.handleKeyDown);
        }
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        document.removeEventListener('mousedown', this.handleDocumentMouseDown);
        this.closeWatcher?.destroy();
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.disabled) {
            this.open = false;
            return;
        }

        this.updateAccessibleTrigger();

        if (this.open) {
            // Show
            this.emit('ts-show', { bubbles: false });
            this.addOpenListeners();

            await stopAnimations(this);
            this.panel.hidden = false;
            this.popup.active = true;
            const { keyframes, options } = getAnimation(this, 'dropdown.show', { dir: this.localize.dir() });
            await animateTo(this.popup.popup, keyframes, options);

            this.emit('ts-after-show', { bubbles: false });
        } else {
            // Hide
            this.emit('ts-hide', { bubbles: false });
            this.removeOpenListeners();

            await stopAnimations(this);
            const { keyframes, options } = getAnimation(this, 'dropdown.hide', { dir: this.localize.dir() });
            await animateTo(this.popup.popup, keyframes, options);
            this.panel.hidden = true;
            this.popup.active = false;

            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    override render() {
        return html`
            <ts-popup
                part="base"
                exportparts="popup:base__popup"
                id="dropdown"
                placement=${this.placement}
                distance=${this.distance}
                skidding=${this.skidding}
                strategy=${this.hoist ? 'fixed' : 'absolute'}
                flip
                shift
                auto-size="vertical"
                auto-size-padding="10"
                content-bg-color="--ts-semantic-color-background-base-default"
                sync=${ifDefined(this.sync ? this.sync : undefined)}
                class=${classMap({
                    dropdown: true,
                    'dropdown--open': this.open,
                })}
            >
                <slot
                    name="trigger"
                    slot="anchor"
                    part="trigger"
                    class="dropdown__trigger"
                    @click=${this.handleTriggerClick}
                    @keydown=${this.handleTriggerKeyDown}
                    @keyup=${this.handleTriggerKeyUp}
                    @slotchange=${this.handleTriggerSlotChange}
                ></slot>

                <div aria-hidden=${this.open ? 'false' : 'true'} aria-labelledby="dropdown">
                    <slot part="panel" class="dropdown__panel"></slot>
                </div>
            </ts-popup>
        `;
    }
}

setDefaultAnimation('dropdown.show', {
    keyframes: [
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 100, easing: 'ease' },
});

setDefaultAnimation('dropdown.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 },
    ],
    options: { duration: 100, easing: 'ease' },
});
