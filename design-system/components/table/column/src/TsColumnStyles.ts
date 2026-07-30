import { css } from 'lit';

export default css`
    :host {
        display: table-cell;
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400);
        vertical-align: middle;
        height: var(--ts-table-row-height, 40px);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-200);
        font-weight: var(--ts-font-weight-bold);
        letter-spacing: 0.02em;
        text-transform: none;
        background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
        color: var(--ts-table-header-color, #ffffff);
        border-bottom: 1px solid var(--ts-table-header-border, var(--ts-semantic-color-border-primary-default));
        user-select: none;
        position: relative;
        box-sizing: border-box;
        white-space: nowrap;
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
        z-index: 5;
    }
    :host([fixed='right']) {
        position: sticky;
        right: 0;
        z-index: 5;
    }

    .column {
        display: inline-flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-100);
        width: 100%;
    }
    :host([align='center']) .column {
        justify-content: center;
    }
    :host([align='right']) .column {
        justify-content: flex-end;
    }

    .label {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sort-button {
        all: unset;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-100);
        width: 100%;
    }
    .sort-button:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: -2px;
    }

    .sort-indicator {
        display: inline-flex;
        flex-shrink: 0;
        opacity: 0.5;
        transition: opacity var(--ts-semantic-transition-duration-fast) ease;
        --icon-color: currentColor;
    }
    .sort-indicator--active {
        opacity: 1;
    }

    .resize-handle {
        position: absolute;
        top: 0;
        right: 0;
        width: 5px;
        height: 100%;
        cursor: col-resize;
        user-select: none;
        background: transparent;
        transition: background var(--ts-semantic-transition-duration-fast) ease;
    }
    .resize-handle:hover,
    .resize-handle--active {
        background: rgba(255, 255, 255, 0.35);
    }

    :host([has-th]) {
        display: contents;
    }
`;
