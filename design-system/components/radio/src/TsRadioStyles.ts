import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    :host(:focus-visible) {
        outline: 0;
    }

    .radio {
        display: inline-flex;
        align-items: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        color: var(--ts-semantic-color-text-base-default);
        cursor: pointer;
    }

    .radio--small {
        --radio-size: 18px;
        --radio-dot-size: 10px;
        font-size: var(--ts-font-size-100);
        line-height: 16px;
    }

    .radio--medium {
        --radio-size: 20px;
        --radio-dot-size: 12px;
        font-size: var(--ts-font-size-200);
        line-height: 20px;
    }

    .radio--large {
        --radio-size: 20px;
        --radio-dot-size: 12px;
        font-size: var(--ts-font-size-300);
        line-height: 24px;
    }

    .radio__input {
        position: absolute;
        opacity: 0;
        margin: 0;
        pointer-events: none;
    }

    .radio__checked-icon {
        display: none;
    }

    .radio__control {
        position: relative;
        flex: 0 0 auto;
        width: var(--radio-size);
        height: var(--radio-size);
        border: 2px solid var(--ts-semantic-color-border-base-default);
        border-radius: 50%;
        background: var(--ts-semantic-color-background-base-default);
        box-sizing: border-box;
        transition:
            border-color var(--ts-semantic-transition-duration-fast),
            box-shadow var(--ts-semantic-transition-duration-fast),
            background-color var(--ts-semantic-transition-duration-fast);
    }

    .radio__control::after {
        content: '';
        position: absolute;
        inset: 0;
        margin: auto;
        width: var(--radio-dot-size);
        height: var(--radio-dot-size);
        border-radius: 50%;
        background: transparent;
        transform: scale(0);
        transition:
            transform var(--ts-semantic-transition-duration-fast),
            background-color var(--ts-semantic-transition-duration-fast);
    }

    .radio__label {
        margin-inline-start: var(--ts-semantic-size-space-300, 8px);
        user-select: none;
        -webkit-user-select: none;
    }

    .radio:not(.radio--checked):not(.radio--disabled):hover .radio__control {
        border-color: var(--ts-semantic-color-border-base-hover);
        background: var(--ts-semantic-color-background-base-hover);
    }

    /* Error + hover — darker danger border, no primary override */
    .radio.radio--error:not(.radio--disabled):hover .radio__control {
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    .radio--checked .radio__control {
        border-color: var(--ts-semantic-color-border-primary-default);
        background: var(--ts-semantic-color-background-base-default);
    }

    .radio--checked .radio__control::after {
        background: var(--ts-semantic-color-background-primary-default);
        transform: scale(1);
        opacity: 0.9;
    }

    .radio.radio--checked:not(.radio--disabled):hover .radio__control::after {
        background: var(--ts-semantic-color-background-primary-hover);
    }

    :host(:focus-visible) .radio__control,
    :host(:focus-visible:not([error])) .radio__control,
    :host([error]:focus-visible) .radio__control {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 2px;
        box-shadow: none;
    }

    /* Disabled */
    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .radio--disabled {
        pointer-events: none;
    }

    .radio--error .radio__control {
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .radio--error.radio--checked .radio__control {
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .radio--error.radio--checked .radio__control::after {
        background: var(--ts-semantic-color-background-danger-default);
        opacity: 0.9;
    }

    /* Error + checked + hover — dot shows danger hover color */
    .radio.radio--error.radio--checked:not(.radio--disabled):hover .radio__control::after {
        background: var(--ts-semantic-color-background-danger-hover);
    }

    /* Error + focus — handled by the unified focus rule above */

    /* Help text */
    .radio__help_text {
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .radio--small ~ .radio__help_text {
        padding-inline-start: calc(18px + 9px);
        font-size: var(--ts-font-size-100);
    }

    .radio--medium ~ .radio__help_text {
        padding-inline-start: calc(20px + 8px);
        font-size: var(--ts-font-size-100);
    }

    .radio--large ~ .radio__help_text {
        padding-inline-start: calc(20px + 9px);
        font-size: var(--ts-font-size-200);
    }

    /* Error message — same layout as help text, danger color */
    .radio__error-message {
        color: var(--ts-semantic-color-text-danger-default);
    }

    .radio--small ~ .radio__error-message {
        padding-inline-start: calc(18px + 9px);
        font-size: var(--ts-font-size-100);
    }

    .radio--medium ~ .radio__error-message {
        padding-inline-start: calc(20px + 9px);
        font-size: var(--ts-font-size-100);
    }

    .radio--large ~ .radio__error-message {
        padding-inline-start: calc(20px + 9px);
        font-size: var(--ts-font-size-200);
    }

    /* Visually hidden utility */
    .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
