import { css } from 'lit';

export default css`
    :host {
        --size: 25rem;
        --header-spacing: var(--ts-semantic-size-space-600);
        --body-spacing: var(--ts-semantic-size-space-600);
        --footer-spacing: var(--ts-semantic-size-space-600);
        display: contents;
    }

    .drawer {
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        color: var(--ts-semantic-color-text-base-default);
    }

    .drawer--contained {
        position: absolute;
        z-index: initial;
    }

    .drawer--fixed {
        position: fixed;
        z-index: var(--ts-semantic-distance-zindex-drawer);
    }

    .drawer__panel {
        position: absolute;
        display: flex;
        flex-direction: column;
        z-index: 2;
        max-width: 100%;
        max-height: 100%;
        background-color: var(--ts-semantic-color-surface-base-default);
        box-shadow: var(--ts-semantic-shadow-light-xl);
        overflow: auto;
        pointer-events: all;
    }

    .drawer__panel:focus {
        outline: none;
    }

    .drawer--top .drawer__panel {
        top: 0;
        inset-inline-end: auto;
        bottom: auto;
        inset-inline-start: 0;
        width: 100%;
        height: var(--size);
    }

    .drawer--end .drawer__panel {
        top: 0;
        inset-inline-end: 0;
        bottom: auto;
        inset-inline-start: auto;
        width: var(--size);
        height: 100%;
    }

    .drawer--bottom .drawer__panel {
        top: auto;
        inset-inline-end: auto;
        bottom: 0;
        inset-inline-start: 0;
        width: 100%;
        height: var(--size);
    }

    .drawer--start .drawer__panel {
        top: 0;
        inset-inline-end: auto;
        bottom: auto;
        inset-inline-start: 0;
        width: var(--size);
        height: 100%;
    }

    .drawer__header {
        display: flex;
    }

    .drawer__title {
        flex: 1 1 auto;
        font: inherit;
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
        line-height: 1.4;
        padding: var(--header-spacing);
        margin: 0;
    }

    .drawer__header-actions {
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        gap: var(--ts-semantic-size-space-100);
        padding: 0 var(--header-spacing);
    }

    .drawer__header-actions ts-icon-button,
    .drawer__header-actions ::slotted(ts-icon-button) {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    .drawer__body {
        flex: 1 1 auto;
        display: block;
        padding: var(--body-spacing);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .drawer__footer {
        text-align: right;
        padding: var(--footer-spacing);
    }

    .drawer__footer ::slotted(ts-button:not(:last-of-type)) {
        margin-inline-end: var(--ts-semantic-size-space-300);
    }

    .drawer:not(.drawer--has-footer) .drawer__footer {
        display: none;
    }

    .drawer__overlay {
        display: block;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: var(--ts-semantic-color-background-neutral-disabled);
        pointer-events: all;
    }

    .drawer--contained .drawer__overlay {
        display: none;
    }

    @media (forced-colors: active) {
        .drawer__panel {
            border: solid 1px var(--ts-semantic-color-border-base-default);
        }
    }
`;
