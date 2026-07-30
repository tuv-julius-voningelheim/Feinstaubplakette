import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .details {
        border: solid 1px var(--ts-semantic-color-border-base-default);
        border-radius: var(--ts-semantic-size-radius-md);
        background-color: var(--ts-semantic-color-background-base-default);
        overflow-anchor: none;
        color: var(--ts-semantic-color-text-base-default);
        line-height: var(--ts-line-height-600);
    }

    :host([variant='secondary']) .details {
        border: solid 1px var(--ts-semantic-color-background-neutral-subtle-default, #f4f4f4);
        background: var(--ts-semantic-color-background-neutral-subtle-default, #f4f4f4);
    }

    .details--disabled {
        opacity: 0.5;
    }

    .details__header {
        display: flex;
        align-items: center;
        border-radius: inherit;
        padding: var(--ts-semantic-size-space-500);
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
    }

    .details__header::-webkit-details-marker {
        display: none;
    }

    .details__header:focus {
        outline: none;
    }

    .details__header:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .details--disabled .details__header {
        cursor: not-allowed;
    }

    .details--disabled .details__header:focus-visible {
        outline: none;
        box-shadow: none;
    }

    .details__summary {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
    }

    .details__summary-icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        transition: var(--ts-semantic-transition-duration-medium) rotate ease;
        font-size: 20px;
    }

    .details--open .details__summary-icon {
        rotate: 180deg;
    }

    .details--open.details--rtl .details__summary-icon {
        rotate: -180deg;
    }

    .details--open slot[name='expand-icon'],
    .details:not(.details--open) slot[name='collapse-icon'] {
        display: none;
    }

    .details__body {
        overflow: hidden;
    }

    .details__content {
        display: block;
        padding: var(--ts-semantic-size-space-500);
    }
`;
