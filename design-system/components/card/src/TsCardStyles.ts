import { css } from 'lit';

export default css`
    :host {
        --border-color: var(--ts-semantic-color-border-base-default);
        --border-radius: var(--ts-semantic-size-radius-xl);
        --border-width: 1px;
        --padding: var(--ts-semantic-size-space-500);
        display: inline-block;
    }

    .card {
        display: flex;
        flex-direction: column;
        background-color: var(--ts-semantic-color-background-base-default);
        box-shadow: var(--ts-semantic-shadow-light-xs);
        border: solid var(--border-width) var(--border-color);
        border-radius: var(--border-radius);
        color: var(--ts-semantic-color-text-base-default);
    }

    .card__image {
        display: flex;
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        margin: calc(-1 * var(--border-width));
        overflow: hidden;
    }

    .card__image::slotted(img) {
        display: block;
        width: 100%;
    }

    .card:not(.card--has-image) .card__image {
        display: none;
    }

    .card__header {
        display: block;
        border-bottom: solid var(--border-width) var(--border-color);
        padding: var(--padding);
    }

    .card--no-divider .card__header {
        border-bottom: none;
    }

    .card:not(.card--has-header) .card__header {
        display: none;
    }

    .card:not(.card--has-image) .card__header {
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
    }

    .card__body {
        display: block;
        padding: var(--padding);
    }

    .card--has-footer .card__footer {
        display: block;
        border-top: solid var(--border-width) var(--border-color);
        padding: var(--padding);
    }

    .card--no-divider .card__footer {
        border-top: none;
    }

    .card:not(.card--has-footer) .card__footer {
        display: none;
    }

    .card--clickable {
        outline: 2px solid transparent;
        outline-offset: -1px;
        transition:
            outline-color 0.2s ease,
            border-color 0.2s ease;
    }

    .card--clickable:hover {
        cursor: pointer;
        border-color: var(--ts-semantic-color-border-primary-default);
        outline-color: var(--ts-semantic-color-border-primary-default);
    }

    .card--clickable:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }
`;
