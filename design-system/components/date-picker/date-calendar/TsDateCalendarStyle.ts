import { css } from 'lit';

export default css`
    :host {
        display: block;
        --dp-pad: 12px;
        --dp-gap: 2px;
        --dp-cell: 40px;
    }

    .date-month {
        background: var(--ts-semantic-color-surface-base-default);
        padding: var(--ts-semantic-size-space-450, 14px) var(--ts-semantic-size-space-500, 16px);
        overscroll-behavior: none;
        color: var(--ts-semantic-color-text-base-default);
        width: calc((var(--dp-cell) * 7) + (var(--dp-gap) * 6));
        background-color: var(--ts-semantic-color-background-base-default);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        background: var(--ts-semantic-color-background-base-default, #fff);
        border-top-left-radius: var(--ts-semantic-size-radius-md);
        border-top-right-radius: var(--ts-semantic-size-radius-md);
    }

    .footer-action {
        border-bottom-left-radius: var(--ts-semantic-size-radius-md);
        border-bottom-right-radius: var(--ts-semantic-size-radius-md);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--dp-gap);
        padding: 0 0 0 6px;
        margin-bottom: var(--ts-semantic-size-space-500);
        font-family: inherit;
    }

    .selectors {
        display: flex;
        align-items: center;
        min-width: 0;
        font-family: inherit;
    }

    .selector-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font: inherit;
        border: 0;
        background: transparent;
        border-radius: var(--ts-semantic-size-radius-xl);
        cursor: pointer;
        white-space: nowrap;
        width: fit-content;
        color: var(--ts-semantic-color-text-base-default);
        text-align: center;
        font-size: var(--ts-font-size-300, 14px);
        font-style: normal;
        font-weight: 700;
        line-height: var(--ts-line-height-200, 14px);
    }

    .selector-btn::-moz-focus-inner {
        border: 0;
    }

    .selector-btn:focus {
        outline: none;
    }

    .selector-btn:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 0;
    }

    .selector-btn-month {
        padding: 0 2px;
    }
    .selector-btn-year {
        padding: 0 5px;
    }

    .selector-btn:hover {
        background: transparent;
    }

    .selector-icon {
        color: var(--ts-semantic-color-icon-base-default);
        text-align: center;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        font-family: inherit;
    }

    .nav {
        display: flex;
        gap: 15px;
        font-family: inherit;
    }

    .nav [disabled] {
        color: var(--ts-semantic-color-icon-primary-disabled);
        pointer-events: none;
    }

    .nav ts-icon-button::part(icon) {
        color: var(--ts-semantic-color-icon-primary-default);
    }

    .content {
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
        font-family: inherit;

        /* Match dropdown surface color for scrollbar track */
        background-color: var(--ts-semantic-color-background-base-default);
    }

    /* WebKit scrollbar styling for the scrollable calendar content (years view) */
    .content::-webkit-scrollbar {
        width: 8px;
    }

    .content::-webkit-scrollbar-track {
        background-color: var(--ts-semantic-color-background-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .content::-webkit-scrollbar-thumb {
        background-color: var(--ts-semantic-color-border-neutral-subtle, rgba(0, 0, 0, 0.12));
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .content::-webkit-scrollbar-thumb:hover {
        background-color: var(--ts-semantic-color-border-neutral-default, rgba(0, 0, 0, 0.2));
    }

    /* Firefox scrollbar styling */
    .content {
        scrollbar-color: var(--ts-semantic-color-border-neutral-subtle, rgba(0, 0, 0, 0.12))
            var(--ts-semantic-color-background-base-default);
        scrollbar-width: thin;
    }

    .dow {
        display: grid;
        grid-template-columns: repeat(7, var(--dp-cell));
        gap: var(--dp-gap);
        padding: 0;
        opacity: 0.8;
        font-family: inherit;
    }

    .dow span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        font-size: var(--ts-font-size-200, 14px);
        color: var(--ts-semantic-color-text-base-default);
        text-align: center;
        font-style: normal;
        font-weight: var(--ts-font-weight-medium);
        line-height: var(--ts-line-height-200, 14px);
        font-family: inherit;
    }

    .grid {
        display: flex;
        flex-direction: column;
        gap: var(--dp-gap);
        padding-top: var(--ts-semantic-size-space-400);
        padding-bottom: var(--ts-semantic-size-space-100);
        font-family: inherit;
    }

    .week {
        display: grid;
        grid-template-columns: repeat(7, var(--dp-cell));
        gap: var(--dp-gap);
    }

    button {
        border: 0;
        background: none;
        cursor: pointer;
        border-radius: var(--ts-semantic-size-radius-pill, 99999px);
        height: var(--dp-cell);
        width: var(--dp-cell);
        margin: 0;
        color: var(--ts-semantic-color-text-base-default);
        text-align: center;
        font-size: var(--ts-font-size-200, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--ts-line-height-200, 14px);
        font-family: inherit;
    }

    button:hover {
        background: var(--ts-semantic-color-background-neutral-subtle-hover);
    }

    button:focus-visible {
        outline: none;
    }

    button[aria-current='date'] {
        outline: 2px solid var(--ts-semantic-color-border-base-default);
        outline-offset: -2px;
    }

    button[aria-selected='true'] {
        background: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    button[aria-selected='true'][aria-current='date'] {
        outline: 2px solid var(--ts-semantic-color-border-base-default);
        background: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    button[disabled] {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .muted {
        color: var(--ts-semantic-color-text-neutral-subtle, var(--ts-semantic-color-text-neutral-default));
        opacity: 0.65;
    }

    .prev-month,
    .next-month {
        justify-content: center;
        align-items: center;
        gap: var(--ts-semantic-size-space-400, 12px);
        color: var(--ts-semantic-color-icon-primary-default);
    }

    .panel {
        max-height: none;
        overflow: visible;
    }

    .months-view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-bottom: 0;
        font-family: inherit;
    }

    .months-panel,
    .years-panel {
        width: 100%;
    }

    .months-panel {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        font-family: inherit;
    }

    .years-panel {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--dp-gap);
        //padding-top: var(--ts-semantic-size-space-700);
        max-height: 270px;
        font-family: inherit;
        /* Ensure panel background matches dropdown surface, so the visible scroll area looks consistent */
        background-color: var(--ts-semantic-color-background-base-default);
    }

    .months-panel button,
    .years-panel button {
        width: 100%;
        height: 36px;
        border-radius: var(--ts-semantic-size-radius-pill);
        font-size: var(--ts-font-size-200, 14px);
    }

    .months-panel button[aria-selected='true'],
    .years-panel button[aria-selected='true'] {
        background: var(--ts-semantic-color-background-primary-default);
    }

    @media (max-width: 1024px) {
        .date-month {
            box-shadow: none;
            border: 0;
        }

        .grid {
            padding-bottom: var(--ts-semantic-size-space-500);
        }

        .months-view {
            padding-bottom: var(--ts-semantic-size-space-500);
        }
    }

    @media (max-width: 350px) {
        :host {
            --dp-cell: 32px;
            --dp-pad: 6px;
            --dp-gap: 6px;
        }

        .months-view {
            padding-bottom: var(--ts-semantic-size-space-300);
        }

        .date-month {
            padding: var(--ts-semantic-size-space-400);
        }
    }

    /* ----- Focus-visible: highest priority ----- */
    .grid-item::-moz-focus-inner {
        border: 0;
    }

    .grid-item:focus {
        outline: none;
    }

    .grid-item:focus-visible {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: -2px;
    }
`;
