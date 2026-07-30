import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
    }

    .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        color: var(--ts-semantic-color-text-base-default);
        padding: 0 var(--ts-semantic-size-space-600);
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        transition:
            var(--transition-speed) box-shadow,
            var(--transition-speed) color;
        min-height: 44px;
        box-sizing: border-box;
    }

    .tab-top {
        border-radius: var(--ts-semantic-size-radius-md) var(--ts-semantic-size-radius-md) 0 0;
    }

    .tab-bottom {
        border-radius: 0 0 var(--ts-semantic-size-radius-md) var(--ts-semantic-size-radius-md);
    }

    .tab-start {
        border-radius: var(--ts-semantic-size-radius-md) 0 0 var(--ts-semantic-size-radius-md);
    }

    .tab-end {
        border-radius: 0 var(--ts-semantic-size-radius-md) var(--ts-semantic-size-radius-md) 0;
    }

    .tab:hover:not(.tab--disabled) {
        color: var(--ts-semantic-color-text-primary-default);
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    :host(:focus) {
        outline: transparent;
    }

    :host(:focus-visible) {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: -2px;
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .tab.tab--active:not(.tab--disabled) {
        color: var(--ts-semantic-color-text-primary-default);
    }

    .tab.tab--closable {
        padding-inline-end: var(--ts-semantic-size-space-400);
    }

    .tab.tab--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .tab__close-button {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        margin-inline-start: var(--ts-semantic-size-space-400);
    }

    .tab__close-button::part(base) {
        padding: var(--ts-semantic-size-space-50);
    }

    .tab__close-button:focus-within {
    }

    @media (forced-colors: active) {
        .tab.tab--active:not(.tab--disabled) {
            outline: solid 2px transparent;
            outline-offset: -3px;
        }
    }
`;
