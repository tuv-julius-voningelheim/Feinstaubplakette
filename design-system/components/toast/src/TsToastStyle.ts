import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        --toast-distance: 20px;
    }

    .toast {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ts-semantic-size-space-400);
        padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);
        background-color: var(--ts-semantic-color-background-primary-subtle-default);
        border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-primary-default);
        border-radius: var(--ts-semantic-size-radius-md);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        line-height: var(--ts-line-height-200);
        color: var(--ts-semantic-color-text-base-default);
        margin: 0;
        overflow: hidden;
        width: 400px;
        pointer-events: auto;
    }

    .toast:not(.toast--has-icon) .toast__icon,
    .toast:not(.toast--closable) .toast__close-button {
        display: none;
    }

    :host([disabled]) {
        cursor: not-allowed;
        user-select: none;
    }

    .toast__icon {
        flex: 0 0 auto;
        display: flex;
        align-self: center;
        align-items: center;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        line-height: 1.6;
    }

    .toast__icon--spinner {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toast--primary {
        border-color: var(--ts-semantic-color-border-primary-default);
    }

    .toast--primary .toast__icon {
        color: var(--ts-semantic-color-icon-primary-default);
        --icon-color: var(--ts-semantic-color-icon-primary-default);
    }

    .toast--success {
        border-color: var(--ts-semantic-color-border-success-default);
        background-color: var(--ts-semantic-color-background-success-subtle-default);
    }

    .toast--success .toast__icon {
        color: var(--ts-semantic-color-icon-success-default);
        --icon-color: var(--ts-semantic-color-icon-success-default);
    }

    .toast--neutral {
        border-color: var(--ts-semantic-color-border-neutral-default);
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
    }

    .toast--neutral .toast__icon {
        color: var(--ts-semantic-color-icon-neutral-default);
        --icon-color: var(--ts-semantic-color-icon-neutral-default);
    }

    .toast--warning {
        border-color: var(--ts-semantic-color-border-warning-default);
        background-color: var(--ts-semantic-color-background-warning-subtle-default);
    }

    .toast--warning .toast__icon {
        color: var(--ts-semantic-color-icon-warning-default);
        --icon-color: var(--ts-semantic-color-icon-warning-default);
    }

    .toast--danger {
        border-color: var(--ts-semantic-color-border-danger-default);
        background-color: var(--ts-semantic-color-background-danger-subtle-default);
    }

    .toast--danger .toast__icon {
        color: var(--ts-semantic-color-icon-danger-default);
        --icon-color: var(--ts-semantic-color-icon-danger-default);
    }

    .toast__message {
        flex: 1 1 auto;
        display: block;
    }

    .toast__close-button {
        flex: 0 0 auto;
        display: flex;
        align-self: center;
        align-items: center;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        line-height: 1.6;
        margin-top: 0.1em;
    }

    .toast--primary .toast__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-primary-default);
    }

    .toast--success .toast__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-success-default);
    }

    .toast--neutral .toast__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-neutral-default);
    }

    .toast--warning .toast__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-warning-default);
    }

    .toast--danger .toast__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-danger-default);
    }
`;
