import { arrow, autoUpdate, computePosition, flip, offset, platform, shift, size } from '@floating-ui/dom';
import { offsetParent } from 'composed-offset-position';
import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsPopupStyles.js';

/**
 * @summary Options define the selectable items within various form controls such as [select](/components/select).
 * @documentation https://create.tuvsud.com/latest/components/popup/develop-XQDpvxYi
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon
 *
 * @slot - The option's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 *
 * @csspart checked-icon - The checked icon, an `<ts-icon>` element.
 * @csspart base - The component's base wrapper.
 * @csspart label - The option's label.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart suffix - The container that wraps the suffix.
 */
export interface VirtualElement {
    getBoundingClientRect: () => DOMRect;
    contextElement?: Element;
}

function isVirtualElement(e: unknown): e is VirtualElement {
    return (
        e !== null &&
        typeof e === 'object' &&
        'getBoundingClientRect' in e &&
        ('contextElement' in e ? e.contextElement instanceof Element : true)
    );
}

export default class TsPopupComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private anchorEl!: Element | VirtualElement | null;
    private cleanup: ReturnType<typeof autoUpdate> | undefined;
    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('.popup') popup!: HTMLElement;
    @query('.popup__arrow') private arrowEl!: HTMLElement;

    /** The anchor element or ID of the anchor element the popup is positioned relative to. If not set, the first slotted element with the "anchor" slot will be used. */
    @property() anchor!: Element | string | VirtualElement;

    /** Whether the popup is currently active and positioned. */
    @property({ type: Boolean, reflect: true }) active = false;

    /** The preferred placement of the popup relative to the anchor element. */
    @property({ reflect: true }) placement:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'left'
        | 'left-start'
        | 'left-end' = 'top';

    /** The strategy of the popup component**/
    @property({ reflect: true }) strategy: 'absolute' | 'fixed' = 'absolute';

    /** The distance in pixels between the popup and the anchor element. */
    @property({ type: Number }) distance = 0;

    /** The skidding in pixels of the popup relative to the anchor element. */
    @property({ type: Number }) skidding = 0;

    /** Whether to show an arrow pointing to the anchor element. */
    @property({ type: Boolean }) arrow = false;

    /** The placement of the arrow relative to the popup. */
    @property({ attribute: 'arrow-placement' }) arrowPlacement: 'start' | 'end' | 'center' | 'anchor' = 'anchor';

    /** The padding in pixels between the arrow and the edges of the popup. */
    @property({ attribute: 'arrow-padding', type: Number }) arrowPadding = 10;

    /** Whether the popup should flip to remain visible within the viewport. **/
    @property({ type: Boolean }) flip = false;

    /** The fallback placements to use when flipping the popup. */
    @property({
        attribute: 'flip-fallback-placements',
        converter: {
            fromAttribute: (value: string) => {
                return value
                    .split(' ')
                    .map(p => p.trim())
                    .filter(p => p !== '');
            },
            toAttribute: (value: []) => {
                return value.join(' ');
            },
        },
    })
    flipFallbackPlacements = '';

    /** The flip fallback strategy to use when flipping the popup. */
    @property({ attribute: 'flip-fallback-strategy' }) flipFallbackStrategy: 'best-fit' | 'initial' = 'best-fit';

    /** The boundary element(s) to use when flipping the popup. */
    @property({ type: Object }) flipBoundary!: Element | Element[];

    /** The padding in pixels to apply to the flip boundary. */
    @property({ attribute: 'flip-padding', type: Number }) flipPadding = 0;

    /** Whether to shift the popup to remain visible within the viewport. **/
    @property({ type: Boolean }) shift = false;

    /** The boundary element(s) to use when shifting the popup. */
    @property({ type: Object }) shiftBoundary!: Element | Element[];

    /** The padding in pixels to apply to the shift boundary. */
    @property({ attribute: 'shift-padding', type: Number }) shiftPadding = 0;

    /** Whether to automatically size the popup to fit within the viewport. **/
    @property({ attribute: 'auto-size' }) autoSize!: 'horizontal' | 'vertical' | 'both';

    /** Whether to synchronize the popup's size with the anchor element's size. **/
    @property() sync!: 'width' | 'height' | 'both';

    /** The boundary element(s) to use when auto-sizing the popup. */
    @property({ type: Object }) autoSizeBoundary!: Element | Element[];

    /** The padding in pixels to apply to the auto-size boundary. */
    @property({ attribute: 'auto-size-padding', type: Number }) autoSizePadding = 0;

    /** Enables a hover bridge between the anchor and popup to prevent hover interruptions. */
    @property({ attribute: 'hover-bridge', type: Boolean }) hoverBridge = false;

    /** Sets the background color of the popup content area. */
    @property({ attribute: 'content-bg-color' }) contentBgColor?: string;

    override async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.start();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.stop();
    }

    override async updated(changedProps: Map<string, unknown>) {
        super.updated(changedProps);
        if (changedProps.has('active')) {
            if (this.active) {
                this.start();
            } else {
                this.stop();
            }
        }
        if (changedProps.has('anchor')) {
            this.handleAnchorChange();
        }
        if (this.active) {
            await this.updateComplete;
            this.reposition();
        }
    }

    private async handleAnchorChange() {
        await this.stop();
        if (this.anchor && typeof this.anchor === 'string') {
            const root = this.getRootNode() as Document | ShadowRoot;
            this.anchorEl = root.getElementById(this.anchor);
        } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
            this.anchorEl = this.anchor;
        } else {
            this.anchorEl = this.querySelector<HTMLElement>('[slot="anchor"]');
        }
        if (this.anchorEl instanceof HTMLSlotElement) {
            this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0] as HTMLElement;
        }
        if (this.anchorEl && this.active) {
            this.start();
        }
    }

    private start() {
        if (!this.anchorEl || !this.active) return;
        this.cleanup = autoUpdate(this.anchorEl, this.popup, () => {
            this.reposition();
        });
    }

    private async stop(): Promise<void> {
        return new Promise(resolve => {
            if (this.cleanup) {
                this.cleanup();
                this.cleanup = undefined;
                this.removeAttribute('data-current-placement');
                this.style.removeProperty('--auto-size-available-width');
                this.style.removeProperty('--auto-size-available-height');
                requestAnimationFrame(() => resolve());
            } else {
                resolve();
            }
        });
    }

    reposition() {
        if (!this.active || !this.anchorEl) return;

        const middleware = [offset({ mainAxis: this.distance, crossAxis: this.skidding })];

        if (this.sync) {
            middleware.push(
                size({
                    apply: ({ rects }) => {
                        const syncWidth = this.sync === 'width' || this.sync === 'both';
                        const syncHeight = this.sync === 'height' || this.sync === 'both';
                        this.popup.style.width = syncWidth ? `${rects.reference.width}px` : '';
                        this.popup.style.height = syncHeight ? `${rects.reference.height}px` : '';
                    },
                }),
            );
        } else {
            this.popup.style.width = '';
            this.popup.style.height = '';
        }

        if (this.flip) {
            middleware.push(
                flip({
                    boundary: this.flipBoundary,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    fallbackPlacements: this.flipFallbackPlacements,
                    fallbackStrategy: this.flipFallbackStrategy === 'best-fit' ? 'bestFit' : 'initialPlacement',
                    padding: this.flipPadding,
                }),
            );
        }

        if (this.shift) {
            middleware.push(
                shift({
                    boundary: this.shiftBoundary,
                    padding: this.shiftPadding,
                }),
            );
        }

        if (this.autoSize) {
            middleware.push(
                size({
                    boundary: this.autoSizeBoundary,
                    padding: this.autoSizePadding,
                    apply: ({ availableWidth, availableHeight }) => {
                        if (this.autoSize === 'vertical' || this.autoSize === 'both') {
                            this.style.setProperty('--auto-size-available-height', `${availableHeight}px`);
                        } else {
                            this.style.removeProperty('--auto-size-available-height');
                        }
                        if (this.autoSize === 'horizontal' || this.autoSize === 'both') {
                            this.style.setProperty('--auto-size-available-width', `${availableWidth}px`);
                        } else {
                            this.style.removeProperty('--auto-size-available-width');
                        }
                    },
                }),
            );
        } else {
            this.style.removeProperty('--auto-size-available-width');
            this.style.removeProperty('--auto-size-available-height');
        }

        if (this.arrow) {
            middleware.push(
                arrow({
                    element: this.arrowEl,
                    padding: this.arrowPadding,
                }),
            );
        }

        const getOffsetParent =
            this.strategy === 'absolute'
                ? (element: Element) => platform.getOffsetParent(element, offsetParent)
                : platform.getOffsetParent;

        computePosition(this.anchorEl, this.popup, {
            placement: this.placement,
            middleware,
            strategy: this.strategy,
            platform: { ...platform, getOffsetParent },
        }).then(({ x, y, middlewareData, placement }) => {
            const isRtl = this.localize.dir() === 'rtl';
            const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[
                placement.split('-')[0]!
            ]!;
            Object.assign(this.popup.style, { left: `${x}px`, top: `${y}px` });

            if (this.arrow) {
                const arrowX = middlewareData.arrow!.x;
                const arrowY = middlewareData.arrow!.y;
                let top = '';
                let right = '';
                let bottom = '';
                let left: string;

                if (this.arrowPlacement === 'start') {
                    const value =
                        typeof arrowX === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
                    top =
                        typeof arrowY === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
                    right = isRtl ? value : '';
                    left = isRtl ? '' : value;
                } else if (this.arrowPlacement === 'end') {
                    const value =
                        typeof arrowX === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
                    right = isRtl ? '' : value;
                    left = isRtl ? value : '';
                    bottom =
                        typeof arrowY === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
                } else if (this.arrowPlacement === 'center') {
                    left = typeof arrowX === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
                    top = typeof arrowY === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
                } else {
                    left = typeof arrowX === 'number' ? `${arrowX}px` : '';
                    top = typeof arrowY === 'number' ? `${arrowY}px` : '';
                }

                Object.assign(this.arrowEl.style, {
                    top,
                    right,
                    bottom,
                    left,
                    [staticSide]: 'calc(var(--arrow-size-diagonal) * -1)',
                });
            }
        });

        requestAnimationFrame(() => this.updateHoverBridge());
        this.emit('ts-reposition');
    }

    private updateHoverBridge = () => {
        if (this.hoverBridge && this.anchorEl) {
            const anchorRect = this.anchorEl.getBoundingClientRect();
            const popupRect = this.popup.getBoundingClientRect();
            const isVertical = this.placement.includes('top') || this.placement.includes('bottom');
            let topLeftX: number;
            let topLeftY: number;
            let topRightX: number;
            let topRightY: number;
            let bottomLeftX: number;
            let bottomLeftY: number;
            let bottomRightX: number;
            let bottomRightY: number;

            if (isVertical) {
                if (anchorRect.top < popupRect.top) {
                    topLeftX = anchorRect.left;
                    topLeftY = anchorRect.bottom;
                    topRightX = anchorRect.right;
                    topRightY = anchorRect.bottom;
                    bottomLeftX = popupRect.left;
                    bottomLeftY = popupRect.top;
                    bottomRightX = popupRect.right;
                    bottomRightY = popupRect.top;
                } else {
                    topLeftX = popupRect.left;
                    topLeftY = popupRect.bottom;
                    topRightX = popupRect.right;
                    topRightY = popupRect.bottom;
                    bottomLeftX = anchorRect.left;
                    bottomLeftY = anchorRect.top;
                    bottomRightX = anchorRect.right;
                    bottomRightY = anchorRect.top;
                }
            } else {
                if (anchorRect.left < popupRect.left) {
                    topLeftX = anchorRect.right;
                    topLeftY = anchorRect.top;
                    topRightX = popupRect.left;
                    topRightY = popupRect.top;
                    bottomLeftX = anchorRect.right;
                    bottomLeftY = anchorRect.bottom;
                    bottomRightX = popupRect.left;
                    bottomRightY = popupRect.bottom;
                } else {
                    topLeftX = popupRect.right;
                    topLeftY = popupRect.top;
                    topRightX = anchorRect.left;
                    topRightY = anchorRect.top;
                    bottomLeftX = popupRect.right;
                    bottomLeftY = popupRect.bottom;
                    bottomRightX = anchorRect.left;
                    bottomRightY = anchorRect.bottom;
                }
            }

            this.style.setProperty('--hover-bridge-top-left-x', `${topLeftX}px`);
            this.style.setProperty('--hover-bridge-top-left-y', `${topLeftY}px`);
            this.style.setProperty('--hover-bridge-top-right-x', `${topRightX}px`);
            this.style.setProperty('--hover-bridge-top-right-y', `${topRightY}px`);
            this.style.setProperty('--hover-bridge-bottom-left-x', `${bottomLeftX}px`);
            this.style.setProperty('--hover-bridge-bottom-left-y', `${bottomLeftY}px`);
            this.style.setProperty('--hover-bridge-bottom-right-x', `${bottomRightX}px`);
            this.style.setProperty('--hover-bridge-bottom-right-y', `${bottomRightY}px`);
        }
    };

    override render() {
        const styleOverride = this.contentBgColor
            ? `--popup-bg-color:${this.contentBgColor};--arrow-color:${this.contentBgColor};`
            : nothing;

        return html`
            <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

            <span
                part="hover-bridge"
                class=${classMap({
                    'popup-hover-bridge': true,
                    'popup-hover-bridge--visible': this.hoverBridge && this.active,
                })}
            ></span>

            <div
                part="popup"
                class=${classMap({
                    popup: true,
                    'popup--active': this.active,
                    'popup--fixed': this.strategy === 'fixed',
                    'popup--has-arrow': this.arrow,
                })}
                style=${styleOverride}
            >
                <slot></slot>
                ${this.arrow ? html`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ''}
            </div>
        `;
    }
}
