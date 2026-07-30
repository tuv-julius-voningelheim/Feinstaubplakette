import { css } from 'lit';

export default css`
    :host {
        --symbol-color: var(--ts-semantic-color-icon-neutral-default);
        --symbol-color-active: var(--ts-semantic-color-charts-amber-400);
        --symbol-size: 1.2rem;
        --symbol-spacing: var(--ts-semantic-size-space-100);

        display: inline-flex;
    }

    .rating {
        position: relative;
        display: inline-flex;
        border-radius: var(--ts-semantic-size-radius-sm);
        vertical-align: middle;
    }

    .rating:focus {
        outline: none;
    }

    .rating:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .rating__symbols,
    .rating__symbol.rating-icon {
        display: inline-flex;
        position: relative;
        font-size: var(--symbol-size);
        line-height: 0;
        color: var(--symbol-color);
        white-space: nowrap;
        cursor: pointer;
    }

    .rating__symbols > * {
        padding: var(--symbol-spacing);
    }

    .rating__partial-symbol-container {
        position: relative;
    }

    .rating__partial--filled {
        position: absolute;
        top: var(--symbol-spacing);
        left: var(--symbol-spacing);
    }

    .rating__symbol {
        transition: var(--ts-semantic-transition-duration-fast) scale;
        pointer-events: none;
    }

    .rating__symbol--hover {
        scale: 1.2;
    }

    .rating--disabled .rating__symbols,
    .rating--readonly .rating__symbols {
        cursor: default;
    }

    .rating--disabled .rating__symbol--hover,
    .rating--readonly .rating__symbol--hover {
        scale: none;
    }

    .rating--disabled {
        opacity: 0.5;
    }

    .rating--disabled .rating__symbols {
        cursor: not-allowed;
    }

    /* ------------------------------------ */
    /* FIX: color must be applied to ts-icon */
    /* ------------------------------------ */

    .rating__symbol ts-icon {
        color: var(--symbol-color);
        font-size: var(--symbol-size);
    }

    .rating__symbol--active ts-icon,
    .rating__partial--filled ts-icon {
        color: var(--symbol-color-active);
    }

    /* Forced colors mode */
    @media (forced-colors: active) {
        .rating__symbol--active ts-icon {
            color: SelectedItem;
        }
    }
`;
