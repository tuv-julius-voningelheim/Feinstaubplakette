import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        /* IMPORTANT: avoid background shorthand (it resets background-color) */
        background-color: var(--ts-icon-button-bg, transparent);
        border: 2px solid transparent; /* default: no visible border */
        font-size: inherit;
        color: inherit;
        padding: var(--ts-semantic-size-space-100);
        cursor: pointer;

        transition:
            var(--ts-semantic-transition-duration-xfast) color,
            var(--ts-semantic-transition-duration-xfast) background-color,
            var(--ts-semantic-transition-duration-xfast) border-color;

        -webkit-appearance: none;
    }

    .icon-button {
        border-radius: var(--ts-semantic-size-radius-md);
    }

    /* circle (boolean prop) */
    .icon-button--circle {
        border-radius: 50%;
        padding: var(--ts-semantic-size-space-300);
    }

    .icon-button-hover:not(.icon-button--subtle):hover:not(.icon-button--disabled),
    .icon-button:not(.icon-button--subtle):focus-visible:not(.icon-button--disabled) {
        color: var(--ts-semantic-color-icon-primary-hover);
    }

    .icon-button-hover:not(.icon-button--subtle):active:not(.icon-button--disabled) {
        color: var(--ts-semantic-color-icon-primary-active);
    }

    .icon-button:focus {
        outline: none;
    }

    .icon-button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .icon-button:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .icon-button__icon {
        pointer-events: none;
    }

    /* =========================================================
   * OUTLINE + INTENT
   * ========================================================= */

    /* Default */
    .icon-button--outline.icon-button--default {
        border-color: var(--ts-semantic-color-border-base-default);
        color: var(--ts-semantic-color-text-base-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--default:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-border-base-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--default:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-active);
        border-color: var(--ts-semantic-color-border-base-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-hover);
    }

    .icon-button-hover:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-active);
    }

    /* Primary */
    .icon-button--outline.icon-button--primary {
        border-color: var(--ts-semantic-color-border-primary-default);
        --icon-color: var(--ts-semantic-color-border-primary-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--primary:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-hover);
        border-color: var(--ts-semantic-color-background-primary-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--primary:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-primary-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Success */
    .icon-button--outline.icon-button--success {
        border-color: var(--ts-semantic-color-border-success-default);
        --icon-color: var(--ts-semantic-color-border-success-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--success:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-hover);
        border-color: var(--ts-semantic-color-background-success-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--success:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-success-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Accent01 */
    .icon-button--outline.icon-button--accent01 {
        border-color: var(--ts-semantic-color-border-accent01-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent01:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-background-accent01-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent01:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* Accent02 */
    .icon-button--outline.icon-button--accent02 {
        border-color: var(--ts-semantic-color-border-accent02-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent02:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-background-accent02-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent02:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* Neutral */
    .icon-button--outline.icon-button--neutral {
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-neutral-default);
        --icon-color: var(--ts-semantic-color-border-neutral-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--neutral:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-background-neutral-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--neutral:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-neutral-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Warning */
    .icon-button--outline.icon-button--warning {
        border-color: var(--ts-semantic-color-border-warning-default);
        color: var(--ts-semantic-color-text-warning-default);
        --icon-color: var(--ts-semantic-color-border-warning-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--warning:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-hover);
        border-color: var(--ts-semantic-color-background-warning-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--warning:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-warning-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Danger */
    .icon-button--outline.icon-button--danger {
        border-color: var(--ts-semantic-color-border-danger-default);
        color: var(--ts-semantic-color-text-danger-default);
        --icon-color: var(--ts-semantic-color-border-danger-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--danger:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-background-danger-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--danger:active:not(.icon-button--disabled) {
        border-color: var(--ts-semantic-color-border-danger-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    /* =========================================================
   * FILLED (minimal)
   * ========================================================= */
    .icon-button--filled.icon-button--default {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-hover);
        border-color: var(--ts-semantic-color-background-base-hover);
        color: var(--ts-semantic-color-text-base-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--default:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-active);
        border-color: var(--ts-semantic-color-background-base-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--default:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-active);
        border-color: var(--ts-semantic-color-background-base-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button--filled.icon-button--primary {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-default);
        border-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--primary:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-hover);
        border-color: var(--ts-semantic-color-background-primary-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--primary:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-active);
        border-color: var(--ts-semantic-color-background-primary-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button--filled.icon-button--success {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-default);
        border-color: var(--ts-semantic-color-background-success-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--success:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-hover);
        border-color: var(--ts-semantic-color-background-success-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--success:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-active);
        border-color: var(--ts-semantic-color-background-success-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button--filled.icon-button--accent01 {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-default);
        border-color: var(--ts-semantic-color-background-accent01-default);
        color: var(--ts-semantic-color-text-base-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--accent01:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-background-accent01-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--accent01:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-active);
        border-color: var(--ts-semantic-color-background-accent01-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button--filled.icon-button--accent02 {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-default);
        border-color: var(--ts-semantic-color-background-accent02-default);
        color: var(--ts-semantic-color-text-base-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--accent02:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-background-accent02-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--accent02:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-active);
        border-color: var(--ts-semantic-color-background-accent02-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button--filled.icon-button--neutral {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-default);
        border-color: var(--ts-semantic-color-background-neutral-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--neutral:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-background-neutral-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--neutral:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-active);
        border-color: var(--ts-semantic-color-background-neutral-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button--filled.icon-button--warning {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-default);
        border-color: var(--ts-semantic-color-background-warning-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--warning:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-hover);
        border-color: var(--ts-semantic-color-background-warning-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--warning:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-active);
        border-color: var(--ts-semantic-color-background-warning-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button--filled.icon-button--danger {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-background-danger-default);
        color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--danger:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-background-danger-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--danger:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-active);
        border-color: var(--ts-semantic-color-background-danger-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button--subtle {
        border-color: transparent;
        /* Do NOT set background-color here — let var(--ts-icon-button-bg) from
           the base rule handle it so hover updates take effect. */
    }

    /* Default */
    .icon-button--subtle.icon-button--default {
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--default:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-hover);
    }

    .icon-button-hover.icon-button--subtle.icon-button--default:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-active);
    }

    /* Primary */
    .icon-button--subtle.icon-button--primary {
        --icon-color: var(--ts-semantic-color-border-primary-default);
        color: var(--ts-semantic-color-border-primary-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--primary:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--primary:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-primary-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Success */
    .icon-button--subtle.icon-button--success {
        --icon-color: var(--ts-semantic-color-border-success-default);
        color: var(--ts-semantic-color-border-success-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--success:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--success:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-success-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Accent01 */
    .icon-button--subtle.icon-button--accent01 {
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent01:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent01:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* Accent02 */
    .icon-button--subtle.icon-button--accent02 {
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent02:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent02:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* Neutral */
    .icon-button--subtle.icon-button--neutral {
        --icon-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--neutral:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--neutral:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-neutral-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Warning */
    .icon-button--subtle.icon-button--warning {
        --icon-color: var(--ts-semantic-color-border-warning-default);
        color: var(--ts-semantic-color-text-warning-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--warning:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--warning:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-warning-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Danger */
    .icon-button--subtle.icon-button--danger {
        --icon-color: var(--ts-semantic-color-border-danger-default);
        color: var(--ts-semantic-color-text-danger-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--danger:hover:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-hover);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--danger:active:not(.icon-button--disabled) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-danger-active);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* ---------------------------------------------------------
    * SUBTLE + OUTLINE + INVERTED
    * Hover/active: fill white bg and reveal the intent colour.
    * (Mirrors button--outline + [variant] + button--inverted.)
    * --------------------------------------------------------- */

    /* Accent01 SUBTLE*/
    .icon-button--subtle.icon-button--accent01.icon-button--inverted {
        --icon-color: var(--ts-semantic-color-border-accent01-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent01.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent01.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /*Accent 01 Outline*/
    .icon-button--outline.icon-button--accent01.icon-button--inverted {
        border-color: var(--ts-semantic-color-border-accent01-default);
        --icon-color: var(--ts-semantic-color-border-accent01-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent01.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-background-accent01-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent01.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent01-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* Accent02 SUBTLE*/
    .icon-button--subtle.icon-button--accent02.icon-button--inverted {
        --icon-color: var(--ts-semantic-color-border-accent02-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent02.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--accent02.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /*Accent 01 Outline*/
    .icon-button--outline.icon-button--accent02.icon-button--inverted {
        border-color: var(--ts-semantic-color-border-accent02-default);
        --icon-color: var(--ts-semantic-color-border-accent02-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent02.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-background-accent02-hover);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--accent02.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        --ts-icon-button-bg: var(--ts-semantic-color-background-accent02-active);
        --icon-color: var(--ts-semantic-color-text-base-default);
    }

    /* ---------------------------------------------------------
     * OUTLINE + INVERTED
     * Base: white border + white icon on dark bg.
     * Hover/active: fill white bg and reveal the intent colour.
     * (Mirrors button--outline + [variant] + button--inverted.)
     * --------------------------------------------------------- */

    /* Default */
    .icon-button--outline.icon-button--default.icon-button--inverted {
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--default.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--default.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* Primary */
    .icon-button--outline.icon-button--primary.icon-button--inverted {
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--outline.icon-button--primary.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .icon-button-hover.icon-button--outline.icon-button--primary.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-primary-active);
        color: var(--ts-semantic-color-text-primary-active);
    }

    /* ---------------------------------------------------------
     * FILLED + INVERTED
     * Each intent gets a white background with its intent-coloured icon,
     * parallel to button standard + [variant] + inverted.
     * Default is the exception: transparent bg + white border + white icon
     * (mirrors button standard+default+inverted).
     * --------------------------------------------------------- */

    /* Default: base bg, white border/icon (inverted of a base-coloured filled) */
    .icon-button--filled.icon-button--default.icon-button--inverted {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--default.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--default.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* Primary: white background, primary-coloured icon */
    .icon-button--filled.icon-button--primary.icon-button--inverted {
        --ts-icon-button-bg: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .icon-button-hover.icon-button--filled.icon-button--primary.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-hover);
        border-color: var(--ts-semantic-color-text-inverted-hover);
        --icon-color: var(--ts-semantic-color-text-base-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .icon-button-hover.icon-button--filled.icon-button--primary.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-active);
        border-color: var(--ts-semantic-color-text-inverted-active);
        --icon-color: var(--ts-semantic-color-text-primary-active);
        color: var(--ts-semantic-color-text-primary-active);
    }

    /* ---------------------------------------------------------
     * SUBTLE (text-variant) + INVERTED
     * Transparent bg/border, white icon — for use on dark surfaces.
     * Hover/active: same colour, reduced opacity.
     * (Mirrors button--text-variant + [variant] + button--inverted.)
     * --------------------------------------------------------- */

    /* Default */
    .icon-button--subtle.icon-button--default.icon-button--inverted {
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--default.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: transparent;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.8;
    }

    .icon-button-hover.icon-button--subtle.icon-button--default.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.6;
    }

    /* Primary */
    .icon-button--subtle.icon-button--primary.icon-button--inverted {
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .icon-button-hover.icon-button--subtle.icon-button--primary.icon-button--inverted:hover:not(
            .icon-button--disabled
        ) {
        --ts-icon-button-bg: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        --icon-color: var(--ts-semantic-color-text-base-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .icon-button-hover.icon-button--subtle.icon-button--primary.icon-button--inverted:active:not(
            .icon-button--disabled
        ) {
        --icon-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.6;
    }
`;
