import { css } from 'lit';

export default css`
    :host {
        --error-color: var(--ts-semantic-color-icon-danger-default);
        --success-color: var(--ts-semantic-color-icon-success-default);

        display: inline-block;
    }

    .copy-button__button {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: inherit;
        color: var(--ts-semantic-color-text-base-default);
        padding: var(--ts-semantic-size-space-300);
        cursor: pointer;
        transition: var(--ts-semantic-transition-duration-xfast) color;
    }

    .copy-button--success .copy-button__button {
        color: var(--success-color);
    }

    .copy-button--error .copy-button__button {
        color: var(--error-color);
    }

    .copy-button__button:hover:not([disabled]) {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .copy-button__button:active:not([disabled]) {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .copy-button__button:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .copy-button__button[disabled] {
        opacity: 0.5;
        cursor: not-allowed !important;
    }

    slot {
        display: inline-flex;
    }
`;
