import { css } from 'lit';

export default css`
    :host {
        display: inline-flex;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }

    .pagination-item,
    ::slotted(a.pagination-item) {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: var(--ts-semantic-size-radius-md) !important;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif !important;
        font-weight: var(--ts-semantic-typography-font-weight-medium) !important;
        cursor: pointer !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        white-space: nowrap !important;
        transition:
            var(--ts-semantic-transition-duration-xfast) background-color,
            var(--ts-semantic-transition-duration-xfast) color,
            var(--ts-semantic-transition-duration-xfast) border,
            var(--ts-semantic-transition-duration-xfast) box-shadow !important;
        padding: 0 var(--ts-semantic-size-space-200, 6px) !important;
        border: 1px solid transparent !important;
        background: none !important;
        text-decoration: none !important;
        box-sizing: border-box !important;
    }

    .pagination-item:focus,
    ::slotted(a.pagination-item:focus) {
        outline: none !important;
    }

    .pagination-item:focus-visible,
    ::slotted(a.pagination-item:focus-visible) {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused) !important;
        outline-offset: 1px !important;
    }

    /* Size modifiers */
    .pagination-item--small,
    ::slotted(a.pagination-item--small) {
        height: 32px !important;
        min-width: 32px !important;
        font-size: var(--ts-font-size-200) !important;
    }

    .pagination-item--medium,
    ::slotted(a.pagination-item--medium) {
        height: 40px !important;
        min-width: 40px !important;
        font-size: var(--ts-font-size-200) !important;
    }

    .pagination-item--large,
    ::slotted(a.pagination-item--large) {
        height: 48px !important;
        min-width: 48px !important;
        font-size: var(--ts-font-size-300) !important;
    }

    /* Outlined variant — default (inactive) */
    .pagination-item--outlined,
    ::slotted(a.pagination-item--outlined) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-base-default, #d1d1d1) !important;
        background: var(--ts-semantic-color-background-none, rgba(255, 255, 255, 0)) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    /* Outlined variant — hover */
    .pagination-item--outlined:hover:not(.pagination-item--disabled):not(.pagination-item--ellipsis):not(
            .pagination-item--active
        ),
    ::slotted(
        a.pagination-item--outlined:hover:not(.pagination-item--disabled):not(.pagination-item--ellipsis):not(
                .pagination-item--active
            )
    ) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-hover, #1e3b8a) !important;
        background: var(--ts-semantic-color-background-primary-hover, #1e3b8a) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Outlined variant — active (selected page) */
    .pagination-item--outlined.pagination-item--active,
    ::slotted(a.pagination-item--outlined.pagination-item--active) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-active, #0b253b) !important;
        background: var(--ts-semantic-color-background-primary-active, #0b253b) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    .pagination-item--outlined.pagination-item--active:hover:not(.pagination-item--disabled),
    ::slotted(a.pagination-item--outlined.pagination-item--active:hover:not(.pagination-item--disabled)) {
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-active, #0b253b) !important;
        background: var(--ts-semantic-color-background-primary-active, #0b253b) !important;
    }

    /* Text variant */
    .pagination-item--text,
    ::slotted(a.pagination-item--text) {
        border-color: transparent !important;
        color: var(--ts-semantic-color-text-base-default) !important;
        background-color: transparent !important;
    }

    .pagination-item--text:hover:not(.pagination-item--disabled):not(.pagination-item--ellipsis),
    ::slotted(a.pagination-item--text:hover:not(.pagination-item--disabled):not(.pagination-item--ellipsis)) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-hover, #1e3b8a) !important;
        background: var(--ts-semantic-color-background-primary-hover, #1e3b8a) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .pagination-item--text:active:not(.pagination-item--disabled):not(.pagination-item--ellipsis),
    ::slotted(a.pagination-item--text:active:not(.pagination-item--disabled):not(.pagination-item--ellipsis)) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-active, #0b253b) !important;
        background: var(--ts-semantic-color-background-primary-active, #0b253b) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .pagination-item--text.pagination-item--active,
    ::slotted(a.pagination-item--text.pagination-item--active) {
        border-radius: var(--ts-semantic-size-radius-md, 4px) !important;
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-active, #0b253b) !important;
        background: var(--ts-semantic-color-background-primary-active, #0b253b) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
        font-weight: var(--ts-semantic-typography-font-weight-bold, 700) !important;
    }

    .pagination-item--text.pagination-item--active:hover:not(.pagination-item--disabled),
    ::slotted(a.pagination-item--text.pagination-item--active:hover:not(.pagination-item--disabled)) {
        border: var(--ts-semantic-size-width-xs, 1px) solid var(--ts-semantic-color-border-primary-active, #0b253b) !important;
        background: var(--ts-semantic-color-background-primary-active, #0b253b) !important;
    }

    /* Disabled */
    .pagination-item--disabled,
    ::slotted(a.pagination-item--disabled) {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
    }

    /* Ellipsis */
    .pagination-item--ellipsis,
    ::slotted(a.pagination-item--ellipsis) {
        cursor: default !important;
        pointer-events: none !important;
        border-color: transparent !important;
    }

    /* Nav buttons (prev/next) */
    .pagination-item--nav,
    ::slotted(a.pagination-item--nav) {
        font-size: inherit !important;
    }

    .pagination-item--nav:hover:not(.pagination-item--disabled),
    .pagination-item--nav:active:not(.pagination-item--disabled) {
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .pagination-item--nav:hover:not(.pagination-item--disabled) ::slotted(*),
    .pagination-item--nav:active:not(.pagination-item--disabled) ::slotted(*) {
        color: inherit;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    ::slotted(a.pagination-item--nav.pagination-item--hovered:not(.pagination-item--disabled)),
    ::slotted(a.pagination-item--nav:active:not(.pagination-item--disabled)) {
        color: var(--ts-semantic-color-text-inverted-default) !important;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }
`;
