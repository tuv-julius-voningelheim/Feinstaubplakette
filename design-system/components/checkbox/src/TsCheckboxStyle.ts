import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
    }

    .checkbox {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 0.5em;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        color: var(--ts-semantic-color-text-base-default);
        vertical-align: middle;
        cursor: pointer;
    }

    .checkbox__label--has-icon {
        display: inline-flex !important;
        align-items: center;
        gap: var(--ts-semantic-size-space-100, 0.25rem);
    }

    .checkbox__label--has-icon ::slotted([slot='label-icon']) {
        display: inline-flex !important;
        align-items: center;
        flex-shrink: 0;
        line-height: 1;
        vertical-align: middle;
    }

    .checkbox--small {
        --toggle-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-size: var(--ts-font-size-100);
    }

    .checkbox--medium {
        --toggle-size: var(--ts-semantic-typography-ui-font-size-md);
        font-size: var(--ts-font-size-200);
    }

    .checkbox--large {
        --toggle-size: var(--ts-semantic-typography-ui-font-size-md);
        font-size: var(--ts-font-size-300);
    }

    .checkbox__control {
        flex: 0 0 auto;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--toggle-size);
        height: var(--toggle-size);
        border: solid var(--ts-semantic-size-width-sm) var(--ts-semantic-color-border-base-default);
        border-radius: 2px;
        background-color: var(--ts-semantic-color-background-base-default);
        color: var(--ts-semantic-color-text-inverted-default);
        transition:
            var(--ts-semantic-transition-duration-fast) border-color,
            var(--ts-semantic-transition-duration-fast) background-color,
            var(--ts-semantic-transition-duration-fast) color;
    }

    .checkbox__input {
        position: absolute;
        opacity: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
    }

    .checkbox__checked-icon,
    .checkbox__indeterminate-icon {
        display: inline-flex;
        color: var(--ts-semantic-color-text-inverted-default);
        width: var(--toggle-size);
        height: var(--toggle-size);
    }

    /* Label: takes remaining width so multi-line text wraps within its column */
    .checkbox__label {
        flex: 1;
        min-width: 0;
        color: var(--ts-semantic-color-text-base-default);
        line-height: var(--toggle-size);
        user-select: none;
        -webkit-user-select: none;
    }

    :host([required]) .checkbox__label::after {
        content: '*';
        color: var(--ts-semantic-color-text-danger-default);
        margin-inline-start: 2px;
    }

    /* Help text: indent to align under the label text, not under the box */
    .form-control--has-help-text .form-control__help-text {
        margin-top: var(--ts-semantic-size-space-50);
    }

    .form-control--has-help-text.form-control--small .form-control__help-text {
        padding-inline-start: calc(var(--ts-semantic-typography-ui-font-size-sm) + 0.6em);
        font-size: var(--ts-font-size-100);
    }

    .form-control--has-help-text.form-control--medium .form-control__help-text {
        padding-inline-start: calc(var(--ts-semantic-typography-ui-font-size-md) + 0.7em);
        font-size: var(--ts-font-size-100);
    }

    .form-control--has-help-text.form-control--large .form-control__help-text {
        padding-inline-start: calc(var(--ts-semantic-typography-ui-font-size-md) + 0.7em);
        font-size: var(--ts-font-size-200);
    }

    /* Hover */
    .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    /* Focus */
    .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Checked/indeterminate */
    .checkbox--checked .checkbox__control,
    .checkbox--indeterminate .checkbox__control {
        border-color: var(--ts-semantic-color-border-primary-default);
        background-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Checked/indeterminate + hover */
    .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
    .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
        background-color: var(--ts-semantic-color-background-primary-hover);
    }

    /* Checked/indeterminate + focus */
    .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
    .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Disabled */
    :host([disabled]) {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .checkbox--disabled {
        pointer-events: none;
    }

    /* Error state */
    .checkbox--error .checkbox__control {
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .checkbox--error.checkbox--checked .checkbox__control,
    .checkbox--error.checkbox--indeterminate .checkbox__control {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .checkbox--error .checkbox__checked-icon,
    .checkbox--error .checkbox__indeterminate-icon {
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Error + hover (unchecked) */
    .checkbox--error:not(.checkbox--checked):not(.checkbox--indeterminate):not(.checkbox--disabled)
        .checkbox__control:hover {
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    /* Error + hover (checked/indeterminate) */
    .checkbox--error.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
    .checkbox--error.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
        background-color: var(--ts-semantic-color-background-danger-hover);
    }

    /* Error + focus (unchecked) */
    .checkbox--error:not(.checkbox--checked):not(.checkbox--indeterminate):not(.checkbox--disabled)
        .checkbox__input:focus-visible
        ~ .checkbox__control {
        outline: solid 3px var(--ts-semantic-color-border-danger-default);
        outline-offset: 1px;
    }

    /* Error + focus (checked/indeterminate) */
    .checkbox--error.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
    .checkbox--error.checkbox--indeterminate:not(.checkbox--disabled)
        .checkbox__input:focus-visible
        ~ .checkbox__control {
        outline: solid 3px var(--ts-semantic-color-border-danger-default);
        outline-offset: 1px;
    }
`;
