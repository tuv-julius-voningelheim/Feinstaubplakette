import { css } from 'lit';

export default css`
    :host {
        display: contents;
        margin: 0;
    }

    :host([placement='top']) .alert {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        margin: 0;
        border: none;
        border-radius: 0;
        z-index: var(--ts-semantic-distance-zindex-toast, 1000);
    }

    .alert {
        position: relative;
        background-color: var(--ts-semantic-color-background-primary-subtle-default);
        border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-primary-default);
        border-radius: var(--ts-semantic-size-radius-md);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        line-height: 1.6;
        color: var(--ts-semantic-color-text-base-default);
        overflow: hidden;
        min-height: 64px;

        display: flex;
        padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--ts-semantic-size-space-400);
        flex: 1 0 0;
        align-self: stretch;
    }

    @media (max-width: 768px) {
        .alert {
            padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400);
        }
    }

    .alert:not(.alert--has-icon) .alert__icon,
    .alert:not(.alert--closable) .alert__close-button {
        display: none;
    }

    .alert__icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
        width: 24px;
        height: 24px;
        min-height: 40px;
    }

    .alert--has-countdown {
        border-bottom: none;
    }

    .alert--primary {
        border-color: var(--ts-semantic-color-border-primary-default);
    }

    .alert--primary .alert__icon {
        color: var(--ts-semantic-color-icon-primary-default);
        --icon-color: var(--ts-semantic-color-icon-primary-default);
    }

    .alert--success {
        border-color: var(--ts-semantic-color-border-success-default);
        background-color: var(--ts-semantic-color-background-success-subtle-default);
    }

    .alert--success .alert__icon {
        color: var(--ts-semantic-color-icon-success-default);
        --icon-color: var(--ts-semantic-color-icon-success-default);
    }

    .alert--neutral {
        border-color: var(--ts-semantic-color-border-neutral-default);
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
    }

    .alert--neutral .alert__icon {
        color: var(--ts-semantic-color-icon-neutral-default);
        --icon-color: var(--ts-semantic-color-icon-neutral-default);
    }

    .alert--warning {
        border-color: var(--ts-semantic-color-border-warning-default);
        background-color: var(--ts-semantic-color-background-warning-subtle-default);
    }

    .alert--warning .alert__icon {
        color: var(--ts-semantic-color-icon-warning-default);
        --icon-color: var(--ts-semantic-color-icon-warning-default);
    }

    .alert--danger {
        border-color: var(--ts-semantic-color-border-danger-default);
        background-color: var(--ts-semantic-color-background-danger-subtle-default);
    }

    .alert--danger .alert__icon {
        color: var(--ts-semantic-color-icon-danger-default);
        --icon-color: var(--ts-semantic-color-icon-danger-default);
    }

    .alert__message {
        flex: 1 1 auto;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        overflow: hidden;
        min-height: 40px;
    }

    .alert__close-button-container {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        flex-shrink: 0;
        min-height: 40px;
    }

    .alert__close-button {
        flex: 0 0 auto;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        line-height: 1.6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        align-self: flex-start;
        aspect-ratio: 1/1;
    }

    /* The alert clips overflow (for the countdown bar's rounded corners),
       which would cut off the close button's default focus outline. Render
       the focus ring inset so it stays fully visible inside the alert. */
    .alert__close-button::part(base):focus-visible {
        outline-offset: -3px;
        border-radius: 6px;
    }

    .alert__countdown {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: calc(var(--ts-semantic-size-width-sm) * 3);
        background-color: var(--ts-semantic-color-border-neutral-default);
        display: flex;
    }

    .alert__countdown--ltr {
        justify-content: flex-end;
    }

    .alert__countdown .alert__countdown-elapsed {
        height: 100%;
        width: 0;
    }

    .alert--primary .alert__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-primary-default);
    }

    .alert--success .alert__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-success-default);
    }

    .alert--neutral .alert__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-neutral-default);
    }

    .alert--warning .alert__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-warning-default);
    }

    .alert--danger .alert__countdown-elapsed {
        background-color: var(--ts-semantic-color-border-danger-default);
    }

    .alert__timer {
        display: none;
    }
`;
