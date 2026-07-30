import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { isTemplateResult } from 'lit/directive-helpers.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { getIconLibrary, type IconLibrary, unwatchIcon, watchIcon } from '@components/icon/src/library.js';

import styles from './TsIconStyles.js';

/**
 * @summary Icons are symbols that can be used to represent various options within an application.
 * @documentation https://create.tuvsud.com/latest/components/icon/develop-gTI4CiIs
 * @status stable
 * @since 1.0
 *
 * @event ts-load - Emitted when the icon has loaded. When using `spriteSheet: true` this will not emit.
 * @event ts-error - Emitted when the icon fails to load due to an error. When using `spriteSheet: true` this will not emit.
 *
 * @slot - Accepts an SVG element or an `<img>` element to use as the icon. When slotted content is present it takes
 *         precedence over the `name`/`src` properties. The slotted element will inherit size and color from the host.
 *
 * @csspart svg - The internal SVG element.
 * @csspart use - The <use> element generated when using `spriteSheet: true`
 */

const CACHEABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
type SVGResult = HTMLTemplateResult | SVGSVGElement | typeof RETRYABLE_ERROR | typeof CACHEABLE_ERROR;

let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

interface IconSource {
    url?: string;
    fromLibrary: boolean;
}

export default class TsIconComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private initialRender = false;

    /** True when the default slot contains at least one element. */
    @state() private hasSlottedContent = false;

    /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
    private async resolveIcon(url: string, library?: IconLibrary): Promise<SVGResult> {
        let fileData: Response;

        if (library?.spriteSheet) {
            this.svg = html`<svg part="svg">
                <use part="use" href="${url}"></use>
            </svg>`;

            return this.svg;
        }

        try {
            fileData = await fetch(url, { mode: 'cors' });
            if (!fileData.ok) return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
        } catch {
            return RETRYABLE_ERROR;
        }

        try {
            const div = document.createElement('div');
            div.innerHTML = await fileData.text();

            const svg = div.firstElementChild;
            if (svg?.tagName?.toLowerCase() !== 'svg') return CACHEABLE_ERROR;

            if (!parser) parser = new DOMParser();
            const doc = parser.parseFromString(svg.outerHTML, 'text/html');

            const svgEl = doc.body.querySelector('svg');
            if (!svgEl) return CACHEABLE_ERROR;

            svgEl.part.add('svg');
            return document.adoptNode(svgEl);
        } catch {
            return CACHEABLE_ERROR;
        }
    }

    @state() private svg: SVGElement | HTMLTemplateResult | null = null;

    /** The name of the icon to draw. Available names depend on the icon library being used. */
    @property({ reflect: true }) name?: string;

    /**
     * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
     * can result in XSS attacks.
     */
    @property() src?: string;

    /**
     * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
     * ignored by assistive devices.
     */
    @property() label = '';

    /** The name of a registered custom icon library. */
    @property({ reflect: true }) library = 'material';

    /** The size of the icon */
    @property({ type: Number, reflect: true }) size = 16;

    override connectedCallback() {
        super.connectedCallback();
        watchIcon(this);
    }

    override firstUpdated() {
        this.initialRender = true;
        this.setIcon();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        unwatchIcon(this);
    }

    private handleSlotChange() {
        const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
        const assignedNodes = slot?.assignedElements({ flatten: true }) ?? [];
        this.hasSlottedContent = assignedNodes.length > 0;

        // Apply fill:currentColor to inline SVGs placed in the slot so they
        // inherit the host's --icon-color / color automatically.
        assignedNodes.forEach(el => {
            if (el.tagName.toLowerCase() === 'svg') {
                (el as SVGElement).setAttribute('fill', 'currentColor');
                (el as SVGElement).style.width = '100%';
                (el as SVGElement).style.height = '100%';
                (el as SVGElement).style.display = 'block';
            }
            if (el.tagName.toLowerCase() === 'img') {
                const img = el as HTMLImageElement;
                const src = img.getAttribute('src') ?? '';
                // For SVG files loaded as <img>, fetch and inline them so currentColor works.
                if (src.trim().toLowerCase().endsWith('.svg')) {
                    this.inlineSvgFromImg(img);
                } else {
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    img.style.display = 'block';
                }
            }
        });
    }

    private async inlineSvgFromImg(img: HTMLImageElement) {
        const src = img.getAttribute('src') ?? '';
        try {
            const response = await fetch(src, { mode: 'cors' });
            if (!response.ok) return;
            const text = await response.text();
            const div = document.createElement('div');
            div.innerHTML = text;
            const svgEl = div.querySelector('svg');
            if (!svgEl) return;
            // Copy over alt as aria-label if present
            const alt = img.getAttribute('alt');
            if (alt) svgEl.setAttribute('aria-label', alt);
            svgEl.setAttribute('fill', 'currentColor');
            svgEl.style.width = '100%';
            svgEl.style.height = '100%';
            svgEl.style.display = 'block';
            img.replaceWith(svgEl);
        } catch {
            // Fall back to leaving the img as-is
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
        }
    }

    private getIconSource(): IconSource {
        const library = getIconLibrary(this.library);
        if (this.name && library) {
            return {
                url: library.resolver(this.name),
                fromLibrary: true,
            };
        }

        return {
            url: this.src,
            fromLibrary: false,
        };
    }

    @watch('label')
    handleLabelChange() {
        const hasLabel = typeof this.label === 'string' && this.label.length > 0;

        if (hasLabel) {
            this.setAttribute('role', 'img');
            this.setAttribute('aria-label', this.label);
            this.removeAttribute('aria-hidden');
        } else {
            this.removeAttribute('role');
            this.removeAttribute('aria-label');
            this.setAttribute('aria-hidden', 'true');
        }
    }

    @watch(['name', 'src', 'library'])
    async setIcon() {
        const { url, fromLibrary } = this.getIconSource();
        const library = fromLibrary ? getIconLibrary(this.library) : undefined;

        if (!url) {
            this.svg = null;
            return;
        }

        let iconResolver = iconCache.get(url);
        if (!iconResolver) {
            iconResolver = this.resolveIcon(url, library);
            iconCache.set(url, iconResolver);
        }

        // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
        if (!this.initialRender) {
            return;
        }

        const svg = await iconResolver;

        if (svg === RETRYABLE_ERROR) {
            iconCache.delete(url);
        }

        if (url !== this.getIconSource().url) {
            // If the url has changed while fetching the icon, ignore this request
            return;
        }

        if (isTemplateResult(svg)) {
            this.svg = svg;

            if (library) {
                // Using a templateResult requires the SVG to be written to the DOM first before we can grab the SVGElement
                // to be passed to the library's mutator function.
                await this.updateComplete;

                const shadowSVG = this.shadowRoot!.querySelector("[part='svg']")!;

                if (typeof library.mutator === 'function' && shadowSVG) {
                    library.mutator(shadowSVG as SVGElement);
                }
            }

            return;
        }

        switch (svg) {
            case RETRYABLE_ERROR:
            case CACHEABLE_ERROR:
                this.svg = null;
                this.emit('ts-error');
                break;
            default:
                this.svg = svg.cloneNode(true) as SVGElement;
                library?.mutator?.(this.svg);
                this.emit('ts-load');
        }
    }

    override render() {
        this.style.setProperty('--ts-icon-size', `${this.size}px`);

        // Always render the slot so slotted content (React SVG / Angular img) can be detected.
        // When slot has content, hide the fetched svg; otherwise show it.
        return html`
            <slot @slotchange=${this.handleSlotChange} style=${this.hasSlottedContent ? '' : 'display:none'}></slot>
            ${this.hasSlottedContent ? null : this.svg}
        `;
    }
}
