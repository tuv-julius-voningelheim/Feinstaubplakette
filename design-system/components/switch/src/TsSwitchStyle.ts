import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
    }

    :host,
    :host([size='medium']) {
        --height: 24px;
        --thumb-size: calc(var(--height) - 5px);
        --width: calc(var(--height) * 2);
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    :host([size='small']) {
        --height: 20px;
        --thumb-size: calc(var(--height) - 5px);
        --width: calc(var(--height) * 2);
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
    }

    :host([size='large']) {
        --height: 32px;
        --thumb-size: calc(var(--height) - 5px);
        --width: calc(var(--height) * 2);
        font-size: var(--ts-semantic-typography-ui-font-size-lg);
    }

    .switch {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: inherit;
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        color: var(--ts-semantic-color-text-base-default);
        vertical-align: middle;
        cursor: pointer;
    }

    .switch__control {
        flex: 0 0 auto;
        position: relative;
        display: inline-flex;
        align-items: center;
        width: var(--width);
        height: var(--height);
        background-color: var(--ts-semantic-color-background-neutral-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-neutral-default);
        border-radius: 9999px;
        box-sizing: border-box;
        transition:
            var(--ts-semantic-transition-duration-fast) border-color,
            var(--ts-semantic-transition-duration-fast) background-color;
    }

    .switch__control .switch__thumb {
        position: absolute;
        left: 2px;
        top: 50%;
        transform: translateY(-50%);
        width: var(--thumb-size);
        height: var(--thumb-size);
        background-color: var(--ts-semantic-color-background-base-default);
        border-radius: 50%;
        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.25));
        transition:
            var(--ts-semantic-transition-duration-fast) left ease,
            var(--ts-semantic-transition-duration-fast) background-color,
            var(--ts-semantic-transition-duration-fast) border-color,
            var(--ts-semantic-transition-duration-fast) box-shadow;
        box-sizing: border-box;
    }

    .switch__input {
        position: absolute;
        opacity: 0;
        padding: 0;
        margin: 0;
        pointer-events: none;
    }

    /* Hover */
    .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
        background-color: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-border-neutral-hover);
    }

    /* Focus */
    .switch:not(.switch--checked):not(.switch--disabled):not(.switch--error)
        .switch__input:focus-visible
        ~ .switch__control {
        background-color: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-border-neutral-hover);
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 2px;
    }

    .switch:not(.switch--checked):not(.switch--disabled):not(.switch--checked):not(.switch--error)
        .switch__input:focus-visible
        ~ .switch__control
        .switch__thumb {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-neutral-default);
    }

    /* Checked */
    .switch--checked .switch__control {
        background-color: var(--ts-semantic-color-background-primary-default);
        border-color: var(--ts-semantic-color-border-primary-default);
    }

    .switch--checked .switch__control .switch__thumb {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-primary-default);
        left: calc(var(--width) - var(--thumb-size) - 4px);
    }

    /* Checked + hover */
    .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
        background-color: var(--ts-semantic-color-background-primary-hover);
        border-color: var(--ts-semantic-color-border-primary-hover);
    }

    /* Checked + focus */
    .switch.switch--checked:not(.switch--disabled):not(.switch--error) .switch__input:focus-visible ~ .switch__control {
        background-color: var(--ts-semantic-color-background-primary-default);
        border-color: var(--ts-semantic-color-border-primary-default);
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 2px;
    }

    .switch.switch--checked:not(.switch--disabled):not(.switch--error)
        .switch__input:focus-visible
        ~ .switch__control
        .switch__thumb {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-primary-default);
    }

    /* Disabled */
    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    :host([disabled]) .switch {
        pointer-events: none;
    }

    .switch--disabled {
        cursor: not-allowed;
    }

    /* Label */
    .switch__label {
        display: inline-block;
        line-height: var(--height);
        margin-inline-start: 0.5em;
        user-select: none;
        -webkit-user-select: none;
    }

    .switch__label--has-icon {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }

    /* Required star */
    :host([required]) .switch__label::after {
        content: '*';
        color: var(--ts-semantic-color-text-danger-default);
        margin-inline-start: 2px;
    }

    /* Error base (unchecked) — danger border + danger background on track only */
    .switch--error:not(.switch--disabled) .switch__control {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    /* Error + hover (unchecked) */
    .switch--error:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    /* Error + checked */
    .switch--error.switch--checked:not(.switch--disabled) .switch__control {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    /* Error + checked hover */
    .switch--error.switch--checked:not(.switch--disabled) .switch__control:hover {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    /* Error focus — same primary outline as normal focus */
    .switch--error:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 2px;
    }

    /* Indent to align under label text, after the switch control + gap */
    .form-control--has-help-text .form-control__help-text {
        padding-inline-start: calc(var(--width) + 0.7em);
        margin-top: 0;
    }

    .form-control--has-help-text.form-control--small .form-control__help-text {
        font-size: var(--ts-font-size-100);
    }

    .form-control--has-help-text.form-control--medium .form-control__help-text {
        font-size: var(--ts-font-size-100);
    }

    .form-control--has-help-text.form-control--large .form-control__help-text {
        font-size: var(--ts-font-size-200);
    }

    @media (forced-colors: active) {
        .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb,
        .switch--checked .switch__control .switch__thumb {
            background-color: ButtonText;
        }
    }
`;
