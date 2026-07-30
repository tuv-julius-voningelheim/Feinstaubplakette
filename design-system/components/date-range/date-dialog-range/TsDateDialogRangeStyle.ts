import { css } from 'lit';

export default css`
    :host {
        position: relative;
    }

    .date-inputs-container {
        display: flex;
        gap: 16px;
        width: 100%;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        flex-direction: row;
    }

    .date-inputs-container.vertical {
        flex-direction: column;
    }

    ts-date-input-start,
    ts-date-input-end {
        flex: 1;
        min-width: 0;
    }

    .dialog-header {
        padding: 16px;
    }

    .label-title {
        font-size: var(--ts-font-size-200);
        color: var(--ts-semantic-color-text-neutral-default);
        margin-bottom: 4px;
    }

    .label-range {
        font-size: var(--ts-font-size-500);
        font-weight: 700;
        color: var(--ts-semantic-color-text-base-default);
    }

    .dialog-divider-top {
        height: 1px;
        background: var(--ts-semantic-color-border-base-default);
        margin: 0;
    }

    .dialog-divider {
        height: 2px;
        background: var(--ts-semantic-color-background-primary-subtle-default);
        margin: 0;
    }

    .date-picker__footer-actions {
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-500, 16px);
        background: var(--ts-semantic-color-background-base-default);
        background-color: var(--ts-semantic-color-background-base-default);
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        border-bottom-left-radius: var(--ts-semantic-size-radius-md);
        border-bottom-right-radius: var(--ts-semantic-size-radius-md);
    }

    .range-start--always-active {
        color: var(--ts-semantic-color-text-base-default);
    }

    .range-end--active {
        color: var(--ts-semantic-color-text-base-default);
    }

    .range-end--inactive {
        color: var(--ts-semantic-color-text-neutral-default);
    }

    @media (max-width: 480px) {
        .date-inputs-container {
            flex-direction: column;
            gap: 10px;
        }
    }
`;
