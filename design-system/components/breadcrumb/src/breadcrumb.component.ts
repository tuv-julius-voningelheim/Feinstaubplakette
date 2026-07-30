import { html } from 'lit';
import { property, query } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';
import type { TsBreadcrumbItem } from '@components/breadcrumb-item/index.js';

import styles from './TsBreadcrumbStyle.js';

/**
 * @summary Breadcrumbs provide a group of links so users can easily navigate a website's hierarchy.
 * @documentation https://create.tuvsud.com/latest/components/breadcrumb/develop-6QQijER6
 * @status stable
 * @since 1.0
 *
 * @slot - One or more breadcrumb items to display.
 * @slot separator - The separator to use between breadcrumb items. Works best with `<ts-icon>`.
 *
 * @dependency ts-icon
 *
 * @csspart base - The component's base wrapper.
 */
export default class TsBreadcrumbComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon };

    private readonly localize = new LocalizeController(this);
    private separatorDir = this.localize.dir();

    @query('slot') defaultSlot!: HTMLSlotElement;
    @query('slot[name="separator"]') separatorSlot!: HTMLSlotElement;

    /**
     * The label to use for the breadcrumb control. This will not be shown on the screen, but it will be announced by
     * screen readers and other assistive devices to provide more context for users.
     */
    @property() label = '';

    // Generates a clone of the separator element to use for each breadcrumb item
    private getSeparator() {
        const separator = this.separatorSlot.assignedElements({
            flatten: true,
        })[0] as HTMLElement;

        // Clone it, remove ids, and slot it
        const clone = separator.cloneNode(true) as HTMLElement;
        [clone, ...clone.querySelectorAll('[id]')].forEach(el => el.removeAttribute('id'));
        clone.setAttribute('data-default', '');
        clone.slot = 'separator';

        return clone;
    }

    private handleSlotChange() {
        const items = [...this.defaultSlot.assignedElements({ flatten: true })].filter(
            item => item.tagName === 'TS-BREADCRUMB-ITEM',
        ) as TsBreadcrumbItem[];

        items.forEach((item, index) => {
            // Append separators to each item if they don't already have one
            const separator = item.querySelector('[slot="separator"]');
            if (separator === null) {
                // No separator exists, add one
                item.append(this.getSeparator());
            } else if (separator.hasAttribute('data-default')) {
                // A default separator exists, replace it
                separator.replaceWith(this.getSeparator());
            } else {
                // The user provided a custom separator, leave it alone
            }

            // The last breadcrumb item is the "current page"
            if (index === items.length - 1) {
                item.setAttribute('aria-current', 'page');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    override render() {
        // We clone the separator and inject them into breadcrumb items, so we need to regenerate the default ones when
        // directionality changes. We do this by storing the current separator direction, waiting for render,
        // then calling the function that regenerates them.
        const currentDir = this.localize.dir();
        if (this.separatorDir !== currentDir) {
            this.separatorDir = currentDir;
            this.updateComplete.then(() => this.handleSlotChange());
        }

        const ariaLabel = this.label && this.label.trim().length > 0 ? this.label : 'Breadcrumb';

        return html`
            <nav part="base" class="breadcrumb" aria-label=${ariaLabel}>
                <ol class="breadcrumb__list">
                    <slot @slotchange=${this.handleSlotChange}></slot>
                </ol>
            </nav>

            <span hidden aria-hidden="true">
                <slot name="separator">
                    <ts-icon
                        name=${currentDir === 'rtl' ? 'arrow_back_ios' : 'arrow_forward_ios'}
                        library="system"
                    ></ts-icon>
                </slot>
            </span>
        `;
    }
}
