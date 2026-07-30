import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .stepper {
        display: flex;
        width: 100%;
    }

    /* Horizontal orientation */
    .stepper--horizontal {
        flex-direction: column;
    }

    .stepper--horizontal .stepper__steps {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0;
        width: 100%;
    }

    .stepper--horizontal .stepper__steps::slotted(ts-step) {
        flex: 1 1 0;
        min-width: 0;
    }

    /* Vertical orientation */
    .stepper--vertical {
        flex-direction: row;
        height: 100%;
    }

    .stepper--vertical .stepper__steps {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
        height: 100%;
    }

    .stepper--vertical .stepper__steps::slotted(ts-step) {
        flex: 1 1 0;
        min-height: 0;
    }

    /* Primary variant */
    .stepper--primary .stepper__steps {
        width: 100%;
    }

    /* Secondary variant - navigation with pagination */
    .stepper--secondary .stepper__navigation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ts-semantic-size-space-100);
        width: 100%;
        padding: var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-200);
    }

    .stepper__pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ts-semantic-size-space-200);
        margin: 0 auto;
    }

    .stepper__pagination::slotted(ts-step) {
        flex: 0 0 auto;
    }

    .stepper__nav-button {
        flex-shrink: 0;
    }

    .stepper__nav-button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Non-navigable stepper */
    .stepper:not(.stepper--navigation) ::slotted(ts-step) {
        cursor: default;
        pointer-events: none;
    }

    /* Allow navigation */
    .stepper--navigation ::slotted(ts-step) {
        cursor: pointer;
        pointer-events: auto;
    }

    .stepper--navigation ::slotted(ts-step[disabled]) {
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Visually hidden live region – present in the a11y tree, invisible on screen */
    .stepper__live {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
