import { css } from 'lit';

export default css`
    :host {
        --max-width: 20rem;
        --hide-delay: 0ms;
        --show-delay: 150ms;

        display: contents;
    }

    .tooltip {
        --arrow-size: 6px;
        --arrow-color: var(--ts-semantic-color-background-primary-dark-default);
        --popup-bg-color: transparent;
    }

    .tooltip::part(popup) {
        z-index: var(--ts-semantic-distance-zindex-tooltip);
    }

    .tooltip[placement^='top']::part(popup) {
        transform-origin: bottom;
    }

    .tooltip[placement^='bottom']::part(popup) {
        transform-origin: top;
    }

    .tooltip[placement^='left']::part(popup) {
        transform-origin: right;
    }

    .tooltip[placement^='right']::part(popup) {
        transform-origin: left;
    }

    .tooltip__body {
        display: block;
        width: max-content;
        max-width: var(--max-width);
        border-radius: var(--ts-semantic-size-radius-md);
        background-color: var(--ts-semantic-color-background-primary-dark-default);
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        line-height: 1.4;
        text-align: start;
        white-space: normal;
        color: var(--ts-semantic-color-text-inverted-default);
        padding: var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-300);
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }
`;
