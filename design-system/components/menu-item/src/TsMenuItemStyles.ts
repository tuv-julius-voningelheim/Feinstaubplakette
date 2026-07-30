import { css } from 'lit';

export default css`
    :host {
        --submenu-offset: -2px;

        display: block;
    }

    :host([inert]) {
        display: none;
    }

    .menu-item {
        position: relative;
        display: flex;
        align-items: stretch;
        text-align: start;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        line-height: var(--ts-line-height-300);
        color: var(--ts-semantic-color-text-base-default);
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-300);
        transition: var(--ts-semantic-transition-duration-fast) fill;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
        cursor: pointer;
    }

    .menu-item ts-icon {
        color: currentColor;
    }

    .menu-item ts-icon::part(svg),
    .menu-item ts-icon::part(base) {
        fill: currentColor;
        color: currentColor;
    }

    .menu-item.menu-item--disabled {
        outline: none;
        opacity: 0.5;
        cursor: not-allowed;
    }

    .menu-item.menu-item--loading {
        outline: none;
        cursor: wait;
    }

    .menu-item.menu-item--loading *:not(ts-spinner) {
        opacity: 0.5;
    }

    .menu-item--loading ts-spinner {
        --indicator-color: currentColor;
        --track-width: 1px;
        position: absolute;
        font-size: 12px;
        top: calc(50% - 0.5em);
        left: 0.65rem;
        opacity: 1;
    }

    .menu-item .menu-item__label {
        flex: 1 1 auto;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .menu-item .menu-item__prefix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .menu-item .menu-item__prefix::slotted(*) {
        margin-inline-end: var(--ts-semantic-size-space-300);
    }

    .menu-item .menu-item__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
    }

    .menu-item .menu-item__suffix::slotted(*) {
        margin-inline-start: var(--ts-semantic-size-space-300);
    }

    /* Safe triangle */
    .menu-item--submenu-expanded::after {
        content: '';
        position: fixed;
        z-index: calc(var(--ts-semantic-distance-zindex-dropdown) - 1);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        clip-path: polygon(
            var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
            var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
            var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
        );
    }

    :host(:focus-visible) {
        outline: none;
    }

    :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
    .menu-item--submenu-expanded {
        background-color: var(--ts-semantic-color-background-base-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    :host(:focus-visible) .menu-item {
        outline: none;
        background-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 1;
    }

    .menu-item .menu-item__check,
    .menu-item .menu-item__chevron {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5em;
        visibility: hidden;
    }

    .menu-item--checked .menu-item__check,
    .menu-item--has-submenu .menu-item__chevron {
        visibility: visible;
    }

    /* Add elevation and z-index to submenus */
    ts-popup::part(popup) {
        box-shadow: var(--ts-semantic-shadow-light-lg);
        z-index: var(--ts-semantic-distance-zindex-dropdown);
        margin-left: var(--submenu-offset);
        background: none;
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .menu-item--rtl ts-popup::part(popup) {
        margin-left: calc(-1 * var(--submenu-offset));
        background: none;
    }

    @media (forced-colors: active) {
        :host(:hover:not([aria-disabled='true'])) .menu-item,
        :host(:focus-visible) .menu-item {
            outline: dashed 1px SelectedItem;
            outline-offset: -1px;
        }
    }

    ::slotted(ts-menu) {
        max-width: var(--auto-size-available-width) !important;
        max-height: var(--auto-size-available-height) !important;
    }
`;
