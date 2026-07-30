import { type CSSResultGroup, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type { PropertyValues } from 'lit';

import { getShortcutLabel, loadCalendarLocale } from '@utils/date/calendar-i18n.js';

import TsTagComponent from '@components/tag/src/tag.component.js';

import styles from './TsDateShortcutsStyle.js';

/**
 * @summary Displays a row of predefined date range shortcuts using tags for quick selection.
 * @documentation https://create.tuvsud.com/latest/components/date-range-picker/develop-vo4zlBb4
 * @status stable
 * @since 1.0
 * @access private
 *
 * @dependency ts-tag
 *
 * @slot - The component renders a generated list of shortcut tags. No user-provided slots are used.
 *
 * @event ts-shortcut-select - Emitted when a shortcut is clicked. Provides `{ index }`.
 *
 * @csspart base - The root wrapper that contains all shortcuts.
 *
 * @animation date-shortcuts.show - Optional: animations may be applied when shortcuts appear.
 *
 * @property shortcuts - A list of numeric shortcut identifiers.
 * @property locale - Current locale used to resolve shortcut labels.
 * @property size - Size of the rendered tags.
 */

export default class TsDateShortcutComponent extends LitElement {
    static override styles: CSSResultGroup = [styles];

    static dependencies = { 'ts-tag': TsTagComponent };

    /** A list of numeric shortcut identifiers used to generate the shortcut tags. */
    @property({ type: Array }) shortcuts: number[] = [];
    /** The active locale used to resolve shortcut labels. */
    @property({ type: String }) locale = 'en';
    /** The size of the rendered tags (`'small'`, `'medium'`, or `'large'`). */
    @property({ type: String }) size = 'medium';

    protected override willUpdate(changed: PropertyValues) {
        if (changed.has('locale')) {
            loadCalendarLocale(this.locale).then(() => this.requestUpdate());
        }
    }

    private onSelectShortcut(i: number) {
        this.dispatchEvent(
            new CustomEvent('ts-shortcut-select', {
                detail: { index: i },
                bubbles: true,
                composed: true,
            }),
        );
    }

    override render() {
        const limited = this.shortcuts.slice(0, 7);
        const validShortcuts = limited.filter(i => getShortcutLabel(this.locale, i));

        return html`
            <div class="shortcuts-root">
                ${validShortcuts.map(i => {
                    const label = getShortcutLabel(this.locale, i);

                    return html`
                        <span
                            class="shortcut-focus"
                            tabindex="0"
                            role="button"
                            aria-label=${label}
                            @click=${() => this.onSelectShortcut(i)}
                            @keydown=${(e: KeyboardEvent) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    this.onSelectShortcut(i);
                                }
                            }}
                        >
                            <ts-tag .hasBorder=${false} .pill=${true} .size=${this.size} variant="neutral">
                                ${label}
                            </ts-tag>
                        </span>
                    `;
                })}
            </div>
        `;
    }
}
