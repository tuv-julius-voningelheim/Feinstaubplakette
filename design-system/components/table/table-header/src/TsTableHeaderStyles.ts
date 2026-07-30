import { css } from 'lit';

export default css`
    :host {
        display: block;
        background: var(--ts-semantic-color-background-base-default);
        border-bottom: 1px solid var(--ts-semantic-color-border-base-default);
    }

    :host([show-search='false'][show-page-size='false']) .bar,
    :host(:not([show-search]):not([show-page-size])) .bar {
        display: none;
    }

    .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ts-semantic-size-space-400);
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-500);
        flex-wrap: wrap;
        min-height: 52px;
    }

    .left,
    .right {
        display: inline-flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-200);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-200);
        color: var(--ts-semantic-color-text-base-default);
    }

    .right {
        margin-left: auto;
    }

    .left:empty,
    .right:empty {
        display: none;
    }

    .page-size-label,
    .page-size-suffix {
        white-space: nowrap;
    }

    .page-size-select {
        width: 80px;
    }

    .search-input {
        min-width: 220px;
    }

    /* Mobile: hide desktop select, show mobile icon button */
    .page-size-mobile-btn {
        display: none;
    }

    @media (max-width: 640px) {
        .bar {
            flex-wrap: nowrap;
            gap: var(--ts-semantic-size-space-200);
        }

        /* Hide label, suffix, and desktop select on mobile */
        .page-size-label,
        .page-size-suffix,
        .page-size-select {
            display: none;
        }

        /* Show icon button on mobile */
        .page-size-mobile-btn {
            display: inline-flex;
        }

        /* Left stays compact (icon only), right fills remaining space */
        .left {
            flex: 0 0 auto;
        }

        .right {
            flex: 1 1 auto;
            margin-left: 0;
            min-width: 0;
        }

        .search-input {
            min-width: unset;
            width: 100%;
        }

        /* When page size is hidden, right (search) takes full width */
        :host([show-page-size='false']) .right,
        :host(:not([show-page-size])) .right {
            flex: 1 1 100%;
        }
    }
`;
