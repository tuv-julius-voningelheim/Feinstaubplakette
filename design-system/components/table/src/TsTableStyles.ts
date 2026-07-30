import { css } from 'lit';

export default css`
    :host {
        display: block;
        width: 100%;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        color: var(--ts-semantic-color-text-base-default);
    }

    :host([header-variant='primary']) {
        --ts-table-header-bg: var(--ts-semantic-color-background-primary-default);
        --ts-table-header-color: var(--ts-semantic-color-text-inverted-default, #fff);
        --ts-table-header-border: var(--ts-semantic-color-background-primary-default);
        --ts-table-header-col-separator: rgba(255, 255, 255, 0.25);
    }

    :host([header-variant='light']) {
        --ts-table-header-bg: var(--ts-semantic-color-background-neutral-subtle-default);
        --ts-table-header-color: var(--ts-semantic-color-text-base-default, #0b253b);
        --ts-table-header-border: var(--ts-semantic-color-border-base-default);
        --ts-table-header-col-separator: var(--ts-semantic-color-border-base-default);
    }

    :host([header-variant='dark']) {
        --ts-table-header-bg: var(--ts-semantic-color-surface-inverted-default, #0b253b);
        --ts-table-header-color: var(--ts-semantic-color-text-inverted-default, #fff);
        --ts-table-header-border: var(--ts-semantic-color-surface-inverted-default, #0b253b);
        --ts-table-header-col-separator: rgba(255, 255, 255, 0.2);
    }

    :host([size='small']) {
        --ts-table-row-height: 32px;
    }
    :host([size='large']) {
        --ts-table-row-height: 48px;
    }

    :host {
        --ts-table-row-height: 40px;
        --ts-table-row-hover-bg: var(--ts-semantic-color-background-base-hover);
        --ts-table-row-stripe-bg: var(--ts-semantic-color-background-neutral-subtle-default);
        --ts-table-row-selected-bg: var(--ts-semantic-color-background-primary-subtle-default);
        --ts-table-border-color: var(--ts-semantic-color-border-base-default);
        --ts-table-bg: var(--ts-semantic-color-background-base-default);
        --ts-table-row-hover-bg-applied: transparent;
        --ts-table-header-position: relative;
    }

    :host([hover]) {
        --ts-table-row-hover-bg-applied: var(--ts-table-row-hover-bg);
    }

    :host([sticky-header]) {
        --ts-table-header-position: sticky;
    }

    .table-wrapper {
        display: flex;
        flex-direction: column;
        background: var(--ts-table-bg);
        overflow: clip;
        position: relative;
    }

    :host([bordered]) .table-wrapper {
        border: 1px solid var(--ts-table-border-color);
        border-radius: var(--ts-semantic-size-radius-md);
        box-shadow: var(--ts-semantic-shadow-light-md, 0 2px 4px 0 rgba(113, 113, 122, 0.12));
    }

    :host([bordered][native]) {
        border: 1px solid var(--ts-table-border-color);
        border-radius: var(--ts-semantic-size-radius-md);
        box-shadow: var(--ts-semantic-shadow-light-md, 0 2px 4px 0 rgba(113, 113, 122, 0.12));
    }
    :host([bordered][native]) .table-wrapper {
        border: none;
        box-shadow: none;
    }

    .table-scroll {
        overflow: auto;
        position: relative;
        scrollbar-width: thin;
        scrollbar-color: var(--ts-semantic-color-background-neutral-subtle-active)
            var(--ts-semantic-color-background-base-default);
        outline: none;
    }
    .table-scroll:focus-visible {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused, #0066cc);
        outline-offset: -2px;
    }

    .table-split-wrapper {
        display: flex;
        flex-direction: column;
    }

    .table-split-header {
        flex-shrink: 0;
        overflow: hidden;
        background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
        transition: box-shadow var(--ts-semantic-transition-duration-fast, 150ms) ease;
    }

    .table-split-header--scrolled {
        box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.18);
        z-index: 3;
        position: relative;
    }

    .table-split-body {
        overflow-x: auto;
        overflow-y: auto;
        scrollbar-gutter: stable;
        scrollbar-width: thin;
        scrollbar-color: var(--ts-semantic-color-background-neutral-subtle-active)
            var(--ts-semantic-color-background-base-default);
        outline: none;
    }
    .table-split-body:focus-visible {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused, #0066cc);
        outline-offset: -2px;
    }

    .table-split-wrapper .header-rows,
    .table-split-wrapper .body-rows {
        display: block;
    }

    .table-split-wrapper .row {
        display: grid;
        grid-template-columns: var(--ts-table-grid-template, repeat(auto-fill, minmax(120px, 1fr)));
        min-width: 100%;
        box-sizing: border-box;
    }

    .table-split-wrapper .column,
    .table-split-wrapper .cell {
        display: flex;
        align-items: center;
        min-width: 0;
        overflow: hidden;
        box-sizing: border-box;
    }

    .table-scroll-container {
        position: relative;
    }

    :host([native]) .table-wrapper {
        overflow: visible;
    }
    :host([native]) .table-scroll {
        overflow: visible;
    }

    .table {
        display: table;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: auto;
    }

    .table--fixed {
        table-layout: fixed;
    }

    .header-rows {
        display: table-header-group;
    }
    .body-rows {
        display: table-row-group;
    }

    .table--composition {
        display: table;
    }

    caption.visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .table--sticky .header-rows .column {
        position: sticky;
        top: 0;
        z-index: 4;
        transition: box-shadow var(--ts-semantic-transition-duration-fast, 150ms) ease;
    }

    .table--header-scrolled .header-rows .column {
        box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.18);
    }

    .row {
        display: table-row;
        background: transparent;
    }
    .row:hover {
        background: var(--ts-table-row-hover-bg-applied, transparent);
    }
    .table--striped .body-rows > .row:nth-child(even) {
        background: var(--ts-table-row-stripe-bg);
    }
    .row--clickable {
        cursor: pointer;
    }
    .row--clickable:focus {
        outline: none;
    }
    .row--clickable:focus-visible {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused, #0066cc);
        outline-offset: -2px;
        position: relative;
        z-index: 1;
    }
    .row--selected {
        background: var(
            --ts-table-row-selected-bg,
            var(--ts-semantic-color-background-primary-subtle-default)
        ) !important;
    }

    .column {
        display: table-cell;
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400);
        vertical-align: middle;
        height: var(--ts-table-row-height, 40px);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-200);
        font-weight: var(--ts-font-weight-bold);
        letter-spacing: 0.02em;
        text-align: left;
        background: var(--ts-table-header-bg, var(--ts-semantic-color-background-primary-default));
        color: var(--ts-table-header-color, #ffffff);
        border-bottom: 1px solid var(--ts-table-header-border, var(--ts-semantic-color-border-primary-default));
        user-select: none;
        position: relative;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .column--fixed-left {
        position: sticky;
        left: 0;
        z-index: 5;
    }
    .column--fixed-right {
        position: sticky;
        right: 0;
        z-index: 5;
    }
    .table--sticky .header-rows .column--fixed-left,
    .table--sticky .header-rows .column--fixed-right {
        z-index: 6;
    }

    .column-inner {
        display: inline-flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-100);
        width: 100%;
    }
    .column-label {
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
        width: 8px;
        height: 100%;
        cursor: col-resize;
        user-select: none;
        background: transparent;
        transition: background var(--ts-semantic-transition-duration-fast) ease;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }
    .resize-handle::before {
        content: '';
        display: block;
        width: 2px;
        height: 50%;
        min-height: 12px;
        max-height: 24px;
        background: var(--ts-table-resize-divider-color, rgba(255, 255, 255, 0.45));
        border-radius: 1px;
        transition:
            height var(--ts-semantic-transition-duration-fast) ease,
            background var(--ts-semantic-transition-duration-fast) ease;
    }
    .resize-handle:hover::before,
    .resize-handle--active::before {
        height: 80%;
        max-height: none;
        background: var(--ts-table-resize-divider-color-active, rgba(255, 255, 255, 0.9));
    }
    .resize-handle:hover,
    .resize-handle--active {
        background: rgba(255, 255, 255, 0.15);
    }
    /* Adjust divider color for light/dark header variants */
    :host([header-variant='light']) .resize-handle::before {
        background: var(
            --ts-table-resize-divider-color,
            var(--ts-semantic-color-border-base-default, rgba(0, 0, 0, 0.25))
        );
    }
    :host([header-variant='light']) .resize-handle:hover::before,
    :host([header-variant='light']) .resize-handle--active::before {
        background: var(--ts-semantic-color-border-base-default, rgba(0, 0, 0, 0.6));
    }
    :host([header-variant='light']) .resize-handle:hover,
    :host([header-variant='light']) .resize-handle--active {
        background: rgba(0, 0, 0, 0.06);
    }

    .cell {
        display: table-cell;
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400);
        vertical-align: middle;
        height: var(--ts-table-row-height, 40px);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-font-size-200);
        font-weight: var(--ts-font-weight-regular);
        line-height: var(--ts-line-height-300);
        color: var(--ts-semantic-color-text-base-default);
        border-bottom: 1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
        background: inherit;
        box-sizing: border-box;
    }
    .cell--fixed-left {
        position: sticky;
        left: 0;
        z-index: 1;
        background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
        box-shadow: 1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }
    .cell--fixed-right {
        position: sticky;
        right: 0;
        z-index: 1;
        background: var(--ts-table-bg, var(--ts-semantic-color-background-base-default));
        box-shadow: -1px 0 0 var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }

    .empty-state {
        padding: var(--ts-semantic-size-space-600) var(--ts-semantic-size-space-500);
        text-align: center;
        color: var(--ts-semantic-color-text-neutral-default);
        font-size: var(--ts-font-size-200);
        border-bottom: 1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }

    :host([bordered]:not([has-footer])) .body-rows > .row:last-child .cell,
    :host([bordered]:not([has-footer])) .empty-state {
        border-bottom: none;
    }

    :host([bordered]:not([has-footer])) ::slotted(ts-row:last-child) {
        --ts-table-last-row-cell-border: none;
    }

    :host([column-borders]) .column:not(:last-child) {
        border-right: 1px solid var(--ts-table-header-col-separator, rgba(255, 255, 255, 0.25));
    }
    :host([column-borders]) .cell:not(:last-child) {
        border-right: 1px solid var(--ts-table-border-color, var(--ts-semantic-color-border-base-default));
    }

    .table-content {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .table-loading-overlay {
        position: absolute;
        inset: 0;
        z-index: 20;
        background: rgba(255, 255, 255, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        cursor: not-allowed;
        border-radius: inherit;
    }

    .table-loading-spinner {
        --track-color: rgba(0, 0, 0, 0.1);
        font-size: 2.5rem;
        cursor: default;
        position: relative;
        z-index: 1;
    }

    .skeleton-row {
        pointer-events: none;
    }

    .skeleton-cell {
        vertical-align: middle;
    }

    .skeleton-cell__indicator {
        display: block;
        width: 80%;
        height: 14px;
        --border-radius: var(--ts-semantic-size-radius-sm, 4px);
    }
`;
