import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsPaginationItemStyles.js';

/**
 * @summary Represents a single page button within a pagination component.
 * @status stable
 * @since 1.21
 *
 * @event ts-page-click - Emitted when a numbered page item is clicked. Detail: `{ page: number }`.
 * @event ts-nav-click - Internal event emitted by prev/next buttons. Detail: `{ direction: 'prev' | 'next', page: number }`. Handled by `ts-pagination`.
 *
 * @csspart base - The component's base button/anchor element.
 */
export default class TsPaginationItemComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    @query('slot') private defaultSlot!: HTMLSlotElement;
    @state() private hasSlottedAnchor = false;

    /** The page number this item represents. Used for page-type items. */
    @property({ type: Number, reflect: true }) page = 0;

    /** Marks this item as the currently active page. */
    @property({ type: Boolean, reflect: true }) active = false;

    /** Disables the item. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** The type of item: a page number, an ellipsis gap, or the prev/next nav buttons. */
    @property({ reflect: true }) type: 'page' | 'ellipsis' | 'prev' | 'next' = 'page';

    /** The visual variant of the item. */
    @property({ reflect: true }) variant: 'outlined' | 'text' = 'outlined';

    /** The size of the item. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /**
     * When set, the item renders as an `<a>` element instead of `<button>`, making
     * it crawlable by search engines and compatible with SSR. Alternatively, slot a
     * native `<a>` element directly — the component will decorate it with the correct
     * classes and ARIA attributes automatically.
     */
    @property() href?: string;

    /** Forwarded to the rendered `<a>` element. */
    @property() target?: '_blank' | '_self' | '_parent' | '_top';

    /** Forwarded to the rendered `<a>` element. Auto-appends `noopener noreferrer` for `target="_blank"`. */
    @property() rel?: string;

    private get computedRel(): string | undefined {
        if (this.target !== '_blank') return this.rel;
        const tokens = new Set((this.rel ?? '').split(/\s+/).filter(Boolean));
        tokens.add('noopener');
        tokens.add('noreferrer');
        return Array.from(tokens).join(' ');
    }

    private getClasses(isEllipsis: boolean, isNav: boolean) {
        return {
            'pagination-item': true,
            'pagination-item--small': this.size === 'small',
            'pagination-item--medium': this.size === 'medium',
            'pagination-item--large': this.size === 'large',
            'pagination-item--outlined': this.variant === 'outlined',
            'pagination-item--text': this.variant === 'text',
            'pagination-item--active': this.active,
            'pagination-item--disabled': this.disabled,
            'pagination-item--ellipsis': isEllipsis,
            'pagination-item--nav': isNav,
        };
    }

    private getSlottedAnchor(): HTMLAnchorElement | undefined {
        const assigned = this.defaultSlot?.assignedElements({ flatten: true }) ?? [];
        return assigned.find(el => el.tagName.toLowerCase() === 'a') as HTMLAnchorElement | undefined;
    }

    private decorateSlottedAnchor(anchor: HTMLAnchorElement) {
        const isEllipsis = this.type === 'ellipsis';
        const isNav = this.type === 'prev' || this.type === 'next';
        const classes = this.getClasses(isEllipsis, isNav);

        for (const [cls, enabled] of Object.entries(classes)) {
            anchor.classList.toggle(cls, enabled);
        }

        // ARIA
        const ariaLabel = isNav
            ? this.type === 'prev'
                ? 'Previous page'
                : 'Next page'
            : isEllipsis
              ? undefined
              : `Page ${this.page}`;

        if (ariaLabel) anchor.setAttribute('aria-label', ariaLabel);
        else anchor.removeAttribute('aria-label');

        if (this.active) anchor.setAttribute('aria-current', 'page');
        else anchor.removeAttribute('aria-current');

        if (isEllipsis) anchor.setAttribute('aria-hidden', 'true');
        else anchor.removeAttribute('aria-hidden');

        // href / disabled
        if (this.disabled || isEllipsis) {
            anchor.removeAttribute('href');
            anchor.setAttribute('aria-disabled', 'true');
            anchor.setAttribute('tabindex', '-1');
        } else {
            if (!anchor.getAttribute('href') && this.href) anchor.setAttribute('href', this.href);
            anchor.removeAttribute('aria-disabled');
            anchor.setAttribute('tabindex', '0');
        }

        if (this.target && !anchor.target) anchor.target = this.target;
        const rel = this.computedRel;
        if (rel) anchor.setAttribute('rel', rel);
        else anchor.removeAttribute('rel');

        // ::slotted(a:hover) is unreliable in Shadow DOM — use a JS-toggled class instead
        anchor.removeEventListener('mouseenter', this.handleAnchorMouseEnter);
        anchor.removeEventListener('mouseleave', this.handleAnchorMouseLeave);
        if (isNav && !this.disabled) {
            anchor.addEventListener('mouseenter', this.handleAnchorMouseEnter);
            anchor.addEventListener('mouseleave', this.handleAnchorMouseLeave);
        }

        // Click
        anchor.removeEventListener('click', this.handleAnchorClick);
        anchor.addEventListener('click', this.handleAnchorClick);
    }

    private handleAnchorMouseEnter = () => {
        this.getSlottedAnchor()?.classList.add('pagination-item--hovered');
    };

    private handleAnchorMouseLeave = () => {
        this.getSlottedAnchor()?.classList.remove('pagination-item--hovered');
    };

    private handleAnchorClick = (event: MouseEvent) => {
        if (this.disabled || this.type === 'ellipsis') {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        this.handleClick();
    };

    private handleSlotChange = () => {
        const anchor = this.getSlottedAnchor();
        if (this.hasSlottedAnchor !== !!anchor) {
            this.hasSlottedAnchor = !!anchor;
        }
        if (anchor) this.decorateSlottedAnchor(anchor);
    };

    /**
     * Returns a slotted anchor for use during `willUpdate()`. Before the
     * first render the shadow `<slot>` does not exist yet, so fall back to
     * scanning the host's light-DOM children.
     */
    private peekSlottedAnchor(): HTMLAnchorElement | undefined {
        const slotAnchor = this.getSlottedAnchor();
        if (slotAnchor) return slotAnchor;
        return (this.querySelector(':scope > a') as HTMLAnchorElement | null) ?? undefined;
    }

    protected override willUpdate() {
        // Compute hasSlottedAnchor BEFORE render so we don't have to mutate
        // reactive @state from firstUpdated()/updated() (which would trigger
        // Lit's "change-in-update" warning on initial render).
        const next = !!this.peekSlottedAnchor();
        if (this.hasSlottedAnchor !== next) {
            this.hasSlottedAnchor = next;
        }
    }

    override firstUpdated() {
        // hasSlottedAnchor is already set in willUpdate(); only the DOM
        // side-effect (anchor decoration) needs to run after first render.
        const anchor = this.getSlottedAnchor();
        if (anchor) this.decorateSlottedAnchor(anchor);
    }

    override updated() {
        if (this.hasSlottedAnchor) {
            const anchor = this.getSlottedAnchor();
            if (anchor) this.decorateSlottedAnchor(anchor);
        }
    }

    override disconnectedCallback() {
        const anchor = this.getSlottedAnchor();
        if (anchor) {
            anchor.removeEventListener('click', this.handleAnchorClick);
            anchor.removeEventListener('mouseenter', this.handleAnchorMouseEnter);
            anchor.removeEventListener('mouseleave', this.handleAnchorMouseLeave);
        }
        super.disconnectedCallback();
    }

    private handleClick() {
        if (this.disabled || this.type === 'ellipsis') return;

        if (this.type === 'prev' || this.type === 'next') {
            this.dispatchEvent(
                new CustomEvent('ts-nav-click', {
                    bubbles: true,
                    composed: true,
                    detail: { direction: this.type as 'prev' | 'next', page: this.page },
                }),
            );
        } else {
            this.emit('ts-page-click', { detail: { page: this.page } });
        }
    }

    override render() {
        const isEllipsis = this.type === 'ellipsis';
        const isNav = this.type === 'prev' || this.type === 'next';
        const classes = this.getClasses(isEllipsis, isNav);

        const ariaLabel = isNav
            ? this.type === 'prev'
                ? 'Previous page'
                : 'Next page'
            : isEllipsis
              ? undefined
              : `Page ${this.page}`;

        if (this.hasSlottedAnchor) {
            return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
        }

        if (this.href) {
            return html`
                <a
                    part="base"
                    class=${classMap(classes)}
                    href=${ifDefined(!this.disabled && !isEllipsis ? this.href : undefined)}
                    target=${ifDefined(this.target)}
                    rel=${ifDefined(this.computedRel)}
                    aria-current=${ifDefined(this.active ? 'page' : undefined)}
                    aria-label=${ifDefined(ariaLabel)}
                    aria-hidden=${isEllipsis ? 'true' : 'false'}
                    aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
                    tabindex=${this.disabled || isEllipsis ? '-1' : '0'}
                    @click=${this.handleClick}
                >
                    <slot @slotchange=${this.handleSlotChange}></slot>
                </a>
            `;
        }

        return html`
            <button
                part="base"
                class=${classMap(classes)}
                ?disabled=${this.disabled || isEllipsis}
                aria-current=${ifDefined(this.active ? 'page' : undefined)}
                aria-label=${ifDefined(ariaLabel)}
                aria-hidden=${isEllipsis ? 'true' : 'false'}
                tabindex=${this.disabled || isEllipsis ? '-1' : '0'}
                @click=${this.handleClick}
            >
                <slot @slotchange=${this.handleSlotChange}></slot>
            </button>
        `;
    }
}
