import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /** The popup */
    .select {
        flex: 1 1 auto;
        display: inline-flex;
        width: 100%;
        position: relative;
        vertical-align: middle;
    }

    .select::part(popup) {
        z-index: var(--ts-semantic-distance-zindex-dropdown);
        background: none;
    }

    .select[data-current-placement^='top']::part(popup) {
        transform-origin: bottom;
    }

    .select[data-current-placement^='bottom']::part(popup) {
        transform-origin: top;
    }

    /* Combobox */
    .select__combobox {
        flex: 1;
        display: flex;
        width: 100%;
        min-width: 0;
        position: relative;
        align-items: center;
        justify-content: start;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        letter-spacing: normal;
        vertical-align: middle;
        overflow: hidden;
        cursor: pointer;
        transition:
            var(--ts-semantic-transition-duration-fast) color,
            var(--ts-semantic-transition-duration-fast) border,
            var(--ts-semantic-transition-duration-fast) box-shadow,
            var(--ts-semantic-transition-duration-fast) background-color;
    }

    .select__display-input {
        position: relative;
        width: 100%;
        font: inherit;
        border: none;
        background: none;
        color: var(--ts-semantic-color-text-base-default);
        cursor: inherit;
        overflow: hidden;
        padding: 0;
        margin: 0;
        -webkit-appearance: none;
    }

    .select__display-input::placeholder {
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .select:not(.select--disabled):hover .select__display-input {
        color: var(--ts-semantic-color-text-base-hover);
    }

    .select__display-input:focus {
        outline: none;
    }

    /* Visually hide the display input when multiple is enabled */
    .select--multiple:not(.select--placeholder-visible) .select__display-input {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .select__value-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: -1;
    }

    .select__tags {
        display: flex;
        flex: 1;
        align-items: center;
        flex-wrap: wrap;
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    .select__tags::slotted(ts-tag) {
        cursor: pointer !important;
    }

    .select--disabled .select__tags,
    .select--disabled .select__tags::slotted(ts-tag) {
        cursor: not-allowed !important;
    }

    /* Standard selects */
    .select--standard .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-base-default);
    }

    .select--standard:hover:not(.select--disabled):not(.select--error) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .select--standard.select--disabled .select__combobox {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        border-color: var(--ts-semantic-color-border-base-disabled);
        color: var(--ts-semantic-color-text-base-disabled);
        cursor: not-allowed;
        outline: none;
    }

    .select--standard:not(.select--disabled):not(.select--error).select--open .select__combobox,
    .select--standard:not(.select--disabled):not(.select--error).select--focused .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-primary-focused);
        box-shadow: 0 0 0 var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-primary-focused);
    }

    /* Error state for standard */
    .select--standard.select--error:not(.select--disabled) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    .select--standard.select--error:not(.select--disabled):hover .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .select--standard.select--error:not(.select--disabled).select--open .select__combobox,
    .select--standard.select--error:not(.select--disabled).select--focused .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-danger-default);
        box-shadow: 0 0 0 var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    /* Filled selects */
    .select--filled .select__combobox {
        border: none;
        background-color: var(--ts-semantic-color-background-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .select--filled:hover:not(.select--disabled):not(.select--error) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .select--filled.select--disabled .select__combobox {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        cursor: not-allowed;
    }

    /* Override the base .select cursor and allow not-allowed to show from host */
    .select--disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    .select--disabled .select__combobox {
        cursor: not-allowed;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .select--filled:not(.select--disabled):not(.select--error).select--open .select__combobox,
    .select--filled:not(.select--disabled):not(.select--error).select--focused .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Error state for filled */
    .select--filled.select--error:not(.select--disabled) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    .select--filled.select--error:not(.select--disabled):hover .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .select--filled.select--error:not(.select--disabled).select--open .select__combobox,
    .select--filled.select--error:not(.select--disabled).select--focused .select__combobox {
        background-color: var(--ts-semantic-color-background-base-default);
        outline: solid 3px var(--ts-semantic-color-border-danger-default);
        outline-offset: 1px;
    }

    /* Locked state — focusable and openable, but not selectable */
    .select--standard.select--locked:not(.select--disabled) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .select--standard.select--locked:not(.select--disabled):hover:not(.select--error) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .select--standard.select--locked:not(.select--disabled):not(.select--error).select--open .select__combobox,
    .select--standard.select--locked:not(.select--disabled):not(.select--error).select--focused .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-primary-focused);
    }

    .select--filled.select--locked:not(.select--disabled) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .select--filled.select--locked:not(.select--disabled):hover:not(.select--error) .select__combobox {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .select__lock-icon {
        color: var(--ts-semantic-color-icon-base-default);
        cursor: default;
        pointer-events: none;
    }

    .select--locked .select__listbox {
        cursor: not-allowed;
    }

    /* Sizes */
    .select--small .select__combobox {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        min-height: 1.875rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-400);
    }

    .select--small .select__clear {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .select--small .select__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-400);
    }

    .select--small.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
        padding-block: 2px;
        padding-inline-start: 0;
    }

    .select--small .select__tags {
        gap: 2px;
    }

    .select--medium .select__combobox {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        min-height: 2.5rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-500);
    }

    .select--medium .select__clear {
        margin-inline-start: var(--ts-semantic-size-space-500);
    }

    .select--medium .select__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-500);
    }

    .select--medium.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-500);
    }

    .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
        padding-inline-start: 0;
        padding-block: 3px;
    }

    .select--medium .select__tags {
        gap: 3px;
    }

    .select--large .select__combobox {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
        min-height: 3.125rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-600);
    }

    .select--large .select__clear {
        margin-inline-start: var(--ts-semantic-size-space-600);
    }

    .select--large .select__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-600);
    }

    .select--large.select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-600);
    }

    .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
        padding-inline-start: 0;
        padding-block: 4px;
    }

    .select--large .select__tags {
        gap: 4px;
    }

    /* Pills */
    .select--pill.select--small .select__combobox {
        border-radius: 1.875rem;
    }

    .select--pill.select--medium .select__combobox {
        border-radius: 2.5rem;
    }

    .select--pill.select--large .select__combobox {
        border-radius: 3.125rem;
    }

    /* Prefix and Suffix */
    .select__prefix,
    .select__suffix {
        flex: 0;
        display: inline-flex;
        align-items: center;
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .select__suffix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    /* Clear button */
    .select__clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
        color: var(--ts-semantic-color-icon-base-default);
        border: none;
        background: none;
        padding: 0;
        transition: var(--ts-semantic-transition-duration-fast) color;
        cursor: pointer;
    }

    .select__clear:hover {
        color: var(--ts-semantic-color-icon-base-hover);
    }

    .select__clear:focus {
        outline: none;
    }

    /* Expand icon */
    .select__expand-icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        transition: var(--ts-semantic-transition-duration-medium) rotate ease;
        rotate: 0;
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .select--open .select__expand-icon {
        rotate: -180deg;
    }

    /* Listbox */
    .select__listbox {
        display: block;
        position: relative;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        box-shadow: var(--ts-semantic-shadow-light-lg);
        background: var(--ts-semantic-color-surface-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-background-neutral-subtle-default);
        border-radius: var(--ts-semantic-size-radius-md);
        padding-block: var(--ts-semantic-size-space-400);
        padding-inline: 0;
        overflow: auto;
        overscroll-behavior: none;
        top: 2px;

        /* Make sure it adheres to the popup's auto size */
        max-width: var(--auto-size-available-width);
        max-height: var(--auto-size-available-height);
    }

    .select__listbox ::slotted(ts-divider) {
        --spacing: var(--ts-semantic-size-space-400);
    }

    .select__listbox ::slotted(small) {
        display: block;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-bold);
        color: var(--ts-semantic-color-text-base-default);
        padding-block: var(--ts-semantic-size-space-100);
        padding-inline: var(--ts-semantic-size-space-750);
    }
`;
