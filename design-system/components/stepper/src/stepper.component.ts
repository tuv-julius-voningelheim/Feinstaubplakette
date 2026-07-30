import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import type { CSSResultGroup } from 'lit';

import ComponentElement from '@utils/internal/component-element.js';
import { watch } from '@utils/internal/watch.js';
import componentStyles from '@utils/styles/component-style.js';

import { TsButton } from '@components/button/index.js';
import { TsStep } from '@components/step/index.js';

import styles from './TsStepperStyles.js';

/**
 * @summary Steppers guide users through multi-step processes or workflows.
 * @status Beta
 * @since 1.18.0
 *
 * @dependency ts-icon
 * @dependency ts-step
 *
 * @slot - Used for grouping steps in the stepper. Must be `<ts-step>` elements.
 *
 * @event ts-select-step - Emitted when a step is selected.
 * @event ts-next-step - Emitted when navigating to the next step.
 * @event ts-prev-step - Emitted when navigating to the previous step.
 *
 * @csspart base - The component's base wrapper.
 * @csspart steps - The container that wraps all steps.
 * @csspart navigation - The navigation controls container (for secondary variant).
 * @csspart prev-button - The previous button.
 * @csspart next-button - The next button.
 * @csspart pagination - The pagination dots container (for secondary variant).
 */
export default class TsStepperComponent extends ComponentElement {
    static override styles: CSSResultGroup = [componentStyles, styles];
    static override dependencies = {
        'ts-button': TsButton,
        'ts-step': TsStep,
    };

    private mutationObserver!: MutationObserver;
    private steps: (typeof TsStep.prototype)[] = [];

    @query('.stepper') stepper!: HTMLElement;
    @query('.stepper__steps') stepsContainer!: HTMLSlotElement;

    @state() private canNavigatePrev = false;
    @state() private canNavigateNext = true;
    /** Text announced to screen readers when the active step changes. */
    @state() private liveText = '';

    /** The orientation of the stepper. */
    @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

    /** The current active step index (0-based). */
    @property({ type: Number, reflect: true, attribute: 'current-step' }) currentStep = 0;

    /** Whether navigation between steps is allowed via clicking. */
    @property({ type: Boolean, reflect: true }) navigation = false;

    /** The visual variant of the stepper. */
    @property({ reflect: true }) variant: 'primary' | 'secondary' = 'primary';

    /** Accessible label for the stepper landmark (default: "Progress steps"). */
    @property({ attribute: 'aria-label' }) override ariaLabel = 'Progress steps';

    @property({ type: String, attribute: 'next-label', reflect: true }) nextLabel = '';
    @property({ type: String, attribute: 'prev-label', reflect: true }) prevLabel = '';

    override connectedCallback() {
        super.connectedCallback();

        this.mutationObserver = new MutationObserver(mutations => {
            if (mutations.some(m => m.type === 'childList')) {
                this.syncSteps();
            }
        });

        this.updateComplete.then(() => {
            this.syncSteps();
            this.mutationObserver.observe(this, { childList: true, subtree: true });
        });

        // Listen on the host so slotted (Light DOM) step clicks bubble up correctly.
        this.addEventListener('click', this.handleStepSelect as EventListener);
        // Arrow-key navigation across steps.
        this.addEventListener('keydown', this.handleKeydown as EventListener);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.mutationObserver?.disconnect();
        this.removeEventListener('click', this.handleStepSelect as EventListener);
        this.removeEventListener('keydown', this.handleKeydown as EventListener);
    }

    private getAllSteps() {
        const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
        return (slot?.assignedElements() || []).filter(
            el => el.tagName.toLowerCase() === 'ts-step',
        ) as (typeof TsStep.prototype)[];
    }

    private syncSteps() {
        this.steps = this.getAllSteps();
        const total = this.steps.length;

        this.steps.forEach((step, index) => {
            step.index = index;
            step.totalSteps = total;
            step.active = index === this.currentStep;
            step.last = index === total - 1;
            step.orientation = this.orientation;
            step.variant = this.variant;
            step.navigation = this.navigation;

            if (!this.navigation) {
                step.style.cursor = 'default';
            } else {
                step.style.cursor = '';
            }
        });

        this.updateNavigationState();
    }

    private updateNavigationState() {
        this.canNavigatePrev = this.currentStep > 0;
        this.canNavigateNext = this.currentStep < this.steps.length - 1;
    }

