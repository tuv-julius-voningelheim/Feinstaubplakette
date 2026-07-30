import { css } from 'lit';

export default css`
    :host {
        --width: 31rem;
        --header-spacing: var(--ts-semantic-size-space-600);
        --body-spacing: var(--ts-semantic-size-space-600);
        --footer-spacing: var(--ts-semantic-size-space-600);
        display: contents;
    }

    .dialog {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: var(--ts-semantic-distance-zindex-dialog);
        color: var(--ts-semantic-color-text-base-default);
    }

    .dialog__panel {
        display: flex;
        flex-direction: column;
        z-index: 2;
        width: var(--width);
        max-width: calc(100% - var(--ts-semantic-size-space-800));
        max-height: calc(100% - var(--ts-semantic-size-space-800));
        background-color: var(--ts-semantic-color-surface-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        box-shadow: var(--ts-semantic-shadow-light-xl);
    }

    .dialog__panel:focus {
        outline: none;
    }

    @media screen and (max-width: 420px) {
        .dialog__panel {
            max-height: 80vh;
        }
    }

    .dialog--open .dialog__panel {
        display: flex;
        opacity: 1;
    }

    .dialog__header {
        flex: 0 0 auto;
        display: flex;
    }

    .dialog__title {
        flex: 1 1 auto;
        font: inherit;
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
        line-height: 1.4;
        padding: var(--header-spacing);
        margin: 0;
    }

    .dialog__header-actions {
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        gap: var(--ts-semantic-size-space-100);
        padding: 0 var(--header-spacing);
    }

    .dialog__header-actions ts-icon-button,
    .dialog__header-actions ::slotted(ts-icon-button) {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    .dialog__body {
        flex: 1 1 auto;
        display: block;
        padding: var(--body-spacing);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    :host([no-body-padding]) .dialog__body {
        padding: 0;
    }

    .dialog__footer {
        flex: 0 0 auto;
        text-align: right;
        padding: var(--footer-spacing);
    }

    .dialog__footer ::slotted(ts-button:not(:first-of-type)) {
        margin-inline-start: var(--ts-semantic-size-space-300);
    }

    .dialog:not(.dialog--has-footer) .dialog__footer {
        display: none;
    }

    .dialog__overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: var(--ts-semantic-color-background-neutral-disabled);
    }

    @media (forced-colors: active) {
        .dialog__panel {
            border: solid 1px var(--ts-semantic-color-border-base-default);
        }
    }

    /* Without-modal: let clicks pass through the full-screen wrapper to background content */
    .dialog--without-modal {
        pointer-events: none;
    }

    .dialog--without-modal .dialog__panel {
        pointer-events: auto;
        border: 1px solid var(--ts-semantic-color-border-base-default);
    }
`;
