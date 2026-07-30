import { css } from 'lit';

export default css`
    :host {
        position: relative;
    }

    .content-footer-container {
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        border: 1px solid var(--ts-semantic-color-border-primary-subtle-default, #f0f6ff);
    }

    .date-picker__footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--ts-semantic-size-space-400);
        padding: var(--ts-semantic-size-space-700) var(--ts-semantic-size-space-800);
    }

    .footer-divider {
        height: 2px;
        width: 100%;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    @media (max-width: 1024px) {
        .date-picker__footer-actions {
            padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-600);
        }
    }
`;