    private handleStepSelect(event: MouseEvent) {
        if (!this.navigation) return;

        const step = (event.composedPath() as Element[]).find(el => el.tagName?.toLowerCase() === 'ts-step') as
            typeof TsStep.prototype | undefined;

        if (!step || step.disabled) return;

        const index = this.steps.indexOf(step);
        if (index !== -1) {
            this.setActiveStep(index);
            // Move focus to the newly activated step's inner icon element.
            this.steps[index]!.focusInner();
        }
    }

    /** Arrow-key roving tabindex: Left/Up moves back, Right/Down moves forward. */
    private handleKeydown = (event: KeyboardEvent) => {
        if (!this.navigation) return;

        const isHorizontal = this.orientation === 'horizontal';
        const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

        let target = -1;
        if (event.key === prevKey && this.canNavigatePrev) {
            target = this.currentStep - 1;
        } else if (event.key === nextKey && this.canNavigateNext) {
            target = this.currentStep + 1;
        } else if (event.key === 'Home') {
            target = 0;
        } else if (event.key === 'End') {
            target = this.steps.length - 1;
        }

        if (target !== -1 && !this.steps[target]?.disabled) {
            event.preventDefault();
            this.setActiveStep(target);
            this.syncSteps();
            this.steps[target]!.focusInner();
        }
    };

    private setActiveStep(index: number) {
        if (index < 0 || index >= this.steps.length) return;

        const previousStep = this.currentStep;
        this.currentStep = index;

        this.steps.forEach((step, i) => {
            step.active = i === this.currentStep;
        });

        this.updateNavigationState();

        // Update the live region so screen readers announce the new step.
        const step = this.steps[index];
        const label = step?.label || `Step ${index + 1}`;
        this.liveText = `${label}, step ${index + 1} of ${this.steps.length}`;

        this.emit('ts-select-step', {
            detail: { index: this.currentStep, previousIndex: previousStep },
        });
    }

    private handlePrevClick() {
        if (this.canNavigatePrev) {
            const previousIndex = this.currentStep;
            this.setActiveStep(this.currentStep - 1);
            this.emit('ts-prev-step', {
                detail: { index: this.currentStep, previousIndex },
            });
        }
    }

    private handleNextClick() {
        if (this.canNavigateNext) {
            const previousIndex = this.currentStep;
            this.setActiveStep(this.currentStep + 1);
            this.emit('ts-next-step', {
                detail: { index: this.currentStep, previousIndex },
            });
        }
    }

    @watch('currentStep')
    handleCurrentStepChange() {
        this.syncSteps();
    }

    @watch('orientation')
    @watch('variant')
    handleOrientationOrVariantChange() {
        this.syncSteps();
    }

    private renderPrimaryVariant() {
        return html`
            <div part="steps" class="stepper__steps" role="list" aria-label=${this.ariaLabel ?? 'Progress steps'}>
                <slot></slot>
            </div>
        `;
    }

    private renderSecondaryVariant() {
        return html`
            <div
                part="navigation"
                class="stepper__navigation"
                role="group"
                aria-label=${this.ariaLabel ?? 'Progress steps'}
            >
                <ts-button
                    part="prev-button"
                    ?disabled=${!this.canNavigatePrev}
                    @click=${this.handlePrevClick}
                    variant="text"
                >
                    <ts-icon slot="prefix" library="system" name="arrow_back_ios"></ts-icon>
                    ${this.prevLabel || 'Previous'}
                </ts-button>

                <div part="pagination" class="stepper__pagination" role="list">
                    <slot></slot>
                </div>

                <ts-button
                    part="next-button"
                    variant="primary"
                    ?disabled=${!this.canNavigateNext}
                    @click=${this.handleNextClick}
                >
                    <ts-icon slot="suffix" library="system" name="arrow_forward_ios"></ts-icon>
                    ${this.nextLabel || 'Next'}
                </ts-button>
            </div>
        `;
    }

    override render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    stepper: true,
                    'stepper--horizontal': this.orientation === 'horizontal',
                    'stepper--vertical': this.orientation === 'vertical',
                    'stepper--primary': this.variant === 'primary',
                    'stepper--secondary': this.variant === 'secondary',
                    'stepper--navigation': this.navigation,
                })}
            >
                ${this.variant === 'primary' ? this.renderPrimaryVariant() : this.renderSecondaryVariant()}
            </div>

            <!-- Polite live region: announces step changes to screen readers without interrupting. -->
            <div class="stepper__live" role="status" aria-live="polite" aria-atomic="true">${this.liveText}</div>
        `;
    }
}
