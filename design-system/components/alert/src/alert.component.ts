import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import { animateTo, stopAnimations } from '@utils/internal/animate.js';
import { getAnimation, setDefaultAnimation } from '@utils/internal/animation-registry.js';
import { blurActiveElement } from '@utils/internal/closeActiveElement.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsAlertStyle.js';

/**
 * @summary Alerts are used to display important messages inline or as toast notifications.
 * @documentation https://create.tuvsud.com/latest/components/alert/develop-apIHPcsx
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 *
 * @slot - The alert's main content.
 * @slot icon - An icon to show in the alert. Works best with `<ts-icon>`.
 * @slot suffix - Optional content placed at the trailing edge of the alert (e.g. an action button).
 *
 * @event ts-show - Emitted when the alert opens.
 * @event ts-after-show - Emitted after the alert opens and all animations are complete.
 * @event ts-hide - Emitted when the alert closes.
 * @event ts-after-hide - Emitted after the alert closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the optional icon.
 * @csspart message - The container that wraps the alert's main content.
 * @csspart suffix - The container that wraps the optional suffix content.
 * @csspart close-button - The close button, an `<ts-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 *
 * @animation alert.show - The animation to use when showing the alert.
 * @animation alert.hide - The animation to use when hiding the alert.
 */
export default class TsAlertComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton };

    private autoHideTimeout!: number;
    private remainingTimeInterval!: number;
    private countdownAnimation?: Animation;
    private readonly hasSlotController = new HasSlotController(this, 'icon', 'suffix');
    private readonly localize = new LocalizeController(this);
    // Cache icon-slot presence to avoid querySelector on every render
    private hasIconSlot = false;

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('[part~="base"]') base!: HTMLElement;
    @query('.alert__countdown-elapsed') countdownElement!: HTMLElement;
    // Direct DOM reference for timer — avoids @state re-renders every 100ms
    @query('.alert__timer') timerElement!: HTMLElement;

    // Cache suffix-slot presence to avoid querySelector on every render
    private hasSuffixSlot = false;

    /**
     * Indicates whether or not the alert is open. You can toggle this attribute to show and hide the alert, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the alert's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /** Enables a close button that allows the user to dismiss the alert. */
    @property({ type: Boolean, reflect: true }) closable = false;

    /** The alert's theme variant. */
    @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary';

    /**
     * The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with
     * the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`,
     * meaning the alert will not close on its own.
     */
    @property({ type: Number, reflect: true }) duration = Infinity;

    /**
     * Enables a countdown that indicates the remaining time the alert will be displayed.
     * Typically used to indicate the remaining time before a whole app refresh.
     */
    @property({ type: String, reflect: true }) countdown?: 'rtl' | 'ltr';

    @property({ reflect: true }) placement: 'inline' | 'top' = 'inline';

    // Remaining time tracked as a plain field — written directly to DOM to avoid Lit re-renders every 100ms
    private remainingTime = Infinity;

    override firstUpdated() {
        this.base.hidden = !this.open;
        this.hasIconSlot = this.hasSlotController.test('icon');
        this.hasSuffixSlot = this.hasSlotController.test('suffix');
    }

    private handleIconSlotChange() {
        const next = this.hasSlotController.test('icon');
        if (next !== this.hasIconSlot) {
            this.hasIconSlot = next;
            this.requestUpdate();
        }
    }

    private handleSuffixSlotChange() {
        const next = this.hasSlotController.test('suffix');
        if (next !== this.hasSuffixSlot) {
            this.hasSuffixSlot = next;
            this.requestUpdate();
        }
    }

    private restartAutoHide() {
        this.handleCountdownChange();
        clearTimeout(this.autoHideTimeout);
        clearInterval(this.remainingTimeInterval);
        if (this.open && this.duration < Infinity) {
            this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration);
            this.remainingTime = this.duration;
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime -= 100;
                // Write directly to DOM — no Lit re-render needed for a screen-reader timer
                if (this.timerElement) {
                    this.timerElement.textContent = String(this.remainingTime);
                }
            }, 100);
        }
    }

    private pauseAutoHide() {
        this.countdownAnimation?.pause();
        clearTimeout(this.autoHideTimeout);
        clearInterval(this.remainingTimeInterval);
    }

    private resumeAutoHide() {
        if (this.duration < Infinity) {
            this.autoHideTimeout = window.setTimeout(() => this.hide(), this.remainingTime);
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime -= 100;
                if (this.timerElement) {
                    this.timerElement.textContent = String(this.remainingTime);
                }
            }, 100);
            this.countdownAnimation?.play();
        }
    }

    private handleCountdownChange() {
        if (this.open && this.duration < Infinity && this.countdown) {
            const { countdownElement } = this;
            const start = '100%';
            const end = '0';
            this.countdownAnimation = countdownElement.animate([{ width: start }, { width: end }], {
                duration: this.duration,
                easing: 'linear',
            });
        }
    }

    private handleCloseClick() {
        this.hide();
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            // Show
            this.emit('ts-show', { bubbles: true });

            if (this.duration < Infinity) {
                this.restartAutoHide();
            }

            await stopAnimations(this.base);
            this.base.hidden = false;
            const { keyframes, options } = getAnimation(this, 'alert.show', {
                dir: this.localize.dir(),
            });
            await animateTo(this.base, keyframes, options);

            this.emit('ts-after-show', { bubbles: true });
        } else {
            // Hide
            blurActiveElement(this);
            this.emit('ts-hide', { bubbles: true });

            clearTimeout(this.autoHideTimeout);
            clearInterval(this.remainingTimeInterval);

            await stopAnimations(this.base);
            const { keyframes, options } = getAnimation(this, 'alert.hide', {
                dir: this.localize.dir(),
            });
            await animateTo(this.base, keyframes, options);
            this.base.hidden = true;

            this.emit('ts-after-hide', { bubbles: true });
        }
    }

    @watch('duration')
    handleDurationChange() {
        this.restartAutoHide();
    }

    /** Shows the alert. */
    async show() {
        if (this.open) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    /** Hides the alert */
    async hide() {
        if (!this.open) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    alert: true,
                    'alert--open': this.open,
                    'alert--closable': this.closable,
                    'alert--has-countdown': !!this.countdown,
                    'alert--has-icon': this.hasIconSlot,
                    'alert--primary': this.variant === 'primary',
                    'alert--success': this.variant === 'success',
                    'alert--neutral': this.variant === 'neutral',
                    'alert--warning': this.variant === 'warning',
                    'alert--danger': this.variant === 'danger',
                })}
                role="alert"
                aria-hidden=${this.open ? 'false' : 'true'}
                @mouseenter=${this.pauseAutoHide}
                @mouseleave=${this.resumeAutoHide}
            >
                <div part="icon" class="alert__icon">
                    <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
                </div>

                <div part="message" class="alert__message" aria-live="polite">
                    <slot></slot>
                </div>

                <div part="suffix" class="alert__suffix" ?hidden=${!this.hasSuffixSlot}>
                    <slot name="suffix" @slotchange=${this.handleSuffixSlotChange}></slot>
                </div>

                ${
                    this.closable
                        ? html`
                              <div class="alert__close-button-container">
                                  <ts-icon-button
                                      part="close-button"
                                      exportparts="base:close-button__base"
                                      class="alert__close-button"
                                      name="close"
                                      library="system"
                                      size="24"
                                      label=${this.localize.term('close')}
                                      @click=${this.handleCloseClick}
                                  ></ts-icon-button>
                              </div>
                          `
                        : ''
                }

                <div role="timer" class="alert__timer">${this.duration}</div>

                ${
                    this.countdown
                        ? html`
                              <div
                                  class=${classMap({
                                      alert__countdown: true,
                                      'alert__countdown--ltr': this.countdown === 'ltr',
                                  })}
                              >
                                  <div class="alert__countdown-elapsed"></div>
                              </div>
                          `
                        : ''
                }
            </div>
        `;
    }
}

setDefaultAnimation('alert.show', {
    keyframes: [
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('alert.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.8 },
    ],
    options: { duration: 250, easing: 'ease' },
});
