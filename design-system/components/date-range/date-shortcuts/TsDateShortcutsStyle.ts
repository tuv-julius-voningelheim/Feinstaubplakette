import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .shortcuts-root {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 10px;
        margin: 10px;
        padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);
        max-width: 100%;
    }

    .shortcuts-root ts-tag::part(base) {
        transition:
            background-color 0.15s ease,
            color 0.15s ease,
            border-color 0.15s ease;
        cursor: pointer;
    }

    .shortcuts-root ts-tag:hover::part(base) {
        background-color: var(--ts-semantic-color-background-neutral-subtle-hover);
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-base-default);
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .shortcut-focus:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        border-radius: var(--ts-semantic-size-radius-pill);
        outline-offset: 1px;
    }

    @media (max-width: 1023px) {
        .shortcuts-root {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            padding-top: 0;
            margin: 0;
            width: 285px;
        }
    }
`;
