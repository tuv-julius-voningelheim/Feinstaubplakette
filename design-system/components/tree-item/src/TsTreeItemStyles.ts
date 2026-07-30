import { css } from 'lit';

export default css`
    :host {
        display: block;
        outline: 0;
        z-index: 0;
    }

    :host(:focus) {
        outline: none;
    }

    slot:not([name])::slotted(ts-icon) {
        margin-inline-end: var(--ts-semantic-size-space-100);
    }

    .tree-item {
        position: relative;
        display: flex;
        align-items: stretch;
        flex-direction: column;
        color: var(--ts-semantic-color-text-base-default);
        min-height: 30px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }

    .tree-item__checkbox {
        pointer-events: none;
    }

    .tree-item__expand-button,
    .tree-item__checkbox,
    .tree-item__label {
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        line-height: var(--ts-line-height-200);
    }

    .tree-item__checkbox::part(base) {
        display: flex;
        align-items: center;
    }

    .tree-item__indentation {
        display: block;
        width: 1em;
        flex-shrink: 0;
    }

    .tree-item__expand-button {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: content-box;
        color: var(--ts-semantic-color-icon-base-default);
        padding: var(--ts-semantic-size-space-200);
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        cursor: pointer;
    }

    .tree-item__expand-button {
        transition: var(--ts-semantic-transition-duration-medium) rotate ease;
    }

    .tree-item--expanded .tree-item__expand-button {
        rotate: 90deg;
    }

    .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
        rotate: -90deg;
    }

    .tree-item--expanded slot[name='expand-icon'],
    .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
        display: none;
    }

    .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
        display: none;
    }

    .tree-item__expand-button--visible {
        cursor: pointer;
    }

    .tree-item__item {
        display: flex;
        align-items: center;
        border-inline-start: solid 3px transparent;
        min-height: 30px;
    }

    .tree-item--disabled .tree-item__item {
        opacity: 0.5;
        outline: none;
        cursor: not-allowed;
    }

    :host(:focus-visible) .tree-item__item {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
        border-radius: var(--ts-semantic-size-radius-md);
        z-index: 2;
    }

    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
        border-inline-start-color: var(--ts-semantic-color-border-primary-default);
    }

    :host(:not([aria-disabled='true'])) .tree-item__expand-button {
        color: var(--ts-semantic-color-text-base-default);
    }

    .tree-item__label {
        display: flex;
        align-items: center;
        transition: var(--ts-semantic-transition-duration-medium) color;
    }

    .tree-item__children {
        display: block;
        font-size: calc(1em + var(--indent-size, var(--ts-semantic-size-space-400)));
    }

    /* Indentation lines */
    .tree-item__children {
        position: relative;
    }

    .tree-item__children::before {
        content: '';
        position: absolute;
        top: var(--indent-guide-offset);
        bottom: var(--indent-guide-offset);
        left: calc(1em - (var(--indent-guide-width) / 2) - 1px);
        border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);
        z-index: 1;
    }

    .tree-item--rtl .tree-item__children::before {
        left: auto;
        right: 1em;
    }

    @media (forced-colors: active) {
        :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
            outline: dashed 1px SelectedItem;
        }
    }
`;
