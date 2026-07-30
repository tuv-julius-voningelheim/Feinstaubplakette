import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, literal } from 'lit/static-html.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';

import styles from './TsIconButtonStyle.js';

export default class TsIconButtonComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    static override get observedAttributes() {
        return [...super.observedAttributes, 'aria-label', 'aria-labelledby'];
    }

    @query('.icon-button') button!: HTMLButtonElement | HTMLLinkElement;

    @state() private hasFocus = false;
    @state() private hasSlottedContent = false;

    @property() name?: string;
    @property() library?: string = 'material';

    /** Container style variant */
    @property({ reflect: true }) variant: 'outline' | 'filled' | 'subtle' = 'subtle';

    /** Color intent */
    @property({ reflect: true }) intent:
        'default' | 'primary' | 'success' | 'accent01' | 'accent02' | 'neutral' | 'warning' | 'danger' = 'default';

    /** Circular shape */
    @property({ type: Boolean, reflect: true }) circle = false;

    /**
     * When true, renders the icon button with inverted colors — white/light icon and border instead of the
     * intent colour. Useful for placing icon buttons on dark or primary-coloured backgrounds.
     */
    @property({ type: Boolean, reflect: true }) inverted = false;

    @property({ type: Boolean, reflect: true }) hover = true;

    @property() src?: string;
    @property() href?: string;
    @property() target?: '_blank' | '_parent' | '_self' | '_top';
    @property() download?: string;
    @property() label = '';

    // Stored separately so removing the host attribute doesn't wipe the value.
    private _ariaLabel: string | null = null;
    private _ariaLabelledby: string | null = null;

    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Number, reflect: true }) size = 16;

    private handleBlur() {
        this.hasFocus = false;
        this.emit('ts-blur');
    }

    private handleFocus() {
        this.hasFocus = true;
        this.emit('ts-focus');
    }

    private handleSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        this.hasSlottedContent = slot.assignedElements({ flatten: true }).length > 0;
    }

    private handleClick(event: MouseEvent) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    override connectedCallback() {
        super.connectedCallback();
        // Capture any attributes already present in markup, then remove them from the host.
        // aria-label/aria-labelledby on a roleless host element triggers aria-prohibited-attr.
        const label = this.getAttribute('aria-label');
        const labelledby = this.getAttribute('aria-labelledby');
        if (label !== null) {
            this._ariaLabel = label;
            this.removeAttribute('aria-label');
        }
        if (labelledby !== null) {
            this._ariaLabelledby = labelledby;
            this.removeAttribute('aria-labelledby');
        }
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'aria-label') {
            if (newValue !== null) {
                this._ariaLabel = newValue;
                // Queue removal so we don't call removeAttribute inside attributeChangedCallback synchronously
                Promise.resolve().then(() => this.removeAttribute('aria-label'));
            }
            this.requestUpdate();
            return;
        }
        if (name === 'aria-labelledby') {
            if (newValue !== null) {
                this._ariaLabelledby = newValue;
                Promise.resolve().then(() => this.removeAttribute('aria-labelledby'));
            }
            this.requestUpdate();
            return;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    override click() {
        this.button.click();
    }

    override focus(options?: FocusOptions) {
        this.button.focus(options);
    }

    override blur() {
        this.button.blur();
    }

    override render() {
        const isLink = !!this.href;
        const tag = isLink ? literal`a` : literal`button`;
        const accessibleName = (this._ariaLabel ?? this.label)?.trim();
        const ariaLabel = accessibleName || undefined;

        return html`
            <${tag}
                    part="base"
                    class=${classMap({
                        'icon-button': true,
                        'icon-button-hover': this.hover,

                        // states
                        'icon-button--disabled': !isLink && this.disabled,
                        'icon-button--focused': this.hasFocus,

                        // variant
                        'icon-button--outline': this.variant === 'outline',
                        'icon-button--filled': this.variant === 'filled',
                        'icon-button--subtle': this.variant === 'subtle',

                        // intent
                        'icon-button--default': this.intent === 'default',
                        'icon-button--primary': this.intent === 'primary',
                        'icon-button--success': this.intent === 'success',
                        'icon-button--accent01': this.intent === 'accent01',
                        'icon-button--accent02': this.intent === 'accent02',
                        'icon-button--neutral': this.intent === 'neutral',
                        'icon-button--warning': this.intent === 'warning',
                        'icon-button--danger': this.intent === 'danger',

                        // shape
                        'icon-button--circle': this.circle,

                        // inverted
                        'icon-button--inverted': this.inverted,
                    })}
                    ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
                    type=${ifDefined(isLink ? undefined : 'button')}
                    href=${ifDefined(isLink ? this.href : undefined)}
                    target=${ifDefined(isLink ? this.target : undefined)}
                    download=${ifDefined(isLink ? this.download : undefined)}
                    rel=${ifDefined(isLink && this.target ? 'noreferrer noopener' : undefined)}
                    aria-disabled=${this.disabled ? 'true' : 'false'}
                    aria-label=${ifDefined(ariaLabel)}
                    aria-labelledby=${ifDefined(this._ariaLabelledby ?? undefined)}
                    tabindex=${this.disabled ? '-1' : '0'}
                    @blur=${this.handleBlur}
                    @focus=${this.handleFocus}
                    @click=${this.handleClick}
            >
                <ts-icon
                        part="icon"
                        class="icon-button__icon"
                        name=${this.name}
                        library=${ifDefined(this.library)}
                        src=${ifDefined(this.src)}
                        aria-hidden="true"
                        size=${this.size}
                ><slot @slotchange=${this.handleSlotChange}></slot></ts-icon>
            </${tag}>
        `;
    }
}
