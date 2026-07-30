import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import { animateTo, stopAnimations } from '@utils/internal/animate.js';
import { getAnimation, setDefaultAnimation } from '@utils/internal/animation-registry.js';
import { blurActiveElement } from '@utils/internal/closeActiveElement.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { LocalizeController } from '@utils/internal/localize.js';
import Modal from '@utils/internal/modal.js';
import { lockBodyScrolling, unlockBodyScrolling } from '@utils/internal/scroll.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { uppercaseFirstLetter } from '@utils/internal/string.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsDrawerStyles.js';

/**
 * @summary Drawers slide in from a container to expose additional options and information.
 * @documentation https://create.tuvsud.com/latest/components/drawer/develop-F08gCFef
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 *
 * @slot - The drawer's main content.
 * @slot label - The drawer's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<ts-icon-button>`.
 * @slot footer - The drawer's footer, usually one or more buttons representing various options.
 *
 * @event ts-show - Emitted when the drawer opens.
 * @event ts-after-show - Emitted after the drawer opens and all animations are complete.
 * @event ts-hide - Emitted when the drawer closes.
 * @event ts-after-hide - Emitted after the drawer closes and all animations are complete.
 * @event ts-initial-focus - Emitted when the drawer opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} ts-request-close - Emitted when the user attempts to
 *   close the drawer by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the drawer open. Avoid using this unless closing the drawer will result in
 *   destructive behavior such as data loss.
 *
 * @property closable - When `true` (default), the close button is shown in the header.
 * @property preventOverlayClose - When `true`, clicking the overlay will not close the drawer.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the drawer.
 * @csspart panel - The drawer's panel (where the drawer and its content are rendered).
 * @csspart header - The drawer's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<ts-icon-button>`.
 * @csspart title - The drawer's title.
 * @csspart close-button - The close button, an `<ts-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The drawer's body.
 * @csspart footer - The drawer's footer.
 *
 * @cssproperty --size - The preferred size of the drawer. This will be applied to the drawer's width or height
 *   depending on its `placement`. Note that the drawer will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation drawer.showTop - The animation to use when showing a drawer with `top` placement.
 * @animation drawer.showEnd - The animation to use when showing a drawer with `end` placement.
 * @animation drawer.showBottom - The animation to use when showing a drawer with `bottom` placement.
 * @animation drawer.showStart - The animation to use when showing a drawer with `start` placement.
 * @animation drawer.hideTop - The animation to use when hiding a drawer with `top` placement.
 * @animation drawer.hideEnd - The animation to use when hiding a drawer with `end` placement.
 * @animation drawer.hideBottom - The animation to use when hiding a drawer with `bottom` placement.
 * @animation drawer.hideStart - The animation to use when hiding a drawer with `start` placement.
 * @animation drawer.denyClose - The animation to use when a request to close the drawer is denied.
 * @animation drawer.overlay.show - The animation to use when showing the drawer's overlay.
 * @animation drawer.overlay.hide - The animation to use when hiding the drawer's overlay.
 *
 * @property modal - Exposes the internal modal utility that controls focus trapping. To temporarily disable focus
 *   trapping and allow third-party modals spawned from an active Shoelace modal, call `modal.activateExternal()` when
 *   the third-party modal opens. Upon closing, call `modal.deactivateExternal()` to restore Shoelace's focus trapping.
 */
