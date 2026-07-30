import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        position: relative;
        width: auto;
        cursor: pointer;
    }

    .button {
        display: inline-flex;
        align-items: stretch;
        justify-content: center;
        width: 100%;
        border-style: solid;
        border-width: var(--ts-semantic-size-width-sm);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
        vertical-align: middle;
        transition:
            var(--ts-semantic-transition-duration-xfast) background-color,
            var(--ts-semantic-transition-duration-xfast) color,
            var(--ts-semantic-transition-duration-xfast) border,
            var(--ts-semantic-transition-duration-xfast) box-shadow;
        cursor: inherit;
    }

    .button::-moz-focus-inner {
        border: 0;
    }

    .button:focus {
        outline: none;
    }

    .button:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* When disabled, prevent mouse events from bubbling up from children */
    .button--disabled * {
        pointer-events: none;
    }

    .button__prefix,
    .button__suffix {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        pointer-events: none;
    }

    .button__label {
        display: inline-block;
    }

    .button__label::slotted(ts-icon) {
        vertical-align: -2px;
        color: var(--ts-semantic-color-text-base-default);
    }

    .button ::slotted(ts-icon),
    .button ts-icon {
        color: currentColor;
        flex-shrink: 0;
    }

    /*
   * Prefix/suffix containers: only take up space when actually populated.
   * Sizes are enforced via syncSlottedIconSizes() in the component TS for ts-icon elements.
   */
    .button--small.button--has-prefix .button__prefix,
    .button--small.button--has-suffix .button__suffix {
        width: 16px;
        height: 16px;
    }

    .button--medium.button--has-prefix .button__prefix,
    .button--medium.button--has-suffix .button__suffix {
        width: 20px;
        height: 20px;
    }

    .button--large.button--has-prefix .button__prefix,
    .button--large.button--has-suffix .button__suffix {
        width: 24px;
        height: 24px;
    }

    .button--navbar ::slotted(ts-icon),
    .button--navbar ts-icon {
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--caret .button__caret {
        height: auto;
    }

    /*
   * Standard buttons
   */

    .button--standard {
        align-items: center;
    }

    /* Default */
    .button--standard.button--default {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-border-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--standard.button--default:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-base-hover);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--standard.button--default:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-base-active);
        border-color: var(--ts-semantic-color-border-base-active);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* Primary */
    .button--standard.button--primary {
        background-color: var(--ts-semantic-color-background-primary-default);
        border-color: var(--ts-semantic-color-border-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--primary:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-primary-hover);
        border-color: var(--ts-semantic-color-border-primary-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--primary:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-primary-active);
        border-color: var(--ts-semantic-color-border-primary-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Success */
    .button--standard.button--success {
        background-color: var(--ts-semantic-color-background-success-default);
        border-color: var(--ts-semantic-color-border-success-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--success:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-success-hover);
        border-color: var(--ts-semantic-color-border-success-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--success:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-success-active);
        border-color: var(--ts-semantic-color-border-success-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Neutral */
    .button--standard.button--neutral {
        background-color: var(--ts-semantic-color-background-neutral-default);
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--neutral:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-border-neutral-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--neutral:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-neutral-active);
        border-color: var(--ts-semantic-color-border-neutral-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Warning */
    .button--standard.button--warning {
        background-color: var(--ts-semantic-color-background-warning-default);
        border-color: var(--ts-semantic-color-border-warning-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }
    .button--standard.button--warning:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-warning-hover);
        border-color: var(--ts-semantic-color-border-warning-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--warning:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-warning-active);
        border-color: var(--ts-semantic-color-border-warning-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Danger */
    .button--standard.button--danger {
        background-color: var(--ts-semantic-color-background-danger-default);
        border-color: var(--ts-semantic-color-border-danger-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--danger:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-border-danger-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--danger:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-danger-active);
        border-color: var(--ts-semantic-color-border-danger-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* accent01 */
    .button--standard.button--accent01 {
        background-color: var(--ts-semantic-color-background-accent01-default);
        border-color: var(--ts-semantic-color-border-accent01-default);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--standard.button--accent01:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-border-accent01-hover);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--standard.button--accent01:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent01-active);
        border-color: var(--ts-semantic-color-border-accent01-active);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* accent02 */
    .button--standard.button--accent02 {
        background-color: var(--ts-semantic-color-background-accent02-default);
        border-color: var(--ts-semantic-color-border-accent02-default);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--standard.button--accent02:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-border-accent02-hover);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--standard.button--accent02:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent02-active);
        border-color: var(--ts-semantic-color-border-accent02-active);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* navbar */
    .button--standard.button--navbar {
        background: none;
        border: none;
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--navbar::slotted(ts-icon) {
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--navbar:hover:not(.button--disabled) {
        background: none;
        border: none;
        color: var(--ts-semantic-color-text-inverted-hover);
    }

    .button--standard.button--navbar:active:not(.button--disabled) {
        background: none;
        border: none;
        color: var(--ts-semantic-color-text-inverted-disabled);
    }

    /*
   * Outline buttons
   */
    .button--outline {
        background: none;
        border: solid var(--ts-semantic-size-width-sm);
    }

    /* Default */
    .button--outline.button--default {
        border-color: var(--ts-semantic-color-border-base-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--outline.button--default:hover:not(.button--disabled),
    .button--outline.button--default.button--checked:not(.button--disabled) {
        //border-color: var(--ts-semantic-color-border-base-hover);
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    .button--outline.button--default:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-base-active);
        background-color: var(--ts-semantic-color-background-base-active);
        //color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Primary */
    .button--outline.button--primary {
        border-color: var(--ts-semantic-color-border-primary-default);
        color: var(--ts-semantic-color-text-primary-default);
    }

    .button--outline.button--primary:hover:not(.button--disabled),
    .button--outline.button--primary.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-primary-default);
        border-color: var(--ts-semantic-color-background-primary-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--primary:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-primary-active);
        background-color: var(--ts-semantic-color-background-primary-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Success */
    .button--outline.button--success {
        border-color: var(--ts-semantic-color-border-success-default);
        color: var(--ts-semantic-color-text-success-default);
    }

    .button--outline.button--success:hover:not(.button--disabled),
    .button--outline.button--success.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-success-hover);
        border-color: var(--ts-semantic-color-background-success-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--success:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-success-active);
        background-color: var(--ts-semantic-color-background-success-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* accent01 */
    .button--outline.button--accent01:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        background-color: var(--ts-semantic-color-background-accent01-active);
        color: var(--ts-semantic-color-border-accent01-active);
    }
    .button--outline.button--accent01:hover:not(.button--disabled),
    .button--outline.button--accent01.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-background-accent01-hover);
        color: var(--ts-semantic-color-border-accent01-active);
    }
    .button--outline.button--accent01:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        background-color: var(--ts-semantic-color-background-accent01-active);
        color: var(--ts-semantic-color-border-accent01-active);
    }

    /* accent02 */
    .button--outline.button--accent02:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        background-color: var(--ts-semantic-color-background-accent02-active);
        color: var(--ts-semantic-color-border-accent02-active);
    }
    .button--outline.button--accent02:hover:not(.button--disabled),
    .button--outline.button--accent02.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-background-accent02-hover);
        color: var(--ts-semantic-color-border-accent02-active);
    }
    .button--outline.button--accent02:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        background-color: var(--ts-semantic-color-background-accent02-active);
        color: var(--ts-semantic-color-border-accent02-active);
    }

    /* Neutral */
    .button--outline.button--neutral {
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .button--outline.button--neutral:hover:not(.button--disabled),
    .button--outline.button--neutral.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-neutral-hover);
        border-color: var(--ts-semantic-color-background-neutral-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--neutral:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-neutral-active);
        background-color: var(--ts-semantic-color-background-neutral-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Warning */
    .button--outline.button--warning {
        border-color: var(--ts-semantic-color-border-warning-default);
        color: var(--ts-semantic-color-text-warning-default);
    }

    .button--outline.button--warning:hover:not(.button--disabled),
    .button--outline.button--warning.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-warning-hover);
        border-color: var(--ts-semantic-color-background-warning-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--warning:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-warning-active);
        background-color: var(--ts-semantic-color-background-warning-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* Danger */
    .button--outline.button--danger {
        border-color: var(--ts-semantic-color-border-danger-default);
        color: var(--ts-semantic-color-text-danger-default);
    }

    .button--outline.button--danger:hover:not(.button--disabled),
    .button--outline.button--danger.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-danger-hover);
        border-color: var(--ts-semantic-color-background-danger-hover);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--danger:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-danger-active);
        background-color: var(--ts-semantic-color-background-danger-active);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    /* accent01 */
    .button--outline.button--accent01 {
        border-color: var(--ts-semantic-color-border-accent01-default);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--outline.button--accent01:hover:not(.button--disabled),
    .button--outline.button--accent01.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent01-hover);
        border-color: var(--ts-semantic-color-background-accent01-hover);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--outline.button--accent01:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent01-active);
        background-color: var(--ts-semantic-color-background-accent01-active);
        color: var(--ts-semantic-color-text-base-default);
    }

    /* accent02 */
    .button--outline.button--accent02 {
        border-color: var(--ts-semantic-color-border-accent02-default);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--outline.button--accent02:hover:not(.button--disabled),
    .button--outline.button--accent02.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-background-accent02-hover);
        border-color: var(--ts-semantic-color-background-accent02-hover);
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--outline.button--accent02:active:not(.button--disabled) {
        border-color: var(--ts-semantic-color-border-accent02-active);
        background-color: var(--ts-semantic-color-background-accent02-active);
        color: var(--ts-semantic-color-text-base-default);
    }

    @media (forced-colors: active) {
        .button.button--outline.button--checked:not(.button--disabled) {
            outline: solid 2px transparent;
        }
    }

    /*
   * Text-variant buttons (text=true): transparent bg/border, variant-colored text
   */

    .button--text-variant {
        background-color: transparent;
        border-color: transparent;
        align-items: center;
    }

    .button--text-variant.button--default {
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--text-variant.button--default:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.8;
    }
    .button--text-variant.button--default:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.6;
    }

    .button--text-variant.button--primary {
        color: var(--ts-semantic-color-text-primary-default);
    }
    .button--text-variant.button--primary:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-primary-hover);
    }
    .button--text-variant.button--primary:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-primary-active);
    }

    .button--text-variant.button--success {
        color: var(--ts-semantic-color-text-success-default);
    }
    .button--text-variant.button--success:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-success-default);
        opacity: 0.8;
    }
    .button--text-variant.button--success:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-success-default);
        opacity: 0.6;
    }

    .button--text-variant.button--neutral {
        color: var(--ts-semantic-color-text-neutral-default);
    }
    .button--text-variant.button--neutral:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-neutral-default);
        opacity: 0.8;
    }
    .button--text-variant.button--neutral:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-neutral-default);
        opacity: 0.6;
    }

    .button--text-variant.button--warning {
        color: var(--ts-semantic-color-text-warning-default);
    }
    .button--text-variant.button--warning:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-warning-default);
        opacity: 0.8;
    }
    .button--text-variant.button--warning:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-warning-default);
        opacity: 0.6;
    }

    .button--text-variant.button--danger {
        color: var(--ts-semantic-color-text-danger-default);
    }
    .button--text-variant.button--danger:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-danger-default);
        opacity: 0.8;
    }
    .button--text-variant.button--danger:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-danger-default);
        opacity: 0.6;
    }

    .button--text-variant.button--accent01 {
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--text-variant.button--accent01:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.8;
    }
    .button--text-variant.button--accent01:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.6;
    }

    .button--text-variant.button--accent02 {
        color: var(--ts-semantic-color-text-base-default);
    }
    .button--text-variant.button--accent02:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.8;
    }
    .button--text-variant.button--accent02:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-base-default);
        opacity: 0.6;
    }

    /*
   * Inverted primary button — light text/border on primary-colored background areas.
   * Only affects the primary variant; other variants are unaffected.
   */

    .button--standard.button--primary.button--inverted {
        background-color: var(--ts-semantic-color-background-base-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--standard.button--primary.button--inverted:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-hover);
        border-color: var(--ts-semantic-color-text-inverted-hover);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .button--standard.button--primary.button--inverted:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-active);
        border-color: var(--ts-semantic-color-text-inverted-active);
        color: var(--ts-semantic-color-text-primary-active);
    }

    /* Inverted default variant — make visible on dark backgrounds */
    .button--standard.button--default.button--inverted {
        background-color: transparent;
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--standard.button--default.button--inverted:hover:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--standard.button--default.button--inverted:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--outline.button--default.button--inverted {
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--default.button--inverted:hover:not(.button--disabled),
    .button--outline.button--default.button--inverted.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--outline.button--default.button--inverted:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .button--text-variant.button--default.button--inverted {
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--text-variant.button--default.button--inverted:hover:not(.button--disabled) {
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.8;
    }

    .button--text-variant.button--default.button--inverted:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.6;
    }

    .button--outline.button--primary.button--inverted {
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--outline.button--primary.button--inverted:hover:not(.button--disabled),
    .button--outline.button--primary.button--inverted.button--checked:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-base-hover);
    }

    .button--outline.button--primary.button--inverted:active:not(.button--disabled) {
        background-color: var(--ts-semantic-color-text-inverted-default);
        border-color: var(--ts-semantic-color-text-inverted-default);
        color: var(--ts-semantic-color-text-primary-active);
    }

    .button--text-variant.button--primary.button--inverted {
        color: var(--ts-semantic-color-text-inverted-default);
    }

    .button--text-variant.button--primary.button--inverted:hover:not(.button--disabled) {
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.8;
    }

    .button--text-variant.button--primary.button--inverted:active:not(.button--disabled) {
        color: var(--ts-semantic-color-text-inverted-default);
        opacity: 0.6;
    }

    /*
   * Text buttons (variant="text" legacy)
   */

    .button--text {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-primary-default);
    }

    .button--text:hover:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-primary-hover);
    }

    .button--text:focus-visible:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-primary-default);
    }

    .button--text:active:not(.button--disabled) {
        background-color: transparent;
        border-color: transparent;
        color: var(--ts-semantic-color-text-primary-active);
    }

    /*
   * Size modifiers
   */

    .button--small {
        font-size: var(--ts-font-size-200);
        line-height: var(--ts-line-height-300);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-400, 12px);
        max-height: 2rem;
    }

    .button--medium {
        font-size: var(--ts-font-size-200);
        line-height: var(--ts-line-height-300);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: var(--ts-semantic-size-space-300, 8px) var(--ts-semantic-size-space-500, 16px);
        max-height: 2.5rem;
    }

    .button--large {
        font-size: var(--ts-font-size-300);
        line-height: var(--ts-line-height-300);
        border-radius: var(--ts-semantic-size-radius-lg);
        padding: var(--ts-semantic-size-space-400, 12px) var(--ts-semantic-size-space-700, 24px);
        max-height: 3rem;
    }

    /*
   * Pill modifier
   */
    .button--pill.button--small {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .button--pill.button--medium {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .button--pill.button--large {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    /*
   * Circle modifier
   */

    .button--circle {
        padding: 0;
    }

    .button--circle.button--small {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
    }

    .button--circle.button--medium {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
    }

    .button--circle.button--large {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
    }

    .button--circle .button__prefix,
    .button--circle .button__suffix,
    .button--circle .button__caret {
        display: none;
    }

    /*
   * Caret modifier
   */

    .button--caret .button__suffix {
        display: none;
    }

    .button--caret .button__caret {
        height: auto;
    }

    .button--caret::slotted(ts-icon) {
        color: var(--ts-semantic-color-text-base-default);
    }

    /*
   * Caret-only button (no label, no prefix, no suffix):
   * Hide the empty slot elements so they take no space in the flex row.
   */

    .button--caret:not(.button--has-label):not(.button--has-prefix):not(.button--has-suffix) .button__label,
    .button--caret:not(.button--has-label):not(.button--has-prefix):not(.button--has-suffix) .button__prefix,
    .button--caret:not(.button--has-label):not(.button--has-prefix):not(.button--has-suffix) .button__suffix {
        display: none;
    }

    /*
   * Loading modifier
   */

    .button--loading {
        position: relative;
        cursor: wait;
    }

    .button--loading .button__prefix,
    .button--loading .button__label,
    .button--loading .button__suffix,
    .button--loading .button__caret {
        visibility: hidden;
    }

    .button--loading ts-spinner {
        --indicator-color: currentColor;
        position: absolute;
        font-size: 1em;
        height: 1em;
        width: 1em;
        top: calc(50% - 0.5em);
        left: calc(50% - 0.5em);
    }

    /*
   * Badges
   */

    .button ::slotted(ts-badge) {
        position: absolute;
        top: 0;
        right: 0;
        translate: 50% -50%;
        pointer-events: none;
    }

    .button--rtl ::slotted(ts-badge) {
        right: auto;
        left: 0;
        translate: -50% -50%;
    }

    /*
   * Button spacing
   */
    .button--has-label.button--small .button__label {
        height: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ts-semantic-size-space-0, 0);
        padding: var(--ts-semantic-size-space-0, 0) var(--ts-semantic-size-space-100, 4px);
    }

    .button--has-label.button--medium .button__label {
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ts-semantic-size-space-0, 0);
        padding: var(--ts-semantic-size-space-0, 0) var(--ts-semantic-size-space-100, 4px);
    }

    .button--has-label.button--large .button__label {
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ts-semantic-size-space-0, 0);
        padding: var(--ts-semantic-size-space-0, 0) var(--ts-semantic-size-space-100, 4px);
    }

    /*
   * Instead we use targeted margin on the individual parts:
   *   - prefix gets margin-inline-end  → space between prefix and label
   *   - label  gets margin-inline-end  → space between label and suffix/caret
   *   - caret  gets margin-inline-start → space between label/suffix and caret
   *
   * Each margin is only applied when the corresponding neighbour class exists.
   */

    /* prefix → label gap */
    .button--has-prefix .button__prefix {
        margin-inline-end: var(--ts-semantic-size-space-100);
    }

    /* label → suffix gap */
    .button--has-suffix.button--has-label .button__label {
        margin-inline-end: var(--ts-semantic-size-space-100);
    }

    /* label → caret gap (only when a label is present) */
    .button--caret.button--has-label .button__caret {
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    /* prefix → caret gap (no label, but has prefix) */
    .button--caret.button--has-prefix:not(.button--has-label) .button__caret {
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    /* suffix → caret gap */
    .button--caret.button--has-suffix .button__caret {
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    .button--has-suffix.button--small,
    .button--caret.button--small {
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .button--has-suffix.button--medium,
    .button--caret.button--medium {
        align-items: center;
        display: flex;
        justify-content: center;
    }

    /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */
    :host([data-ts-button-group__button--first]:not([data-ts-button-group__button--last])) .button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    :host([data-ts-button-group__button--inner]) .button {
        border-radius: 0;
    }

    :host([data-ts-button-group__button--last]:not([data-ts-button-group__button--first])) .button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    /* All except the first */
    :host([data-ts-button-group__button]:not([data-ts-button-group__button--first])) {
        margin-inline-start: calc(-1 * 1px);
    }

    /* Add a visual separator between solid buttons */
    :host(
            [data-ts-button-group__button]:not(
                    [data-ts-button-group__button--first],
                    [data-ts-button-group__button--radio],
                    [variant='default']
                ):not(:hover)
        )
        .button:after {
        content: '';
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        bottom: 0;
        border-left: solid 1px rgb(128 128 128 / 33%);
        mix-blend-mode: multiply;
    }

    /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
    :host([data-ts-button-group__button--hover]) {
        z-index: 1;
    }

    /* Focus and checked are always on top */
    :host([data-ts-button-group__button--focus]),
    :host([data-ts-button-group__button][checked]) {
        z-index: 2;
    }

    /* Remove inner borders inside button groups (keep only the outer perimeter) */

    /* First button: remove the border on the side facing inward */
    :host([data-ts-button-group__button--first]:not([data-ts-button-group__button--last])) .button {
        border-inline-end-width: 0;
    }

    /* Inner buttons: remove both inner vertical borders */
    :host([data-ts-button-group__button--inner]) .button {
        border-inline-start-width: var(--ts-semantic-size-width-sm);
        border-inline-end-width: 0;
    }

    /* Last button: remove the border on the side facing inward */
    :host([data-ts-button-group__button--last]:not([data-ts-button-group__button--first])) .button {
        border-inline-start-width: var(--ts-semantic-size-width-sm);
    }

    /* If you keep the rules above, you no longer need border-overlap via negative margin */
    :host([data-ts-button-group__button]:not([data-ts-button-group__button--first])) {
        margin-inline-start: 0;
    }
`;
