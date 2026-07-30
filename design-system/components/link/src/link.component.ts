import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsLinkStyles.js';

export default class TsLinkComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    @query('slot:not([name])') private defaultSlot!: HTMLSlotElement;
    @state() private hasSlottedAnchor = false;

    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @property({ reflect: true }) variant: 'secondary' | 'primary' | 'inverted-text' = 'primary';
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
    @property({ type: Boolean, reflect: true }) disabled = false;

    @property() href = '';
    @property() target?: '_blank' | '_self' | '_parent' | '_top';
    @property() rel?: string;
    @property() download?: string;
    @property({ type: Boolean, reflect: true, attribute: 'visited-color' }) visitedColor = true;
    @property({ type: Boolean, reflect: true }) underline = true;

    private computedRel(target?: string) {
        const resolvedTarget = target ?? this.target;
        const resolvedRel = this.rel;

        if (resolvedTarget !== '_blank') return resolvedRel;

        const tokens = new Set((resolvedRel ?? '').split(/\s+/).filter(Boolean));
        tokens.add('noopener');
        tokens.add('noreferrer');
        return Array.from(tokens).join(' ');
    }

    private getClasses(showExternalIcon: boolean) {
        return {
            link: true,
            'link--secondary': this.variant === 'secondary',
            'link--primary': this.variant === 'primary',
            'link--inverted-text': this.variant === 'inverted-text',
            'link--small': this.size === 'small',
            'link--medium': this.size === 'medium',
            'link--large': this.size === 'large',
            'link--disabled': this.disabled,
            'link--external': showExternalIcon,
            'link--no-underline': !this.underline,
            'link--no-visited': !this.visitedColor,
        };
    }

    private handleClick = (event: MouseEvent) => {
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private getSlottedAnchor(): HTMLAnchorElement | undefined {
        const assigned = this.defaultSlot?.assignedElements({ flatten: true }) ?? [];
        return assigned.find(el => el.tagName.toLowerCase() === 'a') as HTMLAnchorElement | undefined;
    }

    private decorateSlottedAnchor(anchor: HTMLAnchorElement) {
        const effectiveTarget = anchor.target || this.target;
        const showExternalIcon = effectiveTarget === '_blank';

        const classes = this.getClasses(showExternalIcon);
        for (const [className, enabled] of Object.entries(classes)) {
            anchor.classList.toggle(className, enabled);
        }

        if (!anchor.target && this.target) {
            anchor.target = this.target;
        }

        const rel = this.computedRel(anchor.target);
        if (rel) anchor.setAttribute('rel', rel);
        else anchor.removeAttribute('rel');

        if (this.download) anchor.setAttribute('download', this.download);
        else anchor.removeAttribute('download');

        if (this.disabled) {
            anchor.removeAttribute('href');
            anchor.setAttribute('aria-disabled', 'true');
            anchor.setAttribute('tabindex', '-1');
        } else {
            if (!anchor.getAttribute('href') && this.href) {
                anchor.setAttribute('href', this.href);
            }
            anchor.setAttribute('aria-disabled', 'false');
            anchor.setAttribute('tabindex', '0');
        }

        anchor.removeEventListener('click', this.handleClick);
        anchor.addEventListener('click', this.handleClick);
    }

    private handleSlotChange = () => {
        const slottedAnchor = this.getSlottedAnchor();
        if (this.hasSlottedAnchor !== !!slottedAnchor) {
            this.hasSlottedAnchor = !!slottedAnchor;
        }

        if (slottedAnchor) this.decorateSlottedAnchor(slottedAnchor);
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
        // Compute hasSlottedAnchor BEFORE the first render so we don't have
        // to mutate reactive @state from firstUpdated()/updated(), which
        // would trigger Lit's "change-in-update" warning.
        const next = !!this.peekSlottedAnchor();
        if (this.hasSlottedAnchor !== next) {
            this.hasSlottedAnchor = next;
        }
    }

    override firstUpdated() {
        // hasSlottedAnchor is already populated in willUpdate(); we only
        // need to decorate the anchor (DOM side-effect, no reactive write)
        // if one was slotted before the first render.
        const slottedAnchor = this.getSlottedAnchor();
        if (slottedAnchor) this.decorateSlottedAnchor(slottedAnchor);
    }

    override updated() {
        if (!this.hasSlottedAnchor) return;

        const slottedAnchor = this.getSlottedAnchor();
        if (slottedAnchor) this.decorateSlottedAnchor(slottedAnchor);
    }

    override disconnectedCallback() {
        const slottedAnchor = this.getSlottedAnchor();
        if (slottedAnchor) {
            slottedAnchor.removeEventListener('click', this.handleClick);
        }
        super.disconnectedCallback();
    }

    override render() {
        const showExternalIcon = this.target === '_blank';

        if (this.hasSlottedAnchor) {
            return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
        }

        return html`
            <a
                part="base"
                class=${classMap(this.getClasses(showExternalIcon))}
                href=${ifDefined(!this.disabled ? this.href || undefined : undefined)}
                target=${ifDefined(this.target)}
                rel=${ifDefined(this.computedRel())}
                download=${ifDefined(this.download)}
                aria-disabled=${this.disabled ? 'true' : 'false'}
                tabindex=${this.disabled ? '-1' : '0'}
                @click=${this.handleClick}
            >
                <slot @slotchange=${this.handleSlotChange}></slot>
            </a>
        `;
    }
}
