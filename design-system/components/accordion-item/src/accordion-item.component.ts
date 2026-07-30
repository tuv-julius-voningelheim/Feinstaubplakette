import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import { animateTo, shimKeyframesHeightAuto, stopAnimations } from '@utils/internal/animate.js';
import { getAnimation, setDefaultAnimation } from '@utils/internal/animation-registry.js';
import ComponentElement from '@utils/internal/component-element.js';
import { waitForEvent } from '@utils/internal/event.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsAccordionItemStyle.js';

/**
 * @summary Details show a brief summary and expand to show additional content.
 * @documentation https://create.tuvsud.com/latest/components/accordion-item/develop-SgVsIhND
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot - The accordion-item' main content.
 * @slot summary - The accordion-item' summary. Alternatively, you can use the `summary` attribute.
 * @slot expand-icon - Optional expand icon to use instead of the default. Works best with `<ts-icon>`.
 * @slot collapse-icon - Optional collapse icon to use instead of the default. Works best with `<ts-icon>`.
 *
 * @event ts-show - Emitted when the accordion-item open.
 * @event ts-after-show - Emitted after the accordion-item opens and all animations are complete.
 * @event ts-hide - Emitted when the accordion-item close.
 * @event ts-after-hide - Emitted after the accordion-item closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The header that wraps both the summary and the expand/collapse icon.
 * @csspart summary - The container that wraps the summary.
 * @csspart summary-icon - The container that wraps the expand/collapse icons.
 * @csspart content - The accordion-item content.
 *
 * @animation accordion-item.show - The animation to use when showing accordion-item. You can use `height: auto` with this animation.
 * @animation accordion-item.hide - The animation to use when hiding accordion-item. You can use `height: auto` with this animation.
 */

export default class TsAccordionItem extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-icon': TsIcon,
    };

    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('.accordion-item__toggle') toggle!: HTMLButtonElement;
    @query('.accordion-item__body') body!: HTMLElement;

    @property({ type: Boolean, reflect: true }) open = false;
    @property() summary!: string;
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ reflect: true }) variant: 'primary' | 'secondary' | 'actions' = 'primary';

    @property({ type: Boolean, reflect: true, attribute: 'truncate-summary' }) truncateSummary = false;

    private get headerId() {
        const base = this.id || 'ts-accordion-item';
        return `${base}-header`;
    }

    private get contentId() {
        const base = this.id || 'ts-accordion-item';
        return `${base}-content`;
    }

    override firstUpdated() {
        this.body.style.height = this.open ? 'auto' : '0';
    }

    private handleToggleClick() {
        if (this.disabled) return;
        if (this.open) this.hide();
        else this.show();
        this.toggle.focus();
    }

    private handleToggleKeyDown(event: KeyboardEvent) {
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            this.handleToggleClick();
        }
        if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
            event.preventDefault();
            this.hide();
        }
        if (['ArrowDown', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            this.show();
        }
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            const ev = this.emit('ts-show', { cancelable: true, bubbles: false });
            if (ev.defaultPrevented) {
                this.open = false;
                return;
            }

            await stopAnimations(this.body);

            this.body.style.overflow = 'hidden';
            this.body.style.height = '0px';

            const { keyframes, options } = getAnimation(this, 'accordion.show', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);

            this.body.style.height = 'auto';
            this.body.style.overflow = '';

            this.emit('ts-after-show', { bubbles: false });
        } else {
            const ev = this.emit('ts-hide', { cancelable: true, bubbles: false });
            if (ev.defaultPrevented) {
                this.open = true;
                return;
            }

            await stopAnimations(this.body);

            this.body.style.overflow = 'hidden';
            const startHeight = this.body.scrollHeight;
            this.body.style.height = `${startHeight}px`;
            // Single getBoundingClientRect() call is sufficient to force a layout flush before animating
            this.body.getBoundingClientRect();

            const { keyframes, options } = getAnimation(this, 'accordion.hide', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, startHeight), options);

            this.body.style.height = '0px';
            this.body.style.overflow = '';

            this.emit('ts-after-hide', { bubbles: false });
        }
    }

    async show() {
        if (this.open || this.disabled) return;
        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    async hide() {
        if (!this.open || this.disabled) return;
        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    override render() {
        const isRtl = this.localize.dir() === 'rtl';
        const isActions = this.variant === 'actions';

        return html`
            <div
                part="base"
                class=${classMap({
                    'accordion-item': true,
                    'accordion-item--open': this.open,
                    'accordion-item--disabled': this.disabled,
                    'accordion-item--rtl': isRtl,
                    'accordion-item--actions': isActions,
                })}
            >
                <div
                    class=${classMap({
                        'accordion-item__header-row': true,
                    })}
                    part="header"
                >
                    <button
                        class=${classMap({
                            'accordion-item__header': true,
                            'actions-header': isActions,
                            'accordion-item__toggle': true,
                        })}
                        id=${this.headerId}
                        type="button"
                        aria-expanded=${this.open ? 'true' : 'false'}
                        aria-controls=${this.contentId}
                        ?disabled=${this.disabled}
                        @click=${this.handleToggleClick}
                        @keydown=${this.handleToggleKeyDown}
                    >
                        ${
                            isActions
                                ? html`
                                      <span part="summary-icon" class="accordion-item__summary-icon">
                                          <slot name="expand-icon">
                                              <ts-icon library="system" name="keyboard_arrow_down" size="24"></ts-icon>
                                          </slot>
                                          <slot name="collapse-icon">
                                              <ts-icon library="system" name="keyboard_arrow_down" size="24"></ts-icon>
                                          </slot>
                                      </span>
                                      <slot
                                          name="summary"
                                          part="summary"
                                          class=${classMap({
                                              'accordion-item__summary': true,
                                              'accordion-item__summary--truncate': this.truncateSummary,
                                          })}
                                      >
                                          ${this.summary}
                                      </slot>
                                  `
                                : html`
                                      <slot
                                          name="summary"
                                          part="summary"
                                          class=${classMap({
                                              'accordion-item__summary': true,
                                              'accordion-item__summary--truncate': this.truncateSummary,
                                          })}
                                      >
                                          ${this.summary}
                                      </slot>

                                      <span part="summary-icon" class="accordion-item__summary-icon">
                                          <slot name="expand-icon">
                                              <ts-icon library="system" name="keyboard_arrow_down" size="24"></ts-icon>
                                          </slot>
                                          <slot name="collapse-icon">
                                              <ts-icon library="system" name="keyboard_arrow_down" size="24"></ts-icon>
                                          </slot>
                                      </span>
                                  `
                        }
                    </button>

                    ${
                        isActions
                            ? html`
                                  <div class="accordion-item__action" part="actions">
                                      <slot name="actions"></slot>
                                  </div>
                              `
                            : null
                    }
                </div>

                <div
                    class="accordion-item__body"
                    id=${this.contentId}
                    role="region"
                    aria-labelledby=${this.headerId}
                    aria-hidden=${this.open ? 'false' : 'true'}
                    ?inert=${!this.open}
                >
                    <slot part="content" class="accordion-item__content"></slot>
                </div>
            </div>
        `;
    }
}

setDefaultAnimation('accordion.show', {
    keyframes: [
        { height: '0', opacity: '0' },
        { height: 'auto', opacity: '1' },
    ],
    options: { duration: 250, easing: 'linear' },
});

setDefaultAnimation('accordion.hide', {
    keyframes: [
        { height: 'auto', opacity: '1' },
        { height: '0', opacity: '0' },
    ],
    options: { duration: 250, easing: 'linear' },
});
