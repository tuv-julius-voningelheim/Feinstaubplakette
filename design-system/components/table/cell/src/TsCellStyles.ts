import { css } from 'lit';

export default css`
    :host {
        display: table-cell;
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400);
        vertical-align: middle;
        height: var(--ts-table-row-height, 40px);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-200);
        font-weight: var(--ts-font-weight-regular);
        line-height: var(--ts-line-height-300);
        color: var(--ts-semantic-color-text-base-default);
        border-bottom: var(
            --ts-table-last-row-cell-border,
            1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default))
        );
        background: inherit;
        box-sizing: border-box;
    }

    :host([align='center']) {
        text-align: center;
    }

    :host([align='right']) {
        text-align: right;
    }

    :host([fixed='left']) {
        position: sticky;
        left: 0;
        z-index: 1;
        background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
        box-shadow: 1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }

    :host([fixed='right']) {
        position: sticky;
        right: 0;
        z-index: 1;
        background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
        box-shadow: -1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }

    :host([has-td]) {
        display: contents;
    }
`;
