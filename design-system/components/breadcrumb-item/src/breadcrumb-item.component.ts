import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { HasSlotController } from '@utils/internal/slot.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import styles from './TsBreadcrumbItemStyle.js';

/**
 * @summary Breadcrumb Items are used inside [breadcrumbs](/components/breadcrumb) to represent different links.
 * @documentation https://create.tuvsud.com/latest/components/breadcrumb-item/develop-00VsYACc
 * @status stable
 * @since 1.0
 *
 * @slot - The breadcrumb item's label.
 * @slot prefix - An optional prefix, usually an icon or icon button.
 * @slot suffix - An optional suffix, usually an icon or icon button.
 * @slot separator - The separator to use for the breadcrumb item. This will only change the separator for this item. If
 * you want to change it for all items in the group, set the separator on `<ts-breadcrumb>` instead.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The breadcrumb item's label.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart suffix - The container that wraps the suffix.
 * @csspart separator - The container that wraps the separator.
 */

export default class TsBreadcrumbItemComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private readonly hasSlotController = new HasSlotController(this, 'prefix', 'suffix');

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('slot:not([name])') defaultSlot!: HTMLSlotElement;

    @state() private renderType: 'button' | 'link' | 'slotted-link' | 'dropdown' = 'button';

    /**
     * Optional URL to direct the user to when the breadcrumb item is activated. When set, a link will be rendered
     * internally. When unset, a button will be rendered instead.
     */
    @property() href?: string;

    /** Tells the browser where to open the link. Only used when `href` is set. */
    @property() target?: '_blank' | '_parent' | '_self' | '_top';

    /** The `rel` attribute to use on the link. Only used when `href` is set. */
    @property() rel = 'noreferrer noopener';

    override connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'listitem');
    }

    private setRenderType() {
        if (!this.defaultSlot) return;
        const elements = this.defaultSlot.assignedElements({ flatten: true });
        const dropdown = elements.find(e => e.tagName === 'TS-DROPDOWN');
        const slottedAnchor = elements.find(e => e.tagName === 'A');
        this.renderType = this.href ? 'link' : dropdown ? 'dropdown' : slottedAnchor ? 'slotted-link' : 'button';
    }

    @watch('href', { waitUntilFirstUpdate: true })
    hrefChanged() {
        this.setRenderType();
    }

    handleSlotChange() {
        this.setRenderType();
    }

    override render() {
        const hasPrefix = this.hasSlotController.test('prefix');
        const hasSuffix = this.hasSlotController.test('suffix');

        const classes = {
            'breadcrumb-item': true,
            'breadcrumb-item--has-prefix': hasPrefix,
            'breadcrumb-item--has-suffix': hasSuffix,
        };

        // Re-use already-queried elements from setRenderType to avoid calling assignedElements() again
        const dropdown =
            this.renderType === 'dropdown'
                ? this.defaultSlot?.assignedElements({ flatten: true }).find(e => e.tagName === 'TS-DROPDOWN')
                : undefined;

        return html`
            <span part="base" class=${classMap(classes)}>
                <span part="prefix" class="breadcrumb-item__prefix">
                    <slot name="prefix"></slot>
                </span>

                ${
                    this.renderType === 'link'
                        ? html`
                              <a
                                  part="label"
                                  class="breadcrumb-item__label breadcrumb-item__label--link"
                                  href="${this.href!}"
                                  target="${ifDefined(this.target)}"
                                  rel="${ifDefined(this.rel)}"
                              >
                                  <slot @slotchange=${this.handleSlotChange}></slot>
                              </a>
                          `
                        : this.renderType === 'button'
                          ? html`
                                <button
                                    part="label"
                                    type="button"
                                    class="breadcrumb-item__label breadcrumb-item__label--button"
                                >
                                    <slot @slotchange=${this.handleSlotChange}></slot>
                                </button>
                            `
                          : this.renderType === 'slotted-link'
                            ? html`<slot
                                  part="label"
                                  class="breadcrumb-item__label breadcrumb-item__label--link"
                                  @slotchange=${this.handleSlotChange}
                              ></slot>`
                            : html`${dropdown}`
                }

                <span part="suffix" class="breadcrumb-item__suffix">
                    <slot name="suffix"></slot>
                </span>

                <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
                    <slot name="separator"></slot>
                </span>
            </span>
        `;
    }
}
