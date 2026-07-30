import { css } from 'lit';

export default css`
    :host {
        --step-icon-size: 40px;
        --step-icon-radius: calc(var(--step-icon-size) / 2);
        --step-connector-thickness: 2px;
        --step-connector-v-top: var(--step-icon-size);
        --step-connector-v-left: calc(var(--step-icon-radius) - var(--step-connector-thickness) / 2);
        --step-connector-h-left: calc(50% + var(--step-icon-radius) + 2px);
        --step-connector-h-right: calc(-50% + var(--step-icon-radius) + 2px);
        --step-connector-h-top: calc(var(--step-icon-radius) - var(--step-connector-thickness) / 2);
        --step-icon-inner-size: calc(var(--step-icon-size) / 2);

        display: block;
        flex: 1;
        position: relative;
        min-height: 0;
    }

    .step {
        display: flex;
        align-items: flex-start;
        position: relative;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        outline: none;
    }

    .step--navigation:not(.step--disabled):focus-visible .step__icon {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
        border-radius: var(--step-icon-radius);
    }

    /* Make the vertical step fill the full :host height so the connector
       can use bottom:0 to reach the next step's icon */
    :host([orientation='vertical']) {
        display: flex;
        flex-direction: column;
    }

    :host([orientation='vertical']) .step--vertical {
        flex: 1;
    }

    .step--disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .step--horizontal {
        flex-direction: column;
        align-items: center;
        text-align: center;
        height: 100%;
    }

    .step--horizontal .step__content {
        margin-top: var(--ts-semantic-size-space-100);
    }

    /* Horizontal connector: spans from icon-edge to next icon-edge */
    .step--horizontal .step__connector {
        top: var(--step-connector-h-top);
        left: var(--step-connector-h-left);
        right: var(--step-connector-h-right);
        height: var(--step-connector-thickness);
    }

    .step--vertical {
        flex-direction: row;
        align-items: flex-start;
        height: 100%;
        min-height: calc(var(--step-icon-size) * 2);
    }

    .step--vertical.step--last {
        height: auto;
        min-height: unset;
    }

    .step--vertical .step__content {
        margin-left: var(--ts-semantic-size-space-200);
        margin-top: var(--ts-semantic-size-space-100);
        flex: 1;
        min-width: 0;
    }

    /* Vertical connector: from below icon down to the bottom of the step */
    .step--vertical .step__connector {
        top: calc(var(--step-connector-v-top) + 2px);
        left: var(--step-connector-v-left);
        width: var(--step-connector-thickness);
        bottom: 0;
        height: calc(var(--step-icon-size) - 4px);
    }

    .step__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--step-icon-size);
        height: var(--step-icon-size);
        border-radius: var(--step-icon-radius);
        background-color: var(--ts-core-color-neutral-200);
        color: var(--ts-semantic-color-text-base-default);
        --ts-icon-color: var(--ts-core-color-neutral-700);
        font-weight: var(--ts-font-weight-medium);
        font-size: var(--ts-font-size-200);
        flex-shrink: 0;
        transition:
            background-color var(--ts-semantic-transition-duration-medium),
            border-color var(--ts-semantic-transition-duration-medium),
            color var(--ts-semantic-transition-duration-medium);
        position: relative;
        z-index: 1;
        box-sizing: border-box;
    }

    .step__icon ts-icon {
        font-size: var(--step-icon-inner-size);
        color: inherit;
        display: flex;
    }

    /* Force slotted custom icons to inherit the container's text color
       (white on active / done / error / warning backgrounds) */
    .step__icon ::slotted(*) {
        color: inherit;
        fill: currentColor;
        --ts-icon-color: currentColor;
        font-size: var(--step-icon-inner-size);
        width: var(--step-icon-inner-size);
        height: var(--step-icon-inner-size);
    }

    .step__number {
        color: inherit;
        line-height: 1;
    }

    /* Active */
    .step--active .step__icon {
        background-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-core-color-neutral-0);
        --ts-icon-color: var(--ts-core-color-neutral-0);
        border-color: var(--ts-semantic-color-background-primary-default);
    }

    /* Done */
    .step--done .step__icon {
        background-color: var(--ts-semantic-color-background-success-default);
        color: var(--ts-core-color-neutral-0);
        --ts-icon-color: var(--ts-core-color-neutral-0);
        border-color: var(--ts-semantic-color-background-success-default);
    }

    /* Error */
    .step--error .step__icon {
        background-color: var(--ts-semantic-color-background-danger-default);
        color: var(--ts-core-color-neutral-0);
        --ts-icon-color: var(--ts-core-color-neutral-0);
        border-color: var(--ts-semantic-color-background-danger-default);
    }

    /* Warning */
    .step--warning .step__icon {
        background-color: var(--ts-semantic-color-background-warning-default);
        color: var(--ts-core-color-neutral-0);
        --ts-icon-color: var(--ts-core-color-neutral-0);
        border-color: var(--ts-semantic-color-background-warning-default);
    }

    /* Hover */
    .step:not(.step--disabled):hover .step__icon {
        filter: brightness(0.92);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .step--loading .step__icon ts-spinner {
        --track-color: rgba(255, 255, 255, 0.35);
        --indicator-color: currentColor;
        width: var(--step-icon-inner-size);
        height: var(--step-icon-inner-size);
        font-size: var(--step-icon-inner-size);
    }

    .step__connector {
        position: absolute;
        background-color: var(--ts-core-color-neutral-200);
        transition: background-color var(--ts-semantic-transition-duration-medium);
        z-index: 0;
        pointer-events: none;
    }

    .step--done .step__connector {
        background-color: var(--ts-semantic-color-background-success-default);
    }

    .step--error .step__connector {
        background-color: var(--ts-semantic-color-background-danger-default);
    }

    .step--warning .step__connector {
        background-color: var(--ts-semantic-color-background-warning-default);
    }

    .step__content {
        display: flex;
        flex-direction: column;
    }

    .step__label {
        font-weight: var(--ts-font-weight-medium);
        font-size: var(--ts-font-size-200);
        color: var(--ts-semantic-color-text-base-default);
        white-space: nowrap;
    }

    .step--active .step__label {
        color: var(--ts-semantic-color-text-base-default);
        font-weight: var(--ts-font-weight-bold);
    }

    .step--done .step__label {
        color: var(--ts-semantic-color-text-base-default);
    }

    .step--error .step__label {
        color: var(--ts-semantic-color-text-danger-default);
    }

    .step--warning .step__label {
        color: var(--ts-semantic-color-text-warning-default);
    }

    .step--disabled .step__label {
        color: var(--ts-semantic-color-text-base-disabled);
    }

    .step__description {
        font-size: var(--ts-font-size-100);
        color: var(--ts-core-color-neutral-500);
        line-height: 1.3;
    }

    .step--active .step__description {
        color: var(--ts-core-color-neutral-700);
    }

    .step--disabled .step__description {
        color: var(--ts-semantic-color-text-base-disabled);
    }

    .step--hide-content .step__content {
        display: none;
    }

    .step--secondary {
        flex-direction: row;
        align-items: center;
        padding-bottom: 0;
    }

    .step--secondary .step__icon {
        width: 10px;
        height: 10px;
        border-width: 0;
        background-color: var(--ts-core-color-neutral-300);
        color: transparent;
        transition:
            background-color var(--ts-semantic-transition-duration-medium),
            width var(--ts-semantic-transition-duration-medium),
            height var(--ts-semantic-transition-duration-medium);
    }

    .step--secondary.step--active .step__icon {
        background-color: var(--ts-semantic-color-background-primary-default);
        width: 12px;
        height: 12px;
    }

    .step--secondary.step--done .step__icon {
        background-color: var(--ts-semantic-color-background-success-default);
    }

    .step--secondary .step__content {
        display: none;
    }

    .step--secondary .step__connector {
        display: none;
    }

    @media (max-width: 768px) {
        .step--horizontal .step__content {
            display: none;
        }

        .step--horizontal {
            align-items: center;
        }
    }
`;
