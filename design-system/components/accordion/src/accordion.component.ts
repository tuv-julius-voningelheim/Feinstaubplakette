import { html } from 'lit';
import { property, query } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import componentStyles from '@utils/styles/component-style.js';

import type { TsAccordionItem } from '@components/accordion-item/index.js';

import styles from './TsAccordionStyle.js';

/**
 * @summary Accordion groups multiple accordion-items together and manages their open/close behavior.
 * @documentation https://create.tuvsud.com/latest/components/accordion/develop-8AOCwFEd
 * @status stable
 * @since 1.0
 *
 * @dependency ts-accordion-item
 *
 * @slot - The accordion's main content where one or more `<ts-accordion-item>` elements are placed.
 *
 * @property label - The accessible label for the accordion group.
 * @property behavior - Determines whether multiple items can be open at once (`multiple`) or only one (`single`).
 * @property variant - Visual variant applied to all accordion items (`primary` | `secondary`).
 *
 * @event ts-show - Emitted when an accordion-item opens (handled internally for single behavior).
 *
 * @csspart base - The accordion's main container.
 *
 * @animation none - The accordion itself does not animate; animations occur within each accordion-item.
 */

export default class TsAccordionComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];

    private readonly localize = new LocalizeController(this);

    @query('slot') defaultSlot!: HTMLSlotElement;

    @property() label = '';

    @property({ reflect: true }) behavior: 'single' | 'multiple' = 'multiple';

    @property({ reflect: true }) variant: 'primary' | 'secondary' | 'actions' = 'primary';

    private handleItemShow = (ev: Event) => {
        if (this.behavior !== 'single') return;
        const target = ev.target as TsAccordionItem;
        const items = this.getItems();
        for (const item of items) {
            if (item !== target) item.open = false;
        }
    };

    private getItems(): TsAccordionItem[] {
        return [...this.defaultSlot.assignedElements({ flatten: true })].filter(
            el => el.tagName === 'TS-ACCORDION-ITEM',
        ) as TsAccordionItem[];
    }

    private applyGroupState() {
        const items = this.getItems();
        for (const item of items) {
            // Only set the attribute when the value actually differs to avoid
            // triggering unnecessary re-renders on accordion-item children.
            if (item.getAttribute('variant') !== this.variant) {
                item.setAttribute('variant', this.variant);
            }
        }
    }

    private handleSlotChange() {
        const items = this.getItems();
        for (const item of items) {
            item.removeEventListener('ts-show', this.handleItemShow as EventListener);
            item.addEventListener('ts-show', this.handleItemShow as EventListener, { once: false });
        }
        this.applyGroupState();
    }

    protected override updated(changed: Map<string, unknown>) {
        if (changed.has('variant')) {
            this.applyGroupState();
        }
    }

    override render() {
        const ariaLabel = this.label && this.label.trim().length > 0 ? this.label : 'Accordion';
        return html`
            <div part="base" class="accordion" role="group" aria-label=${ariaLabel}>
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `;
    }
}
