import { css } from 'lit';

export default css`
    :host {
        display: inline-flex;
    }

    .badge {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        padding: var(--ts-semantic-size-space-200, 6px) var(--ts-semantic-size-space-400, 12px);
        border-radius: var(--ts-semantic-size-radius-md);
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        cursor: inherit;
        height: fit-content;
    }

    .badge--small {
        height: 22px;
        min-width: 22px;
        font-size: var(--ts-font-size-100);
        padding: var(--ts-semantic-size-space-0, 4px) var(--ts-semantic-size-space-300, 8px);
        line-height: 12px;
    }

    .badge--medium {
        height: 24px;
        min-width: 24px;
        font-size: var(--ts-font-size-100);
        padding: var(--ts-semantic-size-space-100, 4px) var(--ts-semantic-size-space-300, 8px);
        line-height: 12px;
    }

    .badge--large {
        height: 32px;
        min-width: 32px;
        font-size: var(--ts-font-size-200);
        padding: var(--ts-semantic-size-space-200, 6px) var(--ts-semantic-size-space-400, 12px);
        line-height: 14px;
    }

    .badge--primary {
        background-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --pulse-color: var(--ts-semantic-color-background-primary-default);
    }

    .badge--success {
        background-color: var(--ts-semantic-color-background-success-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --pulse-color: var(--ts-semantic-color-background-success-default);
    }

    .badge--neutral {
        background-color: var(--ts-semantic-color-background-neutral-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --pulse-color: var(--ts-semantic-color-background-neutral-default);
    }

    .badge--warning {
        background-color: var(--ts-semantic-color-background-warning-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --pulse-color: var(--ts-semantic-color-background-warning-default);
    }

    .badge--danger {
        background-color: var(--ts-semantic-color-background-danger-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --pulse-color: var(--ts-semantic-color-background-danger-default);
    }

    .badge--pill {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .badge--pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 var(--pulse-color);
            opacity: 1;
        }
        50% {
            box-shadow: 0 0 0 0.75rem transparent;
            opacity: 0.75;
        }
        100% {
            box-shadow: 0 0 0 0 transparent;
            opacity: 0.95;
        }
    }
`;
