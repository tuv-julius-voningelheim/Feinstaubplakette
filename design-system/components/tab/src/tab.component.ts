import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { LocalizeController } from '@utils/internal/localize.js';
import { watch } from '@utils/internal/watch.js';
import { SlotTextNormalizeController } from '@utils/slots/SlotTextNormalizeController.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIconButton } from '@components/icon-button/index.js';

import styles from './TsTabStyles.js';

let id = 0;

/**
 * @summary Tabs are used inside [tab groups](/components/tab-group) to represent and activate
 * [tab panels](/components/tab-panel).
 * @documentation https://create.tuvsud.com/latest/components/tab/develop-N19cTdTD
 * @status stable
 * @since 1.0
 *
 * @dependency ts-icon-button
 *
 * @slot - The tab's label.
 *
 * @event ts-close - Emitted when the tab is closable and the close button is activated.
 * @event ts-tab-click - Emitted when the tab is clicked.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-button - The close button, an `<ts-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 */
export default class TsTabComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon-button': TsIconButton };

    private readonly localize = new LocalizeController(this);

    private readonly attrId = ++id;
    private readonly componentId = `ts-tab-${this.attrId}`;

    // Normalize whitespace in the default slot to prevent layout issues caused by unintended spaces.
    private readonly normalizeLabelSlot = new SlotTextNormalizeController(this, 'slot:not([name])', {
        trim: true,
        collapse: true,
    });

    @query('.tab') tab!: HTMLElement;

    /** The name of the tab panel this tab is associated with. The panel must be located in the same tab group. */
    @property({ reflect: true }) panel = '';

    /** Draws the tab in an active state. */
    @property({ type: Boolean, reflect: true }) active = false;

    /** Makes the tab closable and shows a close button. */
    @property({ type: Boolean, reflect: true }) closable = false;

    /** Disables the tab and prevents selection. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** The placement of the tab group (set automatically by the parent tab group). */
    @property({ reflect: true }) placement: 'top' | 'bottom' | 'start' | 'end' = 'top';

    /**
     * @internal
     * Need to wrap in a `@property()` otherwise CustomElement throws a "The result must not have attributes"
     * runtime error.
     */
    @property({ type: Number, reflect: true }) override tabIndex = 0;

    override connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'tab');
        // Set stable id once on connect instead of mutating it inside render() on every update
        if (!this.id) {
            this.id = this.componentId;
        }
    }

    private handleCloseClick(event: Event) {
        event.stopPropagation();
        this.emit('ts-close');
    }

    private handleClick() {
        this.emit('ts-tab-click');
    }

    @watch('active')
    handleActiveChange() {
        this.setAttribute('aria-selected', this.active ? 'true' : 'false');
    }

    @watch('disabled')
    handleDisabledChange() {
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');

        if (this.disabled && !this.active) {
            this.tabIndex = -1;
        } else {
            this.tabIndex = 0;
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (!this.closable) return;
        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            this.emit('ts-close');
        }
    }

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    tab: true,
                    'tab--active': this.active,
                    'tab--closable': this.closable,
                    'tab--disabled': this.disabled,
                    'tab-top': this.placement === 'top',
                    'tab-bottom': this.placement === 'bottom',
                    'tab-start': this.placement === 'start',
                    'tab-end': this.placement === 'end',
                })}
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
            >
                <slot></slot>

                ${
                    this.closable
                        ? html`
                              <span part="close-button" class="tab__close-button" @click=${this.handleCloseClick}>
                                  <ts-icon-button
                                      name="close"
                                      label=${this.localize.term('close')}
                                      library="system"
                                      inert
                                      tabindex="-1"
                                  ></ts-icon-button>
                              </span>
                          `
                        : ''
                }
            </div>
        `;
    }
}
