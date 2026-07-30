import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .form-control__label--has-icon {
        display: inline-flex !important;
        align-items: center;
        gap: var(--ts-semantic-size-space-100, 0.25rem);
    }

    .form-control__label--has-icon ::slotted([slot='label-icon']) {
        display: inline-flex !important;
        align-items: center;
        flex-shrink: 0;
        line-height: 1;
        vertical-align: middle;
    }

    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .input {
        flex: 1 1 auto;
        display: inline-flex;
        align-items: stretch;
        justify-content: start;
        position: relative;
        width: 100%;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-semantic-typography-font-weight-regular);
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

    /* Standard inputs */
    .input--standard {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-base-default);
    }

    .input--standard:hover:not(.input--disabled):not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .input--standard:focus-within:not(.input--disabled):not(.input--error),
    .input--standard.input--focused:not(.input--disabled):not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-primary-focused);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-primary-focused);
    }

    .input--standard:focus-within:not(.input--disabled):not(.input--error) .input__control,
    .input--standard.input--focused:not(.input--disabled):not(.input--error) .input__control {
        color: var(--ts-semantic-color-text-base-default);
    }

    /* Error state for standard */
    .input--standard.input--error:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-danger-default);
    }

    .input--standard.input--error:not(.input--disabled):hover {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .input--standard.input--error:not(.input--disabled):focus-within,
    .input--standard.input--error.input--focused:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-danger-default);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-danger-default);
    }

    .input--standard.input--disabled {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        border-color: var(--ts-semantic-color-border-base-disabled);
        cursor: not-allowed;
    }

    .input--standard.input--disabled .input__control {
        color: var(--ts-semantic-color-text-base-disabled);
        cursor: not-allowed;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .input--standard.input--disabled .input__control::placeholder {
        color: var(--ts-semantic-color-text-base-disabled);
    }

    /* Success state for standard */
    .input--standard.input--success:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-success-default);
    }

    .input--standard.input--success:not(.input--disabled):hover {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-success-default);
    }

    .input--standard.input--success:not(.input--disabled):focus-within,
    .input--standard.input--success.input--focused:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-success-default);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-success-default);
    }

    /* Success icon — inherits size/layout from .input__clear, only overrides color and disables pointer */
    .input__success-icon {
        color: var(--ts-semantic-color-border-success-default);
        cursor: default;
        pointer-events: none;
    }

    /* Warning state for standard */
    .input--standard.input--warning:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-warning-default);
    }

    .input--standard.input--warning:not(.input--disabled):hover {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-warning-default);
    }

    .input--standard.input--warning:not(.input--disabled):focus-within,
    .input--standard.input--warning.input--focused:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-warning-default);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-warning-default);
    }

    /* Warning icon — inherits size/layout from .input__clear, only overrides color and disables pointer */
    .input__warning-icon {
        color: var(--ts-semantic-color-border-warning-default);
        cursor: default;
        pointer-events: none;
    }

    /* Filled inputs */
    .input--filled {
        border: none;
        background-color: var(--ts-semantic-color-background-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .input--filled:hover:not(.input--disabled):not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .input--filled:focus-within:not(.input--disabled):not(.input--error),
    .input--filled.input--focused:not(.input--disabled):not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-default);
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Error state for filled */
    .input--filled.input--error:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        border: solid 2px var(--ts-semantic-color-border-danger-default);
    }

    .input--filled.input--error:not(.input--disabled):hover {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .input--filled.input--error:not(.input--disabled):focus-within,
    .input--filled.input--error.input--focused:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-default);
        outline: solid 3px var(--ts-semantic-color-border-danger-default);
        outline-offset: 1px;
    }

    .input--filled.input--disabled {
        background-color: var(--ts-semantic-color-background-neutral-subtle-disabled);
        cursor: not-allowed;
    }

    /* Override the base .input cursor and allow not-allowed to show from host */
    .input--disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    .input--disabled .input__control {
        cursor: not-allowed;
        pointer-events: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .input__control {
        flex: 1 1 auto;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        min-width: 0;
        height: 100%;
        color: var(--ts-semantic-color-text-base-default);
        border: none;
        background: inherit;
        box-shadow: none;
        padding: 0;
        margin: 0;
        cursor: inherit;
        -webkit-appearance: none;
    }

    .input__control::-webkit-search-decoration,
    .input__control::-webkit-search-cancel-button,
    .input__control::-webkit-search-results-button,
    .input__control::-webkit-search-results-decoration {
        -webkit-appearance: none;
    }

    .input__control:-webkit-autofill,
    .input__control:-webkit-autofill:hover,
    .input__control:-webkit-autofill:focus,
    .input__control:-webkit-autofill:active {
        box-shadow: 0 0 0 3.125rem var(--ts-semantic-color-background-base-hover) inset !important;
        -webkit-text-fill-color: #3c83f6;
        caret-color: var(--ts-semantic-color-text-base-default);
    }

    .input--filled .input__control:-webkit-autofill,
    .input--filled .input__control:-webkit-autofill:hover,
    .input--filled .input__control:-webkit-autofill:focus,
    .input--filled .input__control:-webkit-autofill:active {
        box-shadow: 0 0 0 3.125rem var(--ts-semantic-color-background-base-default) inset !important;
    }

    .input__control::placeholder {
        color: var(--ts-semantic-color-text-neutral-default);
        user-select: none;
        -webkit-user-select: none;
    }

    .input:hover:not(.input--disabled) .input__control {
        color: var(--ts-semantic-color-text-base-hover);
    }

    .input__control:focus {
        outline: none;
    }

    .input__prefix,
    .input__suffix {
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        cursor: default;
    }

    .input__prefix ::slotted(ts-icon),
    .input__suffix ::slotted(ts-icon) {
        color: var(--ts-semantic-color-icon-base-default);
    }

    /*
   * Size modifiers
   */

    .input--small {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        height: 32px;
    }

    .input--small .input__control {
        height: 100%;
        padding: 0 var(--ts-semantic-size-space-400);
    }

    .input--small .input__clear,
    .input--small .input__password-toggle {
        width: calc(1em + var(--ts-semantic-size-space-400) * 2);
    }

    .input--small .input__prefix ::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .input--small .input__suffix ::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-400);
    }

    .input--medium {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        height: 40px;
    }

    .input--medium .input__control {
        height: 100%;
        padding: 0 var(--ts-semantic-size-space-400);
    }

    .input--medium .input__clear,
    .input--medium .input__password-toggle {
        width: calc(1em + var(--ts-semantic-size-space-400) * 2);
    }

    .input--medium .input__prefix ::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .input--medium .input__suffix ::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-400);
    }

    .input--large {
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
        height: 48px;
    }

    .input--large .input__control {
        height: 100%;
        padding: 0 var(--ts-semantic-size-space-600);
    }

    .input--large .input__clear,
    .input--large .input__password-toggle {
        width: calc(1em + var(--ts-semantic-size-space-600) * 2);
    }

    .input--large .input__prefix ::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-600);
    }

    .input--large .input__suffix ::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-600);
    }

    /*
   * Pill modifier
   */

    .input--pill.input--small {
        border-radius: 32px;
    }

    .input--pill.input--medium {
        border-radius: 40px;
    }

    .input--pill.input--large {
        border-radius: 48px;
    }

    /*
   * Clearable + Password Toggle
   */

    .input__clear,
    .input__password-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
        color: var(--ts-semantic-color-text-base-default);
        border: none;
        background: none;
        padding: 0;
        transition: var(--ts-semantic-transition-duration-fast);
        cursor: pointer;
    }

    .input__clear:hover,
    .input__password-toggle:hover {
        color: var(--ts-semantic-color-icon-base-hover);
    }

    .input__clear:focus,
    .input__password-toggle:focus {
        outline: none;
    }

    /* Locked state — focusable, selectable, copyable, but not editable */
    .input--standard.input--locked:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .input--standard.input--locked:not(.input--disabled):hover:not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
    }

    .input--standard.input--locked:not(.input--disabled):focus-within:not(.input--error),
    .input--standard.input--locked.input--focused:not(.input--disabled):not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-hover);
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-primary-focused);
    }

    .input--filled.input--locked:not(.input--disabled) {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .input--filled.input--locked:not(.input--disabled):hover:not(.input--error) {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .input__lock-icon {
        color: var(--ts-semantic-color-icon-base-default);
        cursor: default;
        pointer-events: none;
    }

    /* Don't show the browser's password toggle in Edge */
    ::-ms-reveal {
        display: none;
    }

    /* Hide the built-in number spinner */
    .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
    .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        display: none;
    }

    .input--no-spin-buttons input[type='number'] {
        -moz-appearance: textfield;
    }
`;
