import { css } from 'lit';

export default css`
    .date-inputs-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    .date-inputs-container.horizontal {
        flex-direction: row;
    }

    .date-inputs-container.vertical {
        flex-direction: column;
        align-items: stretch;
    }

    .date-inputs-container.vertical .date-inputs-divider {
        display: none;
    }

    ts-date-input-start,
    ts-date-input-end {
        flex: 1 1 50%;
        min-width: 0;
    }

    .date-inputs-divider {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--ts-semantic-color-text-base-default, #0b253b);
        font-weight: 500;
        font-size: 28px;
        line-height: 1;
        text-align: center;
        height: 40px;
    }

    .date-inputs-divider.size-small {
        height: 32px;
    }

    .date-inputs-divider.size-large {
        height: 48px;
    }

    .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0;
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        border: 1px solid var(--ts-semantic-color-border-primary-subtle-default);
        box-shadow: var(--ts-semantic-shadow-light-lg);
        border-radius: var(--ts-semantic-size-radius-md);
        overflow: hidden; /* Clip content to border radius */
    }

    .content-wrapper:has(.footer-container) {
        border-radius: var(--ts-semantic-size-radius-md) var(--ts-semantic-size-radius-md) 0 0;
    }

    .content-wrapper:not(:has(.footer-container)) {
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .content-shortcut-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        background: var(--ts-semantic-color-background-base-default);
    }

    .footer-container {
        width: 100%;
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        border-bottom-left-radius: var(--ts-semantic-size-radius-md);
        border-bottom-right-radius: var(--ts-semantic-size-radius-md);
        overflow: hidden; /* Ensure content respects border radius */
    }

    .date-picker__footer-actions {
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-500, 16px);
        display: flex;
        justify-content: flex-end;
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        gap: 16px;
    }

    .footer-divider {
        height: 2px;
        width: 100%;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    @media (max-width: 567px) {
        .date-inputs-container {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
        }

        ts-date-input-start,
        ts-date-input-end {
            width: 100%;
        }

        .date-inputs-divider {
            display: none !important;
        }
    }
`;
