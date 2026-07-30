import { css } from 'lit';

export default css`
    :host {
        display: table-row;
        background: transparent;
        color: var(--ts-semantic-color-text-base-default);
        min-height: var(--ts-table-row-height, 40px);
    }

    :host(:hover) {
        background: var(--ts-table-row-hover-bg-applied, transparent);
    }

    :host([header]) {
        background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
        color: var(--ts-table-header-color, #ffffff);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-font-weight-bold);
    }

    /* Clickable rows */
    :host([clickable]) {
        cursor: pointer;
    }
    :host([clickable]:focus) {
        outline: none;
    }
    :host([clickable]:focus-visible) {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused, #0066cc);
        outline-offset: -2px;
        position: relative;
        z-index: 1;
    }

    /* Selected row */
    :host([selected]) {
        background: var(
            --ts-table-row-selected-bg,
            var(--ts-semantic-color-background-primary-subtle-default)
        ) !important;
    }

    /* Striped (zebra) row — applied by ts-table to every even-position body row */
    :host([striped]) {
        background: var(--ts-table-row-stripe-bg, var(--ts-semantic-color-background-neutral-subtle-default));
    }

    /* Sticky header rows*/
    :host([header]) {
        position: var(--ts-table-header-position, relative);
        top: 0;
        z-index: 4;
    }

    /* Fixed top / bottom rows */
    :host([fixed='top']) {
        position: sticky;
        top: 0;
        z-index: 3;
    }

    :host([fixed='bottom']) {
        position: sticky;
        bottom: 0;
        z-index: 3;
        background: var(--ts-semantic-color-background-base-default);
        border-top: 1px solid var(--ts-semantic-color-border-base-default);
    }

    :host([has-tr]) {
        display: contents;
    }
`;
