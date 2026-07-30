import { css } from 'lit';

export default css`
    :host {
        display: inline-flex;
    }

    .breadcrumb-item {
        display: inline-flex;
        align-items: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        color: var(--ts-semantic-color-text-base-default);
        line-height: var(--ts-line-height-300);
        white-space: nowrap;
    }

    .breadcrumb-item__label {
        display: inline-block;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        text-decoration: none;
        color: inherit;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transition: var(--ts-semantic-transition-duration-fast) --color;
    }

    :host(:not(:last-of-type)) .breadcrumb-item__label {
        color: var(--ts-semantic-color-text-primary-default);
    }

    :host(:not(:last-of-type)) .breadcrumb-item__label:hover {
        color: var(--ts-semantic-color-text-primary-hover);
    }

    :host(:not(:last-of-type)) .breadcrumb-item__label:active {
        color: var(--ts-semantic-color-text-primary-default);
    }

    :host(:not(:last-of-type)) ::slotted(a) {
        color: var(--ts-semantic-color-text-primary-default);
    }

    :host(:not(:last-of-type)) ::slotted(a:hover) {
        color: var(--ts-semantic-color-text-primary-hover);
    }

    :host(:not(:last-of-type)) ::slotted(a:active) {
        color: var(--ts-semantic-color-text-primary-default);
    }

    .breadcrumb-item__label--button {
        cursor: default;
    }

    .breadcrumb-item__label:focus {
        outline: none;
    }

    .breadcrumb-item__label:focus-visible {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        border-radius: 2px;
        outline-offset: 2px;
    }

    ::slotted(a) {
        text-decoration: none;
        color: inherit;
    }

    ::slotted(a:focus) {
        outline: none;
    }

    ::slotted(a:focus-visible) {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        border-radius: 2px;
        outline-offset: 2px;
    }

    .breadcrumb-item__prefix,
    .breadcrumb-item__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .breadcrumb-item__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .breadcrumb-item__prefix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .breadcrumb-item--has-prefix .breadcrumb-item__prefix {
        display: inline-flex;
        margin-inline-end: var(--ts-semantic-size-space-300);
    }

    .breadcrumb-item--has-suffix .breadcrumb-item__suffix {
        display: inline-flex;
        margin-inline-start: var(--ts-semantic-size-space-300);
    }

    :host(:last-of-type) .breadcrumb-item__separator {
        display: none;
    }

    .breadcrumb-item__separator {
        display: inline-flex;
        align-items: center;
        margin: 0 var(--ts-semantic-size-space-200);
        color: var(--ts-semantic-color-icon-base-default);
        user-select: none;
        -webkit-user-select: none;
    }
`;
