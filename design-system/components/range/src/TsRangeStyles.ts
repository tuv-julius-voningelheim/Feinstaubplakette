import { css } from 'lit';

export default css`
    :host {
        --thumb-size: 20px;
        --tooltip-offset: 10px;
        --track-color-active: var(--ts-semantic-color-border-neutral-subtle-active);
        --track-color-inactive: var(--ts-semantic-color-border-neutral-subtle-active);
        --track-active-offset: 0%;
        --track-height: 6px;
        --thumb-color: var(--ts-semantic-color-background-primary-default);
        --thumb-color-hover: var(--ts-semantic-color-background-primary-hover);
        --thumb-color-active: var(--ts-semantic-color-background-primary-active);
        display: block;
    }

    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .range {
        position: relative;
    }

    .range__control {
        --percent: 0%;
        -webkit-appearance: none;
        border-radius: 3px;
        width: 100%;
        height: var(--track-height);
        background: transparent;
        line-height: 2.5rem;
        vertical-align: middle;
        margin: 0;

        background-image: linear-gradient(
            to right,
            var(--track-color-inactive) 0%,
            var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
            var(--track-color-active) min(var(--percent), var(--track-active-offset)),
            var(--track-color-active) max(var(--percent), var(--track-active-offset)),
            var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
            var(--track-color-inactive) 100%
        );
    }

    .range--rtl .range__control {
        background-image: linear-gradient(
            to left,
            var(--track-color-inactive) 0%,
            var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
            var(--track-color-active) min(var(--percent), var(--track-active-offset)),
            var(--track-color-active) max(var(--percent), var(--track-active-offset)),
            var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
            var(--track-color-inactive) 100%
        );
    }

    /* Webkit */
    .range__control::-webkit-slider-runnable-track {
        width: 100%;
        height: var(--track-height);
        border-radius: 3px;
        border: none;
    }

    .range__control::-webkit-slider-thumb {
        width: var(--thumb-size);
        height: var(--thumb-size);
        border-radius: 50%;
        background-color: var(--thumb-color);
        border: solid var(--ts-semantic-size-width-xs) var(--thumb-color);
        -webkit-appearance: none;
        margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);
        cursor: pointer;
    }

    .range__control:enabled::-webkit-slider-thumb:hover {
        background-color: var(--thumb-color-hover);
        border-color: var(--thumb-color-hover);
    }

    .range__control:enabled:focus-visible::-webkit-slider-thumb {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .range__control:enabled::-webkit-slider-thumb:active {
        background-color: var(--thumb-color-active);
        border-color: var(--thumb-color-active);
        cursor: grabbing;
    }

    /* Firefox */
    .range__control::-moz-focus-outer {
        border: 0;
    }

    .range__control::-moz-range-progress {
        background-color: var(--track-color-active);
        border-radius: 3px;
        height: var(--track-height);
    }

    .range__control::-moz-range-track {
        width: 100%;
        height: var(--track-height);
        background-color: var(--track-color-inactive);
        border-radius: 3px;
        border: none;
    }

    .range__control::-moz-range-thumb {
        border: none;
        height: var(--thumb-size);
        width: var(--thumb-size);
        border-radius: 50%;
        background-color: var(--thumb-color);
        border-color: var(--thumb-color);
        transition:
            var(--ts-semantic-transition-duration-fast) border-color,
            var(--ts-semantic-transition-duration-fast) background-color,
            var(--ts-semantic-transition-duration-fast) color,
            var(--ts-semantic-transition-duration-fast) box-shadow;
        cursor: pointer;
    }

    .range__control:enabled::-moz-range-thumb:hover {
        background-color: var(--thumb-color-hover);
        border-color: var(--thumb-color-hover);
    }

    .range__control:enabled:focus-visible::-moz-range-thumb {
        outline: solid 3px #3c83f6;
        outline-offset: 1px;
    }

    .range__control:enabled::-moz-range-thumb:active {
        background-color: var(--thumb-color-active);
        border-color: var(--thumb-color-active);
        cursor: grabbing;
    }

    /* States */
    .range__control:focus-visible {
        outline: none;
    }

    .range__control:disabled {
        cursor: not-allowed;
    }

    .range__control:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
    }

    .range__control:disabled::-moz-range-thumb {
        cursor: not-allowed;
    }

    /* Tooltip output */
    .range__tooltip {
        position: absolute;
        z-index: var(--ts-semantic-distance-zindex-tooltip);
        left: 0;
        border-radius: var(--ts-semantic-size-radius-md);
        background-color: var(--ts-semantic-color-background-primary-dark-default);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        line-height: 1.4;
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0;
        padding: var(--ts-semantic-size-space-100) var(--ts-semantic-size-space-300);
        transition: var(--ts-semantic-transition-duration-fast) opacity;
        pointer-events: none;
    }

    .range__tooltip:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        left: 50%;
        translate: calc(-1 * 6px);
    }

    .range--tooltip-visible .range__tooltip {
        opacity: 1;
    }

    /* Tooltip on top */
    .range--tooltip-top .range__tooltip {
        top: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
    }

    .range--tooltip-top .range__tooltip:after {
        border-top: 6px solid var(--ts-semantic-color-background-primary-dark-default);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        top: 100%;
    }

    /* Tooltip on bottom */
    .range--tooltip-bottom .range__tooltip {
        bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
    }

    .range--tooltip-bottom .range__tooltip:after {
        border-bottom: 6px solid var(--ts-semantic-color-background-primary-dark-default);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        bottom: 100%;
    }

    @media (forced-colors: active) {
        .range__control,
        .range__tooltip {
            border: solid 1px transparent;
        }

        .range__control::-webkit-slider-thumb {
            border: solid 1px transparent;
        }

        .range__control::-moz-range-thumb {
            border: solid 1px transparent;
        }

        .range__tooltip:after {
            display: none;
        }
    }

    /* Error States */
    .range--error .range__control::-webkit-slider-thumb {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .range--error .range__control:enabled::-webkit-slider-thumb:hover {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    .range--error .range__control:enabled:focus-visible::-webkit-slider-thumb {
        background-color: var(--ts-semantic-color-background-danger-default);
        outline-color: var(--ts-semantic-color-border-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .range--error .range__control:enabled::-webkit-slider-thumb:active {
        background-color: var(--ts-semantic-color-background-danger-active);
        border-color: var(--ts-semantic-color-border-danger-active);
    }

    /* Firefox error states */
    .range--error .range__control::-moz-range-thumb {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .range--error .range__control:enabled::-moz-range-thumb:hover {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    .range--error .range__control:enabled:focus-visible::-moz-range-thumb {
        background-color: var(--ts-semantic-color-background-danger-default);
        outline-color: var(--ts-semantic-color-border-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .range--error .range__control:enabled::-moz-range-thumb:active {
        background-color: var(--ts-semantic-color-background-danger-active);
        border-color: var(--ts-semantic-color-border-danger-active);
    }
`;
