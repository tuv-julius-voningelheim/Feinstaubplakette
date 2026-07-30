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
    .combobox {
        flex: 1 1 auto;
        display: inline-flex;
        width: 100%;
        position: relative;
        vertical-align: middle;
    }

    .combobox::part(popup) {
        z-index: var(--ts-semantic-distance-zindex-dropdown);
        background: none;
    }

    .combobox[data-current-placement^='top']::part(popup) {
        transform-origin: bottom;
    }

    .combobox[data-current-placement^='bottom']::part(popup) {
        transform-origin: top;
    }

    /* Combobox trigger */
    .combobox__trigger {
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
        cursor: text;
        transition:
            var(--ts-semantic-transition-duration-fast) color,
            var(--ts-semantic-transition-duration-fast) border,
            var(--ts-semantic-transition-duration-fast) box-shadow,
            var(--ts-semantic-transition-duration-fast) background-color;
    }

    .combobox__input {
        position: relative;
        width: 100%;
        font: inherit;
        border: none;
        background: none;
        color: var(--ts-semantic-color-text-base-default);
        cursor: text;
        overflow: hidden;
        padding: 0;
        margin: 0;
        -webkit-appearance: none;
    }

    .combobox__input::placeholder {
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .combobox:not(.combobox--disabled):hover .combobox__input {
        color: var(--ts-semantic-color-text-base-hover);
    }

    .combobox__input:focus {
        outline: none;
    }

    .combobox__value-input {
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

    /* Standard */
    .combobox--standard .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-base-default);
    }

    .combobox--standard:hover:not(.combobox--disabled):not(.combobox--error) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .combobox--standard.combobox--disabled .combobox__trigger {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        border-color: var(--ts-semantic-color-border-base-disabled);
        color: var(--ts-semantic-color-text-base-disabled);
        cursor: not-allowed;
        outline: none;
    }

    .combobox--standard:not(.combobox--disabled):not(.combobox--error).combobox--open .combobox__trigger,
    .combobox--standard:not(.combobox--disabled):not(.combobox--error).combobox--focused .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-primary-focused);
        box-shadow: 0 0 0 var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-primary-focused);
    }

    /* Error state for standard */
    .combobox--standard.combobox--error:not(.combobox--disabled) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    .combobox--standard.combobox--error:not(.combobox--disabled):hover .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .combobox--standard.combobox--error:not(.combobox--disabled).combobox--open .combobox__trigger,
    .combobox--standard.combobox--error:not(.combobox--disabled).combobox--focused .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-danger-default);
        box-shadow: 0 0 0 var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    /* Filled */
    .combobox--filled .combobox__trigger {
        border: none;
        background-color: var(--ts-semantic-color-background-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .combobox--filled:hover:not(.combobox--disabled):not(.combobox--error) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .combobox--filled.combobox--disabled .combobox__trigger {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        cursor: not-allowed;
    }

    .combobox--disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Locked state — focusable and openable, but not selectable */
    .combobox--standard.combobox--locked:not(.combobox--disabled) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .combobox--standard.combobox--locked:not(.combobox--disabled):hover:not(.combobox--error) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .combobox--standard.combobox--locked:not(.combobox--disabled):not(.combobox--error).combobox--open
        .combobox__trigger,
    .combobox--standard.combobox--locked:not(.combobox--disabled):not(.combobox--error).combobox--focused
        .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-primary-focused);
    }

    .combobox--filled.combobox--locked:not(.combobox--disabled) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .combobox--filled.combobox--locked:not(.combobox--disabled):hover:not(.combobox--error) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .combobox__lock-icon {
        color: var(--ts-semantic-color-icon-base-default);
        cursor: default;
        pointer-events: none;
    }

    .combobox--locked .combobox__listbox {
        cursor: not-allowed;
    }

    .combobox--locked .combobox__input {
        cursor: default;
    }

    .combobox--disabled .combobox__trigger {
        cursor: not-allowed;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .combobox--filled:not(.combobox--disabled):not(.combobox--error).combobox--open .combobox__trigger,
    .combobox--filled:not(.combobox--disabled):not(.combobox--error).combobox--focused .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Error state for filled */
    .combobox--filled.combobox--error:not(.combobox--disabled) .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    .combobox--filled.combobox--error:not(.combobox--disabled):hover .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .combobox--filled.combobox--error:not(.combobox--disabled).combobox--open .combobox__trigger,
    .combobox--filled.combobox--error:not(.combobox--disabled).combobox--focused .combobox__trigger {
        background-color: var(--ts-semantic-color-background-base-default);
        outline: solid 3px var(--ts-semantic-color-border-danger-default);
        outline-offset: 1px;
    }

    /* Sizes */
    .combobox--small .combobox__trigger {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        min-height: 1.875rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-400);
    }

    .combobox--small .combobox__clear {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .combobox--small .combobox__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-400);
    }

    .combobox--medium .combobox__trigger {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        min-height: 2.5rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-500);
    }

    .combobox--medium .combobox__clear {
        margin-inline-start: var(--ts-semantic-size-space-500);
    }

    .combobox--medium .combobox__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-500);
    }

    .combobox--large .combobox__trigger {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
        min-height: 3.125rem;
        padding-block: 0;
        padding-inline: var(--ts-semantic-size-space-600);
    }

    .combobox--large .combobox__clear {
        margin-inline-start: var(--ts-semantic-size-space-600);
    }

    .combobox--large .combobox__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-600);
    }

    /* Pills */
    .combobox--pill.combobox--small .combobox__trigger {
        border-radius: 1.875rem;
    }

    .combobox--pill.combobox--medium .combobox__trigger {
        border-radius: 2.5rem;
    }

    .combobox--pill.combobox--large .combobox__trigger {
        border-radius: 3.125rem;
    }

    /* Prefix and Suffix */
    .combobox__prefix,
    .combobox__suffix {
        flex: 0;
        display: inline-flex;
        align-items: center;
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .combobox__suffix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    /* Clear button */
    .combobox__clear {
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

    .combobox__clear:hover {
        color: var(--ts-semantic-color-icon-base-hover);
    }

    .combobox__clear:focus {
        outline: none;
    }

    /* Expand icon */
    .combobox__expand-icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        transition: var(--ts-semantic-transition-duration-medium) rotate ease;
        rotate: 0;
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .combobox--open .combobox__expand-icon {
        rotate: -180deg;
    }

    /* Listbox */
    .combobox__listbox {
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

        max-width: var(--auto-size-available-width);
        max-height: var(--auto-size-available-height);
    }

    .combobox__listbox ::slotted(ts-divider) {
        --spacing: var(--ts-semantic-size-space-400);
    }

    .combobox__listbox ::slotted(small) {
        display: block;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-bold);
        color: var(--ts-semantic-color-text-base-default);
        padding-block: var(--ts-semantic-size-space-100);
        padding-inline: var(--ts-semantic-size-space-750);
    }

    /* Hide slotted options that have been marked hidden by the filter logic */
    ::slotted([hidden]) {
        display: none !important;
    }

    /* No-options empty state */
    .combobox__no-options {
        display: block;
        padding-block: var(--ts-semantic-size-space-300);
        padding-inline: var(--ts-semantic-size-space-750);
        color: var(--ts-semantic-color-text-neutral-default);
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
    }

    /* Loading spinner inside the listbox */
    .combobox__loading-options {
        display: flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-400);
    }

    /* Loading spinner shown in the input suffix area */
    .combobox__loading-spinner {
        flex: 0 0 auto;
        font-size: 1rem;
        margin-inline-start: var(--ts-semantic-size-space-400);
        color: var(--ts-semantic-color-text-neutral-default);
    }
`;
