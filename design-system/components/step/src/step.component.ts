import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsIcon } from '@components/icon/index.js';
import { TsSpinner } from '@components/spinner/src/TsSpinner.js';

import styles from './TsStepStyles.js';

let id = 0;

/**
 * @summary Steps are used inside [stepper](/components/stepper) to represent individual steps in a process.
 * @status Beta
 * @since 1.18.0
 *
 * @dependency ts-icon
 *
 * @slot - The step's label content.
 * @slot icon - Custom icon for the default state.
 * @slot icon-done - Custom icon for the done state.
 * @slot icon-warning - Custom icon for the warning state.
 * @slot icon-error - Custom icon for the error state.
 *
 * @event ts-select-step - Emitted when the step is clicked.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The step icon container.
 * @csspart content - The content container for label and description.
 * @csspart label - The step label.
 * @csspart description - The step description.
 * @csspart connector - The connector line between steps.
 */
export default class TsStepComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = { 'ts-icon': TsIcon, 'ts-spinner': TsSpinner };

    private readonly attrId = ++id;
    private readonly componentId = `ts-step-${this.attrId}`;

    @query('.step') stepEl!: HTMLElement;

    /** Whether the step is currently active. */
    @property({ type: Boolean, reflect: true }) active = false;

    /** The state of the step. */
    @property({ reflect: true }) state: 'default' | 'done' | 'error' | 'warning' = 'default';

    /** Whether this is the last step (set automatically by the parent stepper). */
    @property({ type: Boolean, reflect: true }) last = false;

    /** The index of the step (set automatically by the parent stepper). */
    @property({ type: Number, reflect: true }) index = 0;

    /** Total number of steps (set automatically by the parent stepper). */
    @property({ type: Number, reflect: true, attribute: 'total-steps' }) totalSteps = 0;

    /** Disables the step and prevents interaction. */
    @property({ type: Boolean, reflect: true }) disabled = false;

    /** The label text for the step. */
    @property() label = '';

    /** The description text for the step. */
    @property() description = '';

    /** The orientation of the step (set automatically by the parent stepper). */
    @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

    /** The variant of the stepper (set automatically by the parent stepper). */
    @property({ reflect: true }) variant: 'primary' | 'secondary' = 'primary';

    /** Hides the label and description, showing only the icon. */
    @property({ type: Boolean, reflect: true, attribute: 'hide-content' }) hideContent = false;

    /** Shows a loading spinner instead of the icon. */
    @property({ type: Boolean, reflect: true }) loading = false;

    /** Whether navigation between steps is allowed via clicking. */
    @property({ type: Boolean, reflect: true }) navigation = false;

    override connectedCallback() {
        super.connectedCallback();
        // role="none" on the host removes it from the a11y tree so axe never
        // fires aria-required-parent for "listitem needs list parent".
        // All semantic roles live on the inner .step div inside shadow DOM,
        // which is a genuine child of role="list" on .stepper__steps.
        this.setAttribute('role', 'none');
        this.addEventListener('keydown', this.handleKeydown);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('keydown', this.handleKeydown);
    }

    private handleClick() {
        // Intentionally empty – the parent stepper handles step selection
        // via click event bubbling so that ts-select-step is emitted exactly once.
    }

    private handleKeydown = (event: KeyboardEvent) => {
        if ((event.key === 'Enter' || event.key === ' ') && !this.disabled) {
            event.preventDefault();
            this.click();
        }
    };

    /** Focus the inner .step div (shadow DOM) directly. */
    focusInner() {
        this.stepEl?.focus();
    }

    /** Sync all ARIA attributes onto the inner .step div (shadow DOM). */
    private syncStepAria() {
        const el = this.stepEl;
        if (!el) return;

        // aria-current="step" is the WCAG wizard/stepper pattern.
        el.setAttribute('aria-current', this.active ? 'step' : 'false');

        // Roving tabindex: active step is focusable, others are not.
        el.setAttribute('tabindex', this.active && !this.disabled ? '0' : '-1');

        el.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');

        if (this.totalSteps > 0) {
            el.setAttribute('aria-posinset', String(this.index + 1));
            el.setAttribute('aria-setsize', String(this.totalSteps));
        }
    }

    @watch('active')
    handleActiveChange() {
        this.syncStepAria();
    }

    @watch('disabled')
    handleDisabledChange() {
        this.syncStepAria();
    }

    @watch('index')
    @watch('totalSteps')
    handlePositionChange() {
        this.syncStepAria();
    }

    /** Returns a human-readable state suffix for the accessible label. */
    private get stateLabel(): string {
        if (this.loading) return 'Loading';
        switch (this.state) {
            case 'done':
                return 'Completed';
            case 'error':
                return 'Error';
            case 'warning':
                return 'Warning';
            default:
                return '';
        }
    }

    private renderIcon() {
        const hasIconSlot = this.querySelector('[slot="icon"]');
        const hasDoneSlot = this.querySelector('[slot="icon-done"]');
        const hasWarningSlot = this.querySelector('[slot="icon-warning"]');
        const hasErrorSlot = this.querySelector('[slot="icon-error"]');

        if (this.variant === 'secondary') {
            return html``;
        }

        if (this.loading) {
            return html`<ts-spinner></ts-spinner>`;
        }

        if (this.state === 'done' && hasDoneSlot) {
            return html`<slot name="icon-done"></slot>`;
        }

        if (this.state === 'warning' && hasWarningSlot) {
            return html`<slot name="icon-warning"></slot>`;
        }

        if (this.state === 'error' && hasErrorSlot) {
            return html`<slot name="icon-error"></slot>`;
        }

        if (hasIconSlot) {
            return html`<slot name="icon"></slot>`;
        }

        if (this.state === 'done') {
            return html`<ts-icon name="check" size="18" library="system"></ts-icon>`;
        }

        if (this.state === 'warning') {
            return html`<ts-icon name="warning" size="18" library="system"></ts-icon>`;
        }

        if (this.state === 'error') {
            return html`<ts-icon name="close" size="18" library="system"></ts-icon>`;
        }

        return html`<span class="step__number" aria-hidden="true">${this.index + 1}</span>`;
    }

    override render() {
        this.id = this.id.length > 0 ? this.id : this.componentId;

        // Build a descriptive label: "Address – Enter your address – Completed"
        const parts: string[] = [];
        if (this.label) parts.push(this.label);
        if (this.description) parts.push(this.description);
        const stateLabel = this.stateLabel;
        if (stateLabel) parts.push(stateLabel);
        const stepAriaLabel = parts.length ? parts.join(' – ') : `Step ${this.index + 1}`;

        return html`
            <div
                part="base"
                role="listitem"
                tabindex=${this.active && !this.disabled ? '0' : '-1'}
                aria-current=${this.active ? 'step' : 'false'}
                aria-disabled=${this.disabled ? 'true' : 'false'}
                aria-label=${stepAriaLabel}
                aria-posinset=${this.totalSteps > 0 ? String(this.index + 1) : ''}
                aria-setsize=${this.totalSteps > 0 ? String(this.totalSteps) : ''}
                class=${classMap({
                    step: true,
                    'step--active': this.active,
                    'step--disabled': this.disabled,
                    'step--done': this.state === 'done',
                    'step--error': this.state === 'error',
                    'step--warning': this.state === 'warning',
                    'step--horizontal': this.orientation === 'horizontal',
                    'step--vertical': this.orientation === 'vertical',
                    'step--primary': this.variant === 'primary',
                    'step--secondary': this.variant === 'secondary',
                    'step--last': this.last,
                    'step--hide-content': this.hideContent,
                    'step--loading': this.loading,
                    'step--navigation': this.navigation,
                })}
                @click=${this.handleClick}
            >
                <div part="icon" class="step__icon" aria-hidden="true">${this.renderIcon()}</div>

                ${
                    this.variant === 'primary' && !this.last
                        ? html`<div part="connector" class="step__connector" aria-hidden="true"></div>`
                        : ''
                }
                ${
                    !this.hideContent
                        ? html`
                              <div part="content" class="step__content">
                                  ${
                                      this.label
                                          ? html`<div part="label" class="step__label">${this.label}</div>`
                                          : html`<slot></slot>`
                                  }
                                  ${
                                      this.description
                                          ? html`<div part="description" class="step__description">
                                                ${this.description}
                                            </div>`
                                          : ''
                                  }
                              </div>
                          `
                        : ''
                }
            </div>
        `;
    }
}
