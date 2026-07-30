import { css } from 'lit';

export default css`
    :host {
        display: block;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    .calendar-static {
        display: inline-block;
        border: 1px solid var(--ts-semantic-color-border-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        background: var(--ts-semantic-color-background-base-default);
        overflow: hidden;
    }

    .footer-divider {
        height: 1px;
        width: 100%;
        background: var(--ts-semantic-color-border-base-default);
    }

    .date-picker__footer-actions {
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-500, 16px);
        display: flex;
        justify-content: flex-end;
        gap: 16px;
    }
`;
