import { css } from 'lit';

export default css`
    :host {
        display: block;
        user-select: none;
        -webkit-user-select: none;
    }

    :host(:focus) {
        outline: none;
    }

    .option {
        position: relative;
        display: flex;
        align-items: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        line-height: var(--ts-line-height-200);
        color: var(--ts-semantic-color-text-base-default);
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-300)
            var(--ts-semantic-size-space-300);
        transition: var(--ts-semantic-transition-duration-fast) fill;
        cursor: pointer;
    }

    .option--hover:not(.option--disabled):not(.option--selected),
    .option--current:not(.option--disabled):not(.option--selected) {
        background-color: var(--ts-semantic-color-background-base-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .option--current,
    .option--current.option--disabled {
        opacity: 1;
    }

    .option--disabled {
        outline: none;
        opacity: 0.5;
        cursor: not-allowed;
    }

    .option__label {
        flex: 1 1 auto;
        display: inline-block;
        line-height: var(--ts-line-height-200);
    }

    .option .option__check {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        padding-inline-end: var(--ts-semantic-size-space-100);
    }

    .option--selected .option__check {
        visibility: visible;
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .option--selected {
        background-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .option--selected.option--hover:not(.option--disabled),
    .option--selected.option--current:not(.option--disabled) {
        background-color: var(--ts-semantic-color-background-primary-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .option__prefix,
    .option__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        color: currentColor;
    }

    .option__prefix::slotted(*),
    .option__suffix::slotted(*) {
        color: currentColor;
    }

    .option__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-100);
    }

    .option__suffix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    .option__prefix::slotted(svg),
    .option__suffix::slotted(svg),
    .option__prefix::slotted(ts-icon),
    .option__suffix::slotted(ts-icon) {
        fill: currentColor;
        color: currentColor;
    }

    @media (forced-colors: active) {
        :host(:hover:not([aria-disabled='true'])) .option {
            outline: dashed 1px SelectedItem;
            outline-offset: -1px;
        }
    }
`;
