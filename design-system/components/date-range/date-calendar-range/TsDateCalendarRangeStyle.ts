import { css } from 'lit';

export default css`
    :host {
        display: block;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    .calendar-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;

        overflow: hidden;
        position: relative;
        border-radius: var(--ts-semantic-size-space-500);
    }

    .header-left,
    .header-right {
        display: flex;
        padding: var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-500);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 40px;
        font-size: var(--ts-font-size-300);
        font-weight: 700;
        color: var(--ts-semantic-color-text-base-default);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
    }

    .header-left ts-icon-button {
        position: absolute;
        left: 15px;
        color: var(--ts-semantic-color-icon-primary-default);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-right ts-icon-button {
        position: absolute;
        right: 15px;
        color: var(--ts-semantic-color-icon-primary-default);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .calendar-left,
    .calendar-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 var(--ts-semantic-size-space-500) var(--ts-semantic-size-space-500);
    }

    .divider-vertical {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    .dow {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        justify-content: center;
        gap: 0;
        height: 40px;
        align-items: center;
        color: var(--ts-semantic-color-text-neutral-default);
        font-size: var(--ts-font-size-200);
        font-weight: 500;
    }

    .dow span {
        text-align: center;
    }

    .weeks {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .week {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        justify-content: center;
        gap: 0;
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

    ts-icon-button::part(icon) {
        color: var(--ts-semantic-color-icon-primary-default);
    }

    .prev-month {
    }

    .layer-selected,
    .layer-hover,
    .layer-days {
        position: absolute;
        inset: 0;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Base */
    .layer-selected {
        z-index: 1;
        background: transparent;
        border-radius: 0;
        border: none;
    }

    /* Interior range background */
    .in-range .layer-selected {
        background: var(--ts-semantic-color-background-primary-subtle-default);
    }

    /* Start pill (with border) */
    .range-start-visual .layer-selected {
        border-radius: 999px 0 0 999px;
        border-left: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* End pill (with border) */
    .range-end-visual .layer-selected {
        border-radius: 0 999px 999px 0;
        border-right: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* Full selected (single day) — no border */
    .range-start-visual.range-end-visual .layer-selected {
        border-radius: 999px;
        border: none;
    }

    /* Override: remove borders for first/last selected (your fix) */
    .range-start-visual .layer-selected,
    .range-end-visual .layer-selected,
    .range-start-visual.range-end-visual .layer-selected {
        border: none;
    }

    /* Base */
    .layer-hover {
        z-index: 2;
        background: transparent;
        border-radius: 0;
        border: none;
    }

    /* Interior hover background */
    .hover-in-range .layer-hover {
        background: var(--ts-semantic-color-background-neutral-subtle-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* Hover start pill */
    .hover-range-start-visual.hover-in-range .layer-hover {
        border-radius: 999px 0 0 999px;
        border-left: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* Hover end pill */
    .hover-range-end-visual.hover-in-range .layer-hover {
        border-radius: 0 999px 999px 0;
        border-right: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    /* Hover full single-day pill */
    .hover-range-start-visual.hover-range-end-visual.hover-in-range .layer-hover {
        border-radius: 999px;
        border: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    .hover-range-start-visual.hover-in-range .layer-hover {
        border-radius: 999px 0 0 999px;
        border-left: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-top: 2px solid var(--ts-semantic-color-border-base-disabled);
        border-bottom: 2px solid var(--ts-semantic-color-border-base-disabled);
    }

    .range-end.hover-in-range .layer-hover {
        border-radius: 999px 0 0 999px;
    }

    button.range-end.hover-range-end-visual .layer-hover {
        background: transparent;
        border: none;
        border-radius: 0;
    }

    /* Base */
    .layer-days {
        z-index: 3;
        font-size: var(--ts-font-size-200);
        color: var(--ts-semantic-color-text-base-default);
        font-weight: 500;
    }

    /* Selected day bubble */
    .selected .layer-days {
        border-radius: 999px;
        background: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Selected today circle border */
    .selected.today .layer-days {
        box-shadow: 0 0 0 2px var(--ts-semantic-color-border-base-default);
    }

    /* Unselected today outline */
    .today:not(.selected):not(.hover-in-range) .layer-days {
        outline: 2px solid var(--ts-semantic-color-border-base-default);
        outline-offset: -2px;
        border-radius: 999px;
    }

    /* Invisible (muted month) */
    .invisible-day {
        visibility: hidden;
        pointer-events: none;
    }

    button:hover:not(.range-start-visual):not(.range-end-visual) {
        border-radius: 999px;
        background: var(--ts-semantic-color-border-base-disabled);
        z-index: 4;
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
`;
