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
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '../../icon/index.js';

import styles from './TsDetailsStyle.js';

/**
 * @summary Details show a brief summary and expand to show additional content.
 * @documentation https://create.tuvsud.com/latest/components/detail/develop-ljy8FmdS
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot - The details' main content.
 * @slot summary - The details' summary. Alternatively, you can use the `summary` attribute.
 * @slot expand-icon - Optional expand icon to use instead of the default. Works best with `<ts-icon>`.
 * @slot collapse-icon - Optional collapse icon to use instead of the default. Works best with `<ts-icon>`.
 *
 * @event ts-show - Emitted when the details opens.
 * @event ts-after-show - Emitted after the details opens and all animations are complete.
 * @event ts-hide - Emitted when the details closes.
 * @event ts-after-hide - Emitted after the details closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The header that wraps both the summary and the expand/collapse icon.
 * @csspart summary - The container that wraps the summary.
 * @csspart summary-icon - The container that wraps the expand/collapse icons.
 * @csspart content - The details content.
 *
 * @animation details.show - The animation to use when showing details. You can use `height: auto` with this animation.
 * @animation details.hide - The animation to use when hiding details. You can use `height: auto` with this animation.
 *
 * @deprecated Use <ts-accordion> and <ts-accordion-item> instead.
 */
export default class TsDetailsComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    static override dependencies = {
        'ts-icon': TsIcon,
    };

    private static hasWarned = false;

    private readonly localize = new LocalizeController(this);

    @query('.details') details!: HTMLDetailsElement;
    @query('.details__header') header!: HTMLElement;
    @query('.details__body') body!: HTMLElement;
    @query('.details__expand-icon-slot') expandIconSlot!: HTMLSlotElement;

    detailsObserver!: MutationObserver;

    /**
     * Indicates whether or not the details is open. You can toggle this attribute to show and hide the details, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the details' open state.
     */
    @property({ type: Boolean, reflect: true }) open = false;

    /** The summary to show in the header. If you need to display HTML, use the `summary` slot instead. */
    @property() summary!: string;

    /** Disables the details so it can't be toggled. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** Visual variant. */
    @property({ reflect: true }) variant: 'primary' | 'secondary' = 'primary';

    override connectedCallback(): void {
        super.connectedCallback();
        if (!TsDetailsComponent.hasWarned) {
            console.warn(
                'Deprecated: <ts-details> is deprecated. Do not use the native <details> pattern here. Use <ts-accordion> and <ts-accordion-item> instead.',
            );
            TsDetailsComponent.hasWarned = true;
        }
    }

    override firstUpdated() {
        this.body.style.height = this.open ? 'auto' : '0';
        if (this.open) {
            this.details.open = true;
        }

        this.detailsObserver = new MutationObserver(changes => {
            for (const change of changes) {
                if (change.type === 'attributes' && change.attributeName === 'open') {
                    if (this.details.open) {
                        this.show();
                    } else {
                        this.hide();
                    }
                }
            }
        });
        this.detailsObserver.observe(this.details, { attributes: true });
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.detailsObserver?.disconnect();
    }

    private handleSummaryClick(event: MouseEvent) {
        event.preventDefault();

        if (!this.disabled) {
            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
            this.header.focus();
        }
    }

    private handleSummaryKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();

            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            this.hide();
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            this.show();
        }
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            this.details.open = true;
            // Show
            const slShow = this.emit('ts-show', { cancelable: true });
            if (slShow.defaultPrevented) {
                this.open = false;
                this.details.open = false;
                return;
            }

            await stopAnimations(this.body);

            const { keyframes, options } = getAnimation(this, 'details.show', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
            this.body.style.height = 'auto';

            this.emit('ts-after-show');
        } else {
            // Hide
            const slHide = this.emit('ts-hide', { cancelable: true });
            if (slHide.defaultPrevented) {
                this.details.open = true;
                this.open = true;
                return;
            }

            await stopAnimations(this.body);

            const { keyframes, options } = getAnimation(this, 'details.hide', { dir: this.localize.dir() });
            await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
            this.body.style.height = 'auto';

            this.details.open = false;
            this.emit('ts-after-hide');
        }
    }

    /** Shows the details. */
    async show() {
        if (this.open || this.disabled) {
            return undefined;
        }

        this.open = true;
        return waitForEvent(this, 'ts-after-show');
    }

    /** Hides the details */
    async hide() {
        if (!this.open || this.disabled) {
            return undefined;
        }

        this.open = false;
        return waitForEvent(this, 'ts-after-hide');
    }

    override render() {
        const isRtl = this.localize.dir() === 'rtl';

        return html`
            <details
                part="base"
                class=${classMap({
                    details: true,
                    'details--open': this.open,
                    'details--disabled': this.disabled,
                    'details--rtl': isRtl,
                })}
            >
                <summary
                    part="header"
                    id="header"
                    class="details__header"
                    role="button"
                    aria-expanded=${this.open ? 'true' : 'false'}
                    aria-controls="content"
                    aria-disabled=${this.disabled ? 'true' : 'false'}
                    tabindex=${this.disabled ? '-1' : '0'}
                    @click=${this.handleSummaryClick}
                    @keydown=${this.handleSummaryKeyDown}
                >
                    <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

                    <span part="summary-icon" class="details__summary-icon">
                        <slot name="expand-icon">
                            <ts-icon name="keyboard_arrow_down"></ts-icon>
                        </slot>
                        <slot name="collapse-icon">
                            <ts-icon name="keyboard_arrow_down"></ts-icon>
                        </slot>
                    </span>
                </summary>

                <div class="details__body" role="region" aria-labelledby="header">
                    <slot part="content" id="content" class="details__content"></slot>
                </div>
            </details>
        `;
    }
}

setDefaultAnimation('details.show', {
    keyframes: [
        { height: '0', opacity: '0' },
        { height: 'auto', opacity: '1' },
    ],
    options: { duration: 250, easing: 'linear' },
});

setDefaultAnimation('details.hide', {
    keyframes: [
        { height: 'auto', opacity: '1' },
        { height: '0', opacity: '0' },
    ],
    options: { duration: 250, easing: 'linear' },
});