export default class TsDrawerComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton };

    private readonly hasSlotController = new HasSlotController(this, 'footer');
    private readonly localize = new LocalizeController(this);
    private originalTrigger!: HTMLElement | null;
    public modal = new Modal(this);
    private closeWatcher!: CloseWatcher | null;
    // Cached once — avoids String.fromCharCode allocation on every render
    private static readonly ZERO_WIDTH_NBSP = String.fromCharCode(65279);
    // Cache footer slot presence — updated by slotchange; avoids querySelector on every render
    private hasFooter = false;

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('.drawer') drawer!: HTMLElement;
    @query('.drawer__panel') panel!: HTMLElement;
    @query('.drawer__overlay') overlay!: HTMLElement;

    /**
     * Indicates whether or not the drawer is open. You can toggle this attribute to show and hide the drawer,
     * or you can use the `show()` and `hide()` methods and this attribute will reflect the drawer's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /**
     * The drawer's label as displayed in the header. You should always include a relevant label even when using
     * `no-header`, as it is required for proper accessibility. If you need to display HTML,
     * use the `label` slot instead.
     */
    @property({ reflect: true }) label = '';

    /** The direction from which the drawer will open. */
    @property({ reflect: true }) placement: 'top' | 'end' | 'bottom' | 'start' = 'end';

    /**
     * By default, the drawer slides out of its containing block (usually the viewport). To make the drawer slide out of
     * its parent element, set this attribute and add `position: relative` to the parent.
     */
    @property({ type: Boolean, reflect: true }) contained = false;

    /**
     * Removes the header. This will also remove the default close button, so please ensure you provide an easy,
     * accessible way for users to dismiss the drawer.
     */
    @property({ attribute: 'no-header', type: Boolean, reflect: true }) noHeader = false;

    /** When `true`, the close button is shown in the header. When `false`, the close button is hidden. */
    @property({ type: Boolean, reflect: true }) closable = true;

    /** When `true`, clicking the overlay will not close the drawer. */
    @property({ attribute: 'prevent-overlay-close', type: Boolean, reflect: true }) preventOverlayClose = false;

    override firstUpdated() {
        this.drawer.hidden = !this.open;
        // Initialize cached footer presence
        this.hasFooter = this.hasSlotController.test('footer');

        if (this.open) {
            this.addOpenListeners();

            if (!this.contained) {
                this.modal.activate();
                lockBodyScrolling(this);
            }
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        unlockBodyScrolling(this);
        this.removeOpenListeners();
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
        const slRequestClose = this.emit('ts-request-close', {
            cancelable: true,
            detail: { source },
            bubbles: false,
        });

        if (slRequestClose.defaultPrevented) {
            const animation = getAnimation(this, 'drawer.denyClose', {
                dir: this.localize.dir(),
            });
            animateTo(this.panel, animation.keyframes, animation.options);
            return;
        }

        this.hide();
    }

    private addOpenListeners() {
        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy();
            if (!this.contained) {
                this.closeWatcher = new CloseWatcher();
                this.closeWatcher.onclose = () => this.requestClose('keyboard');
            }
        } else {
            document.addEventListener('keydown', this.handleDocumentKeyDown);
        }
    }

    private removeOpenListeners() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
        this.closeWatcher?.destroy();
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        // Contained drawers aren't modal and don't response to the escape key
        if (this.contained) {
            return;
        }

        if (event.key === 'Escape' && this.modal.isActive() && this.open) {
            event.stopImmediatePropagation();
            this.requestClose('keyboard');
        }
    };

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            // Show
            this.emit('ts-show', { bubbles: false });
            this.addOpenListeners();
            this.originalTrigger = document.activeElement as HTMLElement;

            // Lock body scrolling only if the drawer isn't contained
            if (!this.contained) {
                this.modal.activate();
                lockBodyScrolling(this);
            }

            // When the drawer is shown, Safari will attempt to set focus on whatever element has autofocus.
            // This causes the drawer's animation to jitter, so we'll temporarily remove the attribute,
            // call `focus({ preventScroll: true })` ourselves, and add the attribute back afterwards.
            //
            //
            const autoFocusTarget = this.querySelector('[autofocus]');
            if (autoFocusTarget) {
                autoFocusTarget.removeAttribute('autofocus');
            }

            await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
            this.drawer.hidden = false;

            // Set initial focus
            requestAnimationFrame(() => {
                const slInitialFocus = this.emit('ts-initial-focus', {
                    cancelable: true,
                    bubbles: false,
                });

                if (!slInitialFocus.defaultPrevented) {
                    // Set focus to the autofocus target and restore the attribute
                    if (autoFocusTarget) {
                        (autoFocusTarget as HTMLInputElement).focus({
                            preventScroll: true,
                        });
                    } else {
                        this.panel.focus({ preventScroll: true });
                    }
                }

                // Restore the autofocus attribute
                if (autoFocusTarget) {
                    autoFocusTarget.setAttribute('autofocus', '');
                }
            });

            const panelAnimation = getAnimation(this, `drawer.show${uppercaseFirstLetter(this.placement)}`, {
                dir: this.localize.dir(),
            });
            const overlayAnimation = getAnimation(this, 'drawer.overlay.show', {
                dir: this.localize.dir(),
            });
            await Promise.all([
                animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
                animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options),
            ]);

            this.emit('ts-after-show', { bubbles: false });
        } else {
            // Hide
            blurActiveElement(this);
            this.emit('ts-hide', { bubbles: false });
            this.removeOpenListeners();

            if (!this.contained) {
                this.modal.deactivate();
                unlockBodyScrolling(this);
            }

            await Promise.all([stopAnimations(this.drawer), stopAnimations(this.overlay)]);
            const panelAnimation = getAnimation(this, `drawer.hide${uppercaseFirstLetter(this.placement)}`, {
                dir: this.localize.dir(),
            });
            const overlayAnimation = getAnimation(this, 'drawer.overlay.hide', {
                dir: this.localize.dir(),
            });

            // Animate the overlay and the panel at the same time. Because animation durations might be different,
            // we need to hide each one individually when the animation finishes, otherwise the first one that finishes
            // will reappear unexpectedly. We'll unhide them after all animations have completed.
            await Promise.all([
                animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options).then(() => {
                    this.overlay.hidden = true;
                }),
                animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options).then(() => {
                    this.panel.hidden = true;
                }),
            ]);

            this.drawer.hidden = true;

            // Now that the dialog is hidden, restore the overlay and panel for next time
            this.overlay.hidden = false;
            this.panel.hidden = false;

            // Restore focus to the original trigger
            const trigger = this.originalTrigger;
            if (typeof trigger?.focus === 'function') {
                setTimeout(() => trigger.focus());
            }

            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    @watch('contained', { waitUntilFirstUpdate: true })
    handleNoModalChange() {
        if (this.open && !this.contained) {
            this.modal.activate();
            lockBodyScrolling(this);
        }

        if (this.open && this.contained) {
            this.modal.deactivate();
            unlockBodyScrolling(this);
        }
    }

    /** Shows the drawer. */
    async show() {
        if (this.open) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    /** Hides the drawer */
    async hide() {
        if (!this.open) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    private handleFooterSlotChange() {
        const next = this.hasSlotController.test('footer');
        if (next !== this.hasFooter) {
            this.hasFooter = next;
            this.requestUpdate();
        }
    }

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    drawer: true,
                    'drawer--open': this.open,
                    'drawer--top': this.placement === 'top',
                    'drawer--end': this.placement === 'end',
                    'drawer--bottom': this.placement === 'bottom',
                    'drawer--start': this.placement === 'start',
                    'drawer--contained': this.contained,
                    'drawer--fixed': !this.contained,
                    'drawer--rtl': this.localize.dir() === 'rtl',
                    'drawer--has-footer': this.hasFooter,
                })}
            >
                <div
                    part="overlay"
                    class="drawer__overlay"
                    @click=${() => {
                        if (this.preventOverlayClose) return;
                        this.requestClose('overlay');
                    }}
                    tabindex="-1"
                ></div>

                <div
                    part="panel"
                    class="drawer__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-hidden=${this.open ? 'false' : 'true'}
                    aria-label=${ifDefined(this.noHeader ? this.label : undefined)}
                    aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
                    tabindex="0"
                >
                    ${
                        !this.noHeader
                            ? html`
                                  <header part="header" class="drawer__header">
                                      <h2 part="title" class="drawer__title" id="title">
                                          <!-- If there's no label, use an invisible character to prevent 
                                        the header from collapsing -->
                                          <slot name="label">
                                              ${this.label.length > 0 ? this.label : TsDrawerComponent.ZERO_WIDTH_NBSP}
                                          </slot>
                                      </h2>
                                      <div part="header-actions" class="drawer__header-actions">
                                          <slot name="header-actions"></slot>
                                          ${
                                              this.closable
                                                  ? html`<ts-icon-button
                                                        part="close-button"
                                                        exportparts="base:close-button__base"
                                                        class="drawer__close"
                                                        name="close"
                                                        label=${this.localize.term('close')}
                                                        library="system"
                                                        size="24"
                                                        @click=${() => this.requestClose('close-button')}
                                                    ></ts-icon-button>`
                                                  : ''
                                          }
                                      </div>
                                  </header>
                              `
                            : ''
                    }

                    <slot part="body" class="drawer__body"></slot>

                    <footer part="footer" class="drawer__footer">
                        <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
                    </footer>
                </div>
            </div>
        `;
    }
}

// Top
setDefaultAnimation('drawer.showTop', {
    keyframes: [
        { opacity: 0, translate: '0 -100%' },
        { opacity: 1, translate: '0 0' },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideTop', {
    keyframes: [
        { opacity: 1, translate: '0 0' },
        { opacity: 0, translate: '0 -100%' },
    ],
    options: { duration: 250, easing: 'ease' },
});

// End
setDefaultAnimation('drawer.showEnd', {
    keyframes: [
        { opacity: 0, translate: '100%' },
        { opacity: 1, translate: '0' },
    ],
    rtlKeyframes: [
        { opacity: 0, translate: '-100%' },
        { opacity: 1, translate: '0' },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideEnd', {
    keyframes: [
        { opacity: 1, translate: '0' },
        { opacity: 0, translate: '100%' },
    ],
    rtlKeyframes: [
        { opacity: 1, translate: '0' },
        { opacity: 0, translate: '-100%' },
    ],
    options: { duration: 250, easing: 'ease' },
});

// Bottom
setDefaultAnimation('drawer.showBottom', {
    keyframes: [
        { opacity: 0, translate: '0 100%' },
        { opacity: 1, translate: '0 0' },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideBottom', {
    keyframes: [
        { opacity: 1, translate: '0 0' },
        { opacity: 0, translate: '0 100%' },
    ],
    options: { duration: 250, easing: 'ease' },
});

// Start
setDefaultAnimation('drawer.showStart', {
    keyframes: [
        { opacity: 0, translate: '-100%' },
        { opacity: 1, translate: '0' },
    ],
    rtlKeyframes: [
        { opacity: 0, translate: '100%' },
        { opacity: 1, translate: '0' },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('drawer.hideStart', {
    keyframes: [
        { opacity: 1, translate: '0' },
        { opacity: 0, translate: '-100%' },
    ],
    rtlKeyframes: [
        { opacity: 1, translate: '0' },
        { opacity: 0, translate: '100%' },
    ],
    options: { duration: 250, easing: 'ease' },
});

// Deny close
setDefaultAnimation('drawer.denyClose', {
    keyframes: [{ scale: 1 }, { scale: 1.01 }, { scale: 1 }],
    options: { duration: 250 },
});

// Overlay
setDefaultAnimation('drawer.overlay.show', {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 250 },
});

setDefaultAnimation('drawer.overlay.hide', {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 250 },
});
