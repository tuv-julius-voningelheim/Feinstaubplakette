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
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';
import { TsTooltip } from '@components/tooltip/index.js';

import styles from './TsDialogStyles.js';

/**
 * @summary Dialogs, sometimes called "modals", appear above the page and require the user's immediate attention.
 * @documentation https://create.tuvsud.com/latest/components/dialog/develop-B9UBTKGu
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 * @dependency ts-tooltip
 *
 * @slot - The dialog's main content.
 * @slot label - The dialog's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<ts-icon-button>`.
 * @slot footer - The dialog's footer, usually one or more buttons representing various options.
 *
 * @event ts-show - Emitted when the dialog opens.
 * @event ts-after-show - Emitted after the dialog opens and all animations are complete.
 * @event ts-hide - Emitted when the dialog closes.
 * @event ts-after-hide - Emitted after the dialog closes and all animations are complete.
 * @event ts-initial-focus - Emitted when the dialog opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} ts-request-close - Emitted when the user attempts to
 *   close the dialog by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the dialog open. Avoid using this unless closing the dialog will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the dialog.
 * @csspart panel - The dialog's panel (where the dialog and its content are rendered).
 * @csspart header - The dialog's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<ts-icon-button>`.
 * @csspart title - The dialog's title.
 * @csspart close-button - The close button, an `<ts-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The dialog's body.
 * @csspart footer - The dialog's footer.
 *
 * @csspart overlay - Omitted when `without-modal` is set.
 *
 * @cssproperty --width - The preferred width of the dialog. Note that the dialog will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation dialog.show - The animation to use when showing the dialog.
 * @animation dialog.hide - The animation to use when hiding the dialog.
 * @animation dialog.denyClose - The animation to use when a request to close the dialog is denied.
 * @animation dialog.overlay.show - The animation to use when showing the dialog's overlay.
 * @animation dialog.overlay.hide - The animation to use when hiding the dialog's overlay.
 *
 * @property modal - Exposes the internal modal utility that controls focus trapping. To temporarily disable focus
 *   trapping and allow third-party modals spawned from an active Shoelace modal, call `modal.activateExternal()` when
 *   the third-party modal opens. Upon closing, call `modal.deactivateExternal()` to restore Shoelace's focus trapping.
 */
