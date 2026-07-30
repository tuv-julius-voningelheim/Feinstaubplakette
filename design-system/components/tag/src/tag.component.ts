import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsTagStyle.js';

/**
 * @summary Tags are used as labels to organize things or to indicate a selection.
 * @documentation https://create.tuvsud.com/latest/components/tag/develop-HkFpTgIR
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 *
 * @slot - The tag's content.
 * @slot prefix - An optional prefix icon or element.
 *
 * @event ts-remove - Emitted when the remove button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart content - The tag's content.
 * @csspart remove-button - The tag's remove button, an `<ts-icon-button>`.
 * @csspart remove-button__base - The remove button's exported `base` part.
 *
 * @cssproperty --ts-tag-bg-color - Overrides the tag's background color.
 * @cssproperty --ts-tag-font-color - Overrides the tag's text color.
 * @cssproperty --ts-tag-border-color - Overrides the tag's border color.
 */
export default class TsTagComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton };

    private readonly localize = new LocalizeController(this);

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    /** The tag's theme variant. */
    @property({ reflect: true }) variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text' = 'neutral';

    /** The tag's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

    /** Draws a pill-style tag with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false;

    /** Makes the tag removable and shows a remove button. */
    @property({ type: Boolean }) removable = false;

    /** Controls whether the tag has a border. */
    @property({ type: Boolean, reflect: true, attribute: 'has-border' }) hasBorder = true;

    /**
     * Custom background color. Maps to `--ts-tag-bg-color`.
     * You can also set it directly via `style="--ts-tag-bg-color: ..."`.
     */
    @property({ type: String, attribute: 'color' }) color = '';

    /**
     * Custom font color. Maps to `--ts-tag-font-color`.
     * You can also set it directly via `style="--ts-tag-font-color: ..."`.
     */
    @property({ type: String, attribute: 'font-color' }) fontColor = '';

    /**
     * Custom border color. Maps to `--ts-tag-border-color`.
     * You can also set it directly via `style="--ts-tag-border-color: ..."`.
     */
    @property({ type: String, attribute: 'border-color' }) borderColor = '';

    private handleRemoveClick() {
        this.emit('ts-remove');
    }

    private getCustomColorStyles(): Record<string, string> {
        const computed = getComputedStyle(this);
        const inlineStyles: Record<string, string> = {};

        // Props take top priority
        const bg = this.color || computed.getPropertyValue('--ts-tag-bg-color').trim();
        const font = this.fontColor || computed.getPropertyValue('--ts-tag-font-color').trim();
        const border = this.borderColor || computed.getPropertyValue('--ts-tag-border-color').trim();

        if (bg) inlineStyles['background-color'] = bg;
        if (font) inlineStyles['color'] = font;
        if (border) inlineStyles['border-color'] = border;

        return inlineStyles;
    }

    private hasCustomColors(): boolean {
        return !!(this.color || this.fontColor || this.borderColor);
    }

    override render() {
        const customStyles = this.getCustomColorStyles();

        return html`
            <span
                part="base"
                class=${classMap({
                    tag: true,
                    'tag--primary': this.variant === 'primary',
                    'tag--success': this.variant === 'success',
                    'tag--neutral': this.variant === 'neutral',
                    'tag--warning': this.variant === 'warning',
                    'tag--danger': this.variant === 'danger',
                    'tag--text': this.variant === 'text',
                    'tag--small': this.size === 'small',
                    'tag--medium': this.size === 'medium',
                    'tag--large': this.size === 'large',
                    'tag--pill': this.pill,
                    'tag--removable': this.removable,
                    'tag--no-border': !this.hasBorder,
                    'tag--custom': this.hasCustomColors(),
                })}
                style=${styleMap(customStyles)}
            >
                <slot name="prefix" part="prefix" class="tag__prefix"></slot>

                <slot part="content" class="tag__content"></slot>

                ${
                    this.removable
                        ? html`
                              <ts-icon-button
                                  part="remove-button"
                                  exportparts="base:remove-button__base"
                                  name="close"
                                  library="system"
                                  label=${this.localize.term('remove')}
                                  class="tag__remove"
                                  size=${this.size === 'small' ? '14' : this.size === 'medium' ? '20' : '24'}
                                  @click=${this.handleRemoveClick}
                              ></ts-icon-button>
                          `
                        : ''
                }
            </span>
        `;
    }
}
