import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
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
import { TsSpinner } from '@components/spinner/index.js';

import styles from './TsToastStyle.js';

export default class TsToastComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton, 'ts-spinner': TsSpinner };

    private static stackSelectors = new Map<string, HTMLElement>();

    private autoHideTimeout!: number;
    private remainingTimeInterval!: number;

    private readonly hasSlotController = new HasSlotController(this, 'icon', 'title', 'description');
    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('[part~="base"]') base!: HTMLElement;

    @property({ type: Boolean, reflect: true }) open = false;
    @property({ type: Boolean, reflect: true }) closable = false;
    @property({ type: Boolean, reflect: true }) loading = false;

    @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary';

    @property({ type: Number, reflect: true }) duration = Infinity;

    @property({ reflect: true })
    placement: 'inline' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' =
        'top-right';

    @state() private remainingTime = this.duration;

    override firstUpdated() {
        this.base.hidden = !this.open;
    }

    private getStackSelector(placement: Exclude<TsToastComponent['placement'], 'inline'>) {
        return `ts-toast-stack-${placement}`;
    }

    private getToastDistance() {
        const v = getComputedStyle(this).getPropertyValue('--toast-distance').trim();
        return v || '20px';
    }

    private applyStackStyle(stack: HTMLElement, placement: Exclude<TsToastComponent['placement'], 'inline'>) {
        const dist = this.getToastDistance();

        stack.style.position = 'fixed';
        stack.style.zIndex = 'var(--ts-semantic-distance-zindex-toast, 1000)';
        stack.style.pointerEvents = 'none';
        stack.style.display = 'flex';
        stack.style.flexDirection = 'column';
        stack.style.gap = 'var(--ts-semantic-size-space-300, 12px)';
        stack.style.maxWidth = 'calc(100vw - 2 * ' + dist + ')';

        stack.style.top = '';
        stack.style.bottom = '';
        stack.style.left = '';
        stack.style.right = '';
        stack.style.transform = '';

        if (placement.startsWith('top')) stack.style.top = dist;
        if (placement.startsWith('bottom')) stack.style.bottom = dist;

        if (placement.endsWith('right')) stack.style.right = dist;
        if (placement.endsWith('left')) stack.style.left = dist;

        if (placement.endsWith('center')) {
            stack.style.left = '50%';
            stack.style.transform = 'translateX(-50%)';
        }
    }

    private getOrCreateStack(placement: Exclude<TsToastComponent['placement'], 'inline'>) {
        const key = this.getStackSelector(placement);
        const cached = TsToastComponent.stackSelectors.get(key);
        if (cached && document.contains(cached)) {
            this.applyStackStyle(cached, placement);
            return cached;
        }

        const stack = document.createElement('div');
        stack.setAttribute('data-ts-toast-stack', placement);
        stack.className = `ts-toast-stack ts-toast-stack--${placement}`;
        this.applyStackStyle(stack, placement);

        document.body.appendChild(stack);
        TsToastComponent.stackSelectors.set(key, stack);
        return stack;
    }

    private async mountToStackIfNeeded() {
        if (this.placement === 'inline') return;

        const stack = this.getOrCreateStack(this.placement);
        if (this.parentElement !== stack) {
            stack.appendChild(this);
            await this.updateComplete;
        }
    }

    private restartAutoHide() {
        clearTimeout(this.autoHideTimeout);
        clearInterval(this.remainingTimeInterval);

        const shouldAutoHide = this.open && !this.loading && this.duration < Infinity;

        if (shouldAutoHide) {
            this.remainingTime = this.duration;

            this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration);
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime = Math.max(0, this.remainingTime - 100);
            }, 100);
        }
    }

    private pauseAutoHide = () => {
        clearTimeout(this.autoHideTimeout);
        clearInterval(this.remainingTimeInterval);
    };

    private resumeAutoHide = () => {
        if (this.loading) return;
        if (this.duration < Infinity && this.open && this.remainingTime > 0) {
            this.autoHideTimeout = window.setTimeout(() => this.hide(), this.remainingTime);
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime = Math.max(0, this.remainingTime - 100);
            }, 100);
        }
    };

    private handleCloseClick() {
        if (this.loading) return;
        this.hide();
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            await this.mountToStackIfNeeded();

            this.emit('ts-show', { bubbles: false });

            await stopAnimations(this.base);
            this.base.hidden = false;

            this.restartAutoHide();

            const { keyframes, options } = getAnimation(this, 'toast.show', { dir: this.localize.dir() });
            await animateTo(this.base, keyframes, options);

            this.emit('ts-after-show', { bubbles: false });
        } else {
            blurActiveElement(this);

            this.emit('ts-hide', { bubbles: false });
            this.emit('ts-close', { bubbles: false });

            clearTimeout(this.autoHideTimeout);
            clearInterval(this.remainingTimeInterval);

            await stopAnimations(this.base);

            const { keyframes, options } = getAnimation(this, 'toast.hide', { dir: this.localize.dir() });
            await animateTo(this.base, keyframes, options);

            this.base.hidden = true;
            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    @watch('duration')
    handleDurationChange() {
        this.restartAutoHide();
    }

    @watch('loading')
    handleLoadingChange() {
        this.restartAutoHide();
    }

    @watch('placement')
    async handlePlacementChange() {
        if (this.open) await this.mountToStackIfNeeded();
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
                    toast: true,
                    'toast--open': this.open,
                    'toast--closable': this.closable,
                    'toast--loading': this.loading,
                    'toast--has-icon': this.hasSlotController.test('icon') || this.loading,
                    'toast--primary': this.variant === 'primary',
                    'toast--success': this.variant === 'success',
                    'toast--neutral': this.variant === 'neutral',
                    'toast--warning': this.variant === 'warning',
                    'toast--danger': this.variant === 'danger',
                })}
                role="status"
                aria-hidden=${this.open ? 'false' : 'true'}
                aria-busy=${this.loading ? 'true' : 'false'}
                @mouseenter=${this.pauseAutoHide}
                @mouseleave=${this.resumeAutoHide}
            >
                ${
                    this.loading
                        ? html`<div part="icon" class="toast__icon toast__icon--spinner">
                              <ts-spinner style="font-size: 20px;--track-width: 2px;"></ts-spinner>
                          </div>`
                        : html`<div part="icon" class="toast__icon"><slot name="icon"></slot></div>`
                }

                <div part="message" class="toast__message" aria-live="polite">
                    <slot></slot>
                </div>

                ${
                    this.closable
                        ? html`
                              <ts-icon-button
                                  part="close-button"
                                  exportparts="base:close-button__base"
                                  class="toast__close-button"
                                  name="close"
                                  library="system"
                                  label=${this.localize.term('close')}
                                  ?disabled=${this.loading}
                                  @click=${this.handleCloseClick}
                              >
                              </ts-icon-button>
                          `
                        : ''
                }
            </div>
        `;
    }
}

setDefaultAnimation('toast.show', {
    keyframes: [
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 250, easing: 'ease' },
});

setDefaultAnimation('toast.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.8 },
    ],
    options: { duration: 250, easing: 'ease' },
});