export default class TsDialogComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton, 'ts-tooltip': TsTooltip };

    private readonly hasSlotController = new HasSlotController(this, 'footer');
    private readonly hasHeaderActionsSlot = new HasSlotController(this, 'header-actions');
    private readonly localize = new LocalizeController(this);
    private originalTrigger!: HTMLElement | null;
    public modal = new Modal(this);
    private closeWatcher!: CloseWatcher | null;
    private readonly titleId = `title-${Math.random().toString(36).slice(2, 9)}`;
    private static readonly ZERO_WIDTH_NBSP = String.fromCharCode(65279);

    // Cache slot presence — avoids querySelector on every render
    private hasFooterSlot = false;
    private hasHeaderActionsSlotPresent = false;

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('.dialog') dialog!: HTMLElement;
    @query('.dialog__panel') panel!: HTMLElement;
    @query('.dialog__overlay') overlay!: HTMLElement;

    /** When `true`, the dialog is shown. */
    @property({ type: Boolean, reflect: true }) open = false;

    /** The dialog's accessible label. Required when `no-header` is set. */
    @property({ reflect: true }) label = '';

    /** When `true`, the dialog header (including the title and close button) is hidden. */
    @property({ attribute: 'no-header', type: Boolean, reflect: true }) noHeader = false;

    /** The dialog's width. Accepts any valid CSS width value (e.g., `500px`, `50%`, `auto`). */
    @property({ reflect: true }) width?: string;

    /** When `true`, padding is removed from the dialog body. */
    @property({ attribute: 'no-body-padding', type: Boolean, reflect: true }) noBodyPadding = false;

    /** When `true`, clicking the overlay will not close the dialog. */
    @property({ attribute: 'prevent-overlay-close', type: Boolean, reflect: true }) preventOverlayClose = false;

    /** When `true`, the close button is shown. When `false`, the close button is hidden. */
    @property({ type: Boolean, reflect: true }) closable = true;

    /** The title text for the close button (shown on hover). */
    @property({ attribute: 'close-title', reflect: true }) closeTitle = '';

    /**
     * When `true`, the dialog opens without modal behaviour: the overlay is hidden,
     * focus is not trapped, and body scrolling is not locked, so the user can still
     * interact with content behind the dialog.
     */
    @property({ attribute: 'without-modal', type: Boolean, reflect: true }) withoutModal = false;

    override firstUpdated() {
        this.dialog.hidden = !this.open;
        this.hasFooterSlot = this.hasSlotController.test('footer');
        this.hasHeaderActionsSlotPresent = this.hasHeaderActionsSlot.test('header-actions');
        if (this.open) {
            this.addOpenListeners();
            if (!this.withoutModal) {
                this.modal.activate();
                lockBodyScrolling(this);
            }
        }
    }

    private handleFooterSlotChange() {
        const next = this.hasSlotController.test('footer');
        if (next !== this.hasFooterSlot) {
            this.hasFooterSlot = next;
            this.requestUpdate();
        }
    }

    private handleHeaderActionsSlotChange() {
        const next = this.hasHeaderActionsSlot.test('header-actions');
        if (next !== this.hasHeaderActionsSlotPresent) {
            this.hasHeaderActionsSlotPresent = next;
            this.requestUpdate();
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        if (!this.withoutModal) {
            this.modal.deactivate();
            unlockBodyScrolling(this);
        }
        this.removeOpenListeners();
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
        const tsRequestClose = this.emit('ts-request-close', { cancelable: true, detail: { source }, bubbles: false });
        if (tsRequestClose.defaultPrevented) {
            const animation = getAnimation(this, 'dialog.denyClose', { dir: this.localize.dir() });
            animateTo(this.panel, animation.keyframes, animation.options);
            return;
        }
        this.hide();
    }

    private addOpenListeners() {
        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy();
            this.closeWatcher = new CloseWatcher();
            this.closeWatcher.onclose = () => this.requestClose('keyboard');
        } else {
            document.addEventListener('keydown', this.handleDocumentKeyDown);
        }
    }

    private removeOpenListeners() {
        this.closeWatcher?.destroy();
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.modal.isActive() && this.open) {
            event.stopPropagation();
            this.requestClose('keyboard');
        }
    };

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            this.emit('ts-show', { bubbles: false });
            this.addOpenListeners();
            this.originalTrigger = document.activeElement as HTMLElement;
            if (!this.withoutModal) {
                this.modal.activate();
                lockBodyScrolling(this);
            }
            const autoFocusTarget = this.querySelector('[autofocus]');
            if (autoFocusTarget) autoFocusTarget.removeAttribute('autofocus');
            const stopPromises = [
                stopAnimations(this.dialog),
                ...(!this.withoutModal ? [stopAnimations(this.overlay)] : []),
            ];
            await Promise.all(stopPromises);
            this.dialog.hidden = false;
            requestAnimationFrame(() => {
                const slInitialFocus = this.emit('ts-initial-focus', { cancelable: true, bubbles: false });
                if (!slInitialFocus.defaultPrevented) {
                    if (autoFocusTarget) {
                        (autoFocusTarget as HTMLInputElement).focus({ preventScroll: true });
                    } else {
                        this.panel.focus({ preventScroll: true });
                    }
                }
                if (autoFocusTarget) autoFocusTarget.setAttribute('autofocus', '');
            });
            const panelAnimation = getAnimation(this, 'dialog.show', { dir: this.localize.dir() });
            const showPromises = [animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options)];
            if (!this.withoutModal) {
                const overlayAnimation = getAnimation(this, 'dialog.overlay.show', { dir: this.localize.dir() });
                showPromises.push(animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options));
            }
            await Promise.all(showPromises);
            this.emit('ts-after-show', { bubbles: false });
        } else {
            blurActiveElement(this);
            this.emit('ts-hide', { bubbles: false });
            this.removeOpenListeners();
            if (!this.withoutModal) {
                this.modal.deactivate();
            }
            const stopHidePromises = [
                stopAnimations(this.dialog),
                ...(!this.withoutModal ? [stopAnimations(this.overlay)] : []),
            ];
            await Promise.all(stopHidePromises);
            const panelAnimation = getAnimation(this, 'dialog.hide', { dir: this.localize.dir() });
            const hidePromises = [
                animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options).then(() => {
                    this.panel.hidden = true;
                }),
            ];
            if (!this.withoutModal) {
                const overlayAnimation = getAnimation(this, 'dialog.overlay.hide', { dir: this.localize.dir() });
                hidePromises.push(
                    animateTo(this.overlay, overlayAnimation.keyframes, overlayAnimation.options).then(() => {
                        this.overlay.hidden = true;
                    }),
                );
            }
            await Promise.all(hidePromises);
            this.dialog.hidden = true;
            if (!this.withoutModal) {
                this.overlay.hidden = false;
                unlockBodyScrolling(this);
            }
            this.panel.hidden = false;
            const trigger = this.originalTrigger;
            if (typeof trigger?.focus === 'function') setTimeout(() => trigger.focus());
            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    async show() {
        if (this.open) return undefined;
        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    async hide() {
        if (!this.open) return undefined;
        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    dialog: true,
                    'dialog--open': this.open,
                    'dialog--has-footer': this.hasFooterSlot,
                    'dialog--without-modal': this.withoutModal,
                })}
            >
                ${
                    !this.withoutModal
                        ? html`<div
                              part="overlay"
                              class="dialog__overlay"
                              @click=${() => {
                                  if (this.preventOverlayClose) {
                                      const animation = getAnimation(this, 'dialog.denyClose', {
                                          dir: this.localize.dir(),
                                      });
                                      animateTo(this.panel, animation.keyframes, animation.options);
                                      return;
                                  }
                                  this.requestClose('overlay');
                              }}
                              tabindex="-1"
                          ></div>`
                        : ''
                }
                <div
                    part="panel"
                    class="dialog__panel"
                    role="dialog"
                    aria-modal=${this.withoutModal ? 'false' : 'true'}
                    aria-hidden=${this.open ? 'false' : 'true'}
                    aria-label=${ifDefined(this.noHeader ? this.label : undefined)}
                    aria-labelledby=${ifDefined(!this.noHeader ? this.titleId : undefined)}
                    tabindex="-1"
                    style=${ifDefined(this.width ? `--width:${this.width}` : undefined)}
                >
                    ${
                        !this.noHeader
                            ? html`
                                  <header part="header" class="dialog__header">
                                      <h2 part="title" class="dialog__title" id=${this.titleId}>
                                          <slot name="label"
                                              >${
                                                  this.label.length > 0 ? this.label : TsDialogComponent.ZERO_WIDTH_NBSP
                                              }</slot
                                          >
                                      </h2>
                                      ${
                                          this.hasHeaderActionsSlotPresent || this.closable
                                              ? html`
                                                    <div part="header-actions" class="dialog__header-actions">
                                                        <slot
                                                            name="header-actions"
                                                            @slotchange=${this.handleHeaderActionsSlotChange}
                                                        ></slot>
                                                        ${
                                                            this.closable
                                                                ? this.closeTitle
                                                                    ? html`<ts-tooltip content=${this.closeTitle}>
                                                                          <ts-icon-button
                                                                              part="close-button"
                                                                              exportparts="base:close-button__base"
                                                                              class="dialog__close"
                                                                              name="close"
                                                                              library="system"
                                                                              size="24"
                                                                              @click="${() => this.requestClose('close-button')}"
                                                                          >
                                                                          </ts-icon-button>
                                                                      </ts-tooltip>`
                                                                    : html`<ts-icon-button
                                                                          part="close-button"
                                                                          exportparts="base:close-button__base"
                                                                          class="dialog__close"
                                                                          name="close"
                                                                          label=${this.localize.term('close')}
                                                                          library="system"
                                                                          size="24"
                                                                          @click="${() => this.requestClose('close-button')}"
                                                                      >
                                                                      </ts-icon-button>`
                                                                : ''
                                                        }
                                                    </div>
                                                `
                                              : ''
                                      }
                                  </header>
                              `
                            : ''
                    }
                    <div part="body" class="dialog__body" tabindex="-1">
                        <slot></slot>
                    </div>
                    <footer part="footer" class="dialog__footer">
                        <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
                    </footer>
                </div>
            </div>
        `;
    }
}

setDefaultAnimation('dialog.show', {
    keyframes: [
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 250, easing: 'ease' },
});
setDefaultAnimation('dialog.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.8 },
    ],
    options: { duration: 250, easing: 'ease' },
});
setDefaultAnimation('dialog.denyClose', {
    keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }],
    options: { duration: 250 },
});
setDefaultAnimation('dialog.overlay.show', { keyframes: [{ opacity: 0 }, { opacity: 1 }], options: { duration: 250 } });
setDefaultAnimation('dialog.overlay.hide', { keyframes: [{ opacity: 1 }, { opacity: 0 }], options: { duration: 250 } });
