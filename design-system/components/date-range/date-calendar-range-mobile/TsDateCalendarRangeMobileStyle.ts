import { css } from 'lit';

export default css`
    :host {
        display: block;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    /* ----------------------------------------------------
     * CONTAINER
     * ---------------------------------------------------- */
    .calendar-container {
        display: flex;
        flex-direction: column;
        background: var(--ts-semantic-color-background-base-default);
        padding: var(--ts-semantic-size-space-500);
        gap: var(--ts-semantic-size-space-400);
    }

    /* ----------------------------------------------------
     * HEADER
     * ---------------------------------------------------- */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0 var(--ts-semantic-size-space-100);
    }

    .month-label {
        display: flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-1500);
        font-size: var(--ts-font-size-400);
        font-weight: 700;
        color: var(--ts-semantic-color-text-base-default);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    .nav {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .nav ts-icon-button {
        color: var(--ts-semantic-color-icon-primary-default);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: end;
    }

    ts-icon-button::part(icon) {
        color: var(--ts-semantic-color-icon-primary-default);
    }

    /* ----------------------------------------------------
     * WEEKDAY LABELS
     * ---------------------------------------------------- */
    .dow {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        justify-content: center;
        height: 36px;
        align-items: center;
        font-size: var(--ts-font-size-200);
        font-weight: 500;
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .dow span {
        text-align: center;
    }

    /* ----------------------------------------------------
     * WEEKS + DAYS
     * ---------------------------------------------------- */
    .weeks {
        display: flex;
        flex-direction: column;
        gap: var(--ts-semantic-size-space-100);
    }

    .week {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        justify-content: center;
    }

    button {
        position: relative;
        width: 40px;
        height: 40px;
        border: 0;
        background: none;
        cursor: pointer;
        padding: 0;
    }

    button:focus-visible {
        outline: none;
    }

    .grid-item::-moz-focus-inner {
        border: 0;
    }

    .grid-item:focus {
        outline: none;
    }

    .grid-item:focus-visible {
        outline: none;
    }

    .grid-item:focus-visible::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 5;
        border-radius: 999px;
        outline: solid 2px var(--ts-semantic-color-border-primary-focused);
        outline-offset: -2px;
        pointer-events: none;
    }

    /* ----------------------------------------------------
     * LAYERS
     * ---------------------------------------------------- */
    .layer-selected,
    .layer-hover,
    .layer-days {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* ----------------------------------------------------
     * SELECTED RANGE BACKGROUND (same as desktop)
     * ---------------------------------------------------- */
    .layer-selected {
        z-index: 1;
        background: transparent;
        border-radius: 0;
    }

    .in-range .layer-selected {
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    .range-start-visual .layer-selected {
        border-radius: 999px 0 0 999px;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    .range-end-visual .layer-selected {
        border-radius: 0 999px 999px 0;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    .range-start-visual.range-end-visual .layer-selected {
        border-radius: 999px;
    }

    /* ----------------------------------------------------
     * HOVER BEHAVIOR (FULL DESKTOP PARITY)
     * ---------------------------------------------------- */
    .layer-hover {
        z-index: 2;
        background: transparent;
        border-radius: 0;
        border: none;
    }

    /* interior hover */
    .hover-in-range .layer-hover {
        background: var(--ts-semantic-color-background-neutral-subtle-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* hover start pill */
    .hover-range-start-visual.hover-in-range .layer-hover {
        border-radius: 999px 0 0 999px;
        border-left: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* hover end pill */
    .hover-range-end-visual.hover-in-range .layer-hover {
        border-radius: 0 999px 999px 0;
        border-right: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* hover full single-day bubble */
    .hover-range-start-visual.hover-range-end-visual.hover-in-range .layer-hover {
        border-radius: 999px;
        border: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* fixes end-edge in some cases */
    .range-end.hover-in-range .layer-hover {
        border-radius: 999px 0 0 999px;
    }

    button.range-end.hover-range-end-visual .layer-hover {
        background: transparent;
        border: none;
        border-radius: 0;
    }

    /* ----------------------------------------------------
     * DAY LABELS
     * ---------------------------------------------------- */
    .layer-days {
        z-index: 3;
        font-size: var(--ts-font-size-200);
        font-weight: 500;
        color: var(--ts-semantic-color-text-base-default);
    }

    /* selected day bubble */
    .selected .layer-days {
        border-radius: 999px;
        background: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* selected + today ring */
    .selected.today .layer-days {
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-base-default);
    }

    /* today outline */
    .today:not(.selected):not(.hover-in-range) .layer-days {
        outline: 2px solid var(--ts-semantic-color-border-base-default);
        outline-offset: -2px;
        border-radius: 999px;
    }

    /* ----------------------------------------------------
     * MUTED DAYS
     * ---------------------------------------------------- */
    .invisible-day {
        visibility: hidden;
        pointer-events: none;
    }

    /* ----------------------------------------------------
     * GENERIC HOVER (same as desktop)
     * ---------------------------------------------------- */
    button:hover:not(.selected):not(.range-start-visual):not(.range-end-visual) {
        border-radius: 999px;
        background: var(--ts-semantic-color-border-base-disabled);
        z-index: 4;
    }
`;
