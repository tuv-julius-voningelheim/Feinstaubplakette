import { css } from 'lit';

export default css`
    :host {
        display: block;
        --accordion-height: 56px;
    }

    .accordion-item {
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        border: solid 1px var(--ts-semantic-color-border-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        background-color: var(--ts-semantic-color-background-base-default);
        overflow-anchor: none;
        color: var(--ts-semantic-color-text-base-default);
        line-height: var(--ts-line-height-300);
    }

    :host([variant='secondary']) .accordion-item {
        border: solid 1px var(--ts-semantic-color-background-neutral-subtle-default, #f4f4f4);
        background: var(--ts-semantic-color-background-neutral-subtle-default, #f4f4f4);
    }

    .accordion-item--disabled {
        opacity: 0.5;
    }

    /* Header row for actions variant (button toggle + actions sibling) */
    .accordion-item__header-row {
        display: flex;
        align-items: center;
        border-radius: var(--ts-semantic-size-radius-md);
        gap: var(--ts-semantic-size-space-500);
    }

    /* Toggle button (reuses your .accordion-item__header class name) */
    .accordion-item__header {
        display: flex;
        align-items: center;
        border-radius: var(--ts-semantic-size-radius-md);
        padding: var(--ts-semantic-size-space-500);
        color: var(--ts-semantic-color-text-base-default);
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        height: var(--accordion-height);

        background: transparent;
        border: 0;
        width: 100%;
        text-align: left;
        font: inherit;
        line-height: inherit;
        -webkit-appearance: none;
        appearance: none;
    }

    .accordion-item--rtl .accordion-item__header {
        text-align: right;
    }

    /* In actions variant the toggle should take remaining space */
    .accordion-item--actions .accordion-item__header {
        flex: 1 1 auto;
        min-width: 0;
    }

    .actions-header {
        gap: var(--ts-semantic-size-space-400);
        height: var(--accordion-height);
    }

    .accordion-item__header:focus {
        outline: none;
    }

    .accordion-item__header:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .accordion-item--disabled .accordion-item__header {
        cursor: not-allowed;
    }

    .accordion-item--disabled .accordion-item__header:focus-visible {
        outline: none;
        box-shadow: none;
    }

    .accordion-item__summary {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        min-width: 0;
    }

    .accordion-item__summary-icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        transition: var(--ts-semantic-transition-duration-medium) rotate ease;
    }

    .accordion-item--open .accordion-item__summary-icon {
        rotate: 180deg;
    }

    .accordion-item--open.accordion-item--rtl .accordion-item__summary-icon {
        rotate: -180deg;
    }

    .accordion-item--open slot[name='expand-icon'],
    .accordion-item:not(.accordion-item--open) slot[name='collapse-icon'] {
        display: none;
    }

    /* Actions container (sibling of button) */
    .accordion-item__action {
        display: flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-400);
        padding-right: var(--ts-semantic-size-space-500);
        flex: 0 0 auto;
    }

    .accordion-item--rtl .accordion-item__action {
        padding-right: 0;
        padding-left: var(--ts-semantic-size-space-500);
    }

    .accordion-item__body {
        overflow: hidden;
    }

    .accordion-item__content {
        display: block;
        padding: var(--ts-semantic-size-space-500);
    }

    .accordion-item__header {
        overflow: hidden;
    }

    .accordion-item__summary {
        overflow: hidden;
        min-height: 18px;
        line-height: var(--ts-line-height-400);
    }

    .accordion-item__summary--truncate {
        overflow: hidden;
        min-height: 18px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        text-overflow: ellipsis;
        white-space: normal;
    }

    /* When summary is NOT truncated, allow the header to grow with the content */
    .accordion-item__header:not(:has(.accordion-item__summary--truncate)) {
        height: auto;
        min-height: var(--accordion-height);
    }

    .actions-header:not(:has(.accordion-item__summary--truncate)) {
        height: auto;
        min-height: var(--accordion-height);
    }
`;
