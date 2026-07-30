import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup, TemplateResult } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsCardStyles.js';

/**
 * @summary Cards can be used to group related subjects in a container.
 * @documentation https://create.tuvsud.com/latest/components/card/develop-ByPoppKi
 * @status stable
 * @since 1.0
 *
 * @slot - The card's main content.
 * @slot header - An optional header for the card.
 * @slot footer - An optional footer for the card.
 * @slot image - An optional image to render at the start of the card.
 *
 * @csspart base - The component's base wrapper.
 * @csspart image - The container that wraps the card's image.
 * @csspart header - The container that wraps the card's header.
 * @csspart body - The container that wraps the card's main content.
 * @csspart footer - The container that wraps the card's footer.
 *
 * @cssproperty --border-color - The card's border color, including borders that occur inside the card.
 * @cssproperty --border-radius - The border radius for the card's edges.
 * @cssproperty --border-width - The width of the card's borders.
 * @cssproperty --padding - The padding to use for the card's sections.
 */
export default class TsCardComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    /**
     * Normalize whitespace in the default slot to prevent layout issues caused by
     * unintended spaces and line breaks in consumer markup.
     */
    private readonly normalizeDefaultSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    /**
     * Tracks whether named slots currently have assigned content.
     */
    private readonly hasSlotController = new HasSlotController(this, 'footer', 'header', 'image');

    /** When `true`, a divider is shown between the card's sections. */
    @property({
        reflect: true,
        attribute: 'show-divider',
        converter: {
            fromAttribute: value => value !== 'false',
            toAttribute: value => (value ? null : 'false'),
        },
    })
    showDivider = true;

    /**
     * Optional URL to navigate to when the card is activated.
     * When set, the card behaves like a link.
     */
    @property({ type: String })
    href?: string;

    /**
     * Tells the browser where to open the link. Only used when `href` is set.
     * Typical values: `_self`, `_blank`, `_parent`, `_top`.
     */
    @property({ type: String })
    target?: string;

    /**
     * When `true`, suppresses the automatic `noopener noreferrer` security rel
     * that is otherwise applied for `_blank` targets.
     *
     * Kept as-is for backwards compatibility, although the name is likely a typo.
     */
    @property({ type: Boolean, attribute: 'nopopper' })
    nopopper = false;

    /**
     * Optional explicit rel value. If provided, it takes precedence over the
     * automatic `_blank` rel behavior.
     */
    @property({ type: String }) rel?: string;

    /**
     * Interactive descendants that should not trigger card-level navigation.
     */
    private static readonly INTERACTIVE_SELECTOR = [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        'summary',
        'details',
        'label',
        'audio[controls]',
        'video[controls]',
        '[role="button"]',
        '[role="link"]',
        '[contenteditable="true"]',
        '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    private get clickable(): boolean {
        return typeof this.href === 'string' && this.href.length > 0;
    }

    /**
     * Computes the rel attribute used when acting as a link.
     *
     * - If the consumer provides `rel`, use that.
     * - Otherwise, for `_blank`, default to `noopener noreferrer` unless suppressed.
     */
    private get computedRel(): string | undefined {
        if (!this.clickable) return undefined;
        if (this.rel) return this.rel;

        if (this.target === '_blank' && !this.nopopper) {
            return 'noopener noreferrer';
        }

        return undefined;
    }

    private handleSlotChange = (): void => {
        // Intentionally empty: HasSlotController already calls requestUpdate()
        // when any of the watched slots change. The handler is kept on the
        // template only for explicit clarity.
        void 0;
    };

    private isFromInteractive(event: Event): boolean {
        const path = event.composedPath();

        return path.some(node => {
            if (!(node instanceof Element)) return false;
            return node.matches(TsCardComponent.INTERACTIVE_SELECTOR);
        });
    }

    private openLink(event?: MouseEvent | KeyboardEvent): void {
        if (!this.clickable || !this.href) return;

        const isModifiedMouseEvent =
            event instanceof MouseEvent && (event.button === 1 || event.metaKey || event.ctrlKey);

        const target = isModifiedMouseEvent ? '_blank' : this.target || '_self';
        const rel = this.computedRel;

        /**
         * Use window.open because the host element is a div, not an anchor.
         * Preserve expected "open in new tab" behavior for middle-click / cmd-click / ctrl-click.
         */
        const openedWindow = window.open(
            this.href,
            target,
            rel === 'noopener noreferrer' ? 'noopener,noreferrer' : undefined,
        );

        /**
         * Defensive hardening if the browser returns a handle and we intended noopener behavior.
         */
        if (openedWindow && rel?.includes('noopener')) {
            openedWindow.opener = null;
        }
    }

    private handleClick = (event: MouseEvent): void => {
        if (!this.clickable) return;
        if (this.isFromInteractive(event)) return;

        this.openLink(event);
    };

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (!this.clickable) return;
        if (this.isFromInteractive(event)) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.openLink(event);
        }
    };

    private renderContent(): TemplateResult {
        return html`
            <slot name="image" part="image" class="card__image" @slotchange=${this.handleSlotChange}></slot>

            <slot name="header" part="header" class="card__header" @slotchange=${this.handleSlotChange}></slot>

            <slot part="body" class="card__body"></slot>

            <slot name="footer" part="footer" class="card__footer" @slotchange=${this.handleSlotChange}></slot>
        `;
    }

    override render(): TemplateResult {
        const clickable = this.clickable;

        const classes = {
            card: true,
            'card--has-footer': this.hasSlotController.test('footer'),
            'card--has-header': this.hasSlotController.test('header'),
            'card--has-image': this.hasSlotController.test('image'),
            'card--no-divider': !this.showDivider,
            'card--clickable': clickable,
        };

        return html`
            <div
                part="base"
                class=${classMap(classes)}
                data-target=${this.target ?? nothing}
                data-rel=${this.computedRel ?? nothing}
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
            >
                ${this.renderContent()}
            </div>
        `;
    }
}
