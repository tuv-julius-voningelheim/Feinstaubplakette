import { css } from 'lit';

export default css`
    :host {
        display: block;
        background: var(--ts-semantic-color-background-base-default);
        border-top: 1px solid var(--ts-semantic-color-border-base-default);
    }

    .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ts-semantic-size-space-400);
        padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);
        flex-wrap: wrap;
    }

    .info {
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-100);
        color: var(--ts-semantic-color-text-neutral-default);
    }

    @media (max-width: 640px) {
        .bar {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--ts-semantic-size-space-300);
            text-align: center;
        }

        .info {
            order: 1;
        }

        ::slotted(*) {
            order: 2;
        }

        .pagination {
            order: 3;
        }
    }
`;
