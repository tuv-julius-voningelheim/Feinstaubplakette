import { css } from 'lit';

export default css`
    .content-footer-container {
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        border: 1px solid var(--ts-semantic-color-border-primary-subtle-default, #f0f6ff);
    }

    .date-picker__footer-actions {
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-500, 16px);
        display: flex;
        justify-content: flex-end;
        gap: 16px;
    }

    .footer-divider {
        height: 2px;
        width: 100%;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }
`;
