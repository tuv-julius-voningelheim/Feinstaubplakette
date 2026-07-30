import { css } from 'lit';

export default css`
    ::slotted(a.button) {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border-style: solid !important;
        border-width: var(--ts-semantic-size-width-sm) !important;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif !important;
        font-weight: var(--ts-semantic-typography-font-weight-medium) !important;
        text-decoration: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        white-space: nowrap !important;
        vertical-align: middle !important;
        cursor: inherit !important;
        transition:
            var(--ts-semantic-transition-duration-xfast) background-color,
            var(--ts-semantic-transition-duration-xfast) color,
            var(--ts-semantic-transition-duration-xfast) border,
            var(--ts-semantic-transition-duration-xfast) box-shadow;
    }

    ::slotted(a.button:focus) {
        outline: none !important;
    }

    ::slotted(a.button:focus-visible) {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused) !important;
        outline-offset: 1px !important;
    }

    ::slotted(a.button--disabled) {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
    }

    /*
   * Standard buttons
   */

    ::slotted(a.button--standard) {
        align-items: center !important;
    }

    /* Default */
    ::slotted(a.button--standard.button--default) {
        background-color: var(--ts-semantic-color-background-base-default) !important;
        border-color: var(--ts-semantic-color-border-base-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--default:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-base-hover) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--default:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-base-active) !important;
        border-color: var(--ts-semantic-color-border-base-active) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    /* Primary */
    ::slotted(a.button--standard.button--primary) {
        background-color: var(--ts-semantic-color-background-primary-default) !important;
        border-color: var(--ts-semantic-color-border-primary-default) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--primary:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-primary-hover) !important;
        border-color: var(--ts-semantic-color-border-primary-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--primary:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-primary-active) !important;
        border-color: var(--ts-semantic-color-border-primary-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Success */
    ::slotted(a.button--standard.button--success) {
        background-color: var(--ts-semantic-color-background-success-default) !important;
        border-color: var(--ts-semantic-color-border-success-default) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--success:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-success-hover) !important;
        border-color: var(--ts-semantic-color-border-success-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--success:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-success-active) !important;
        border-color: var(--ts-semantic-color-border-success-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Neutral */
    ::slotted(a.button--standard.button--neutral) {
        background-color: var(--ts-semantic-color-background-neutral-default) !important;
        border-color: var(--ts-semantic-color-border-neutral-default) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--neutral:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-neutral-hover) !important;
        border-color: var(--ts-semantic-color-border-neutral-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--neutral:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-neutral-active) !important;
        border-color: var(--ts-semantic-color-border-neutral-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Warning */
    ::slotted(a.button--standard.button--warning) {
        background-color: var(--ts-semantic-color-background-warning-default) !important;
        border-color: var(--ts-semantic-color-border-warning-default) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--warning:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-warning-hover) !important;
        border-color: var(--ts-semantic-color-border-warning-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--warning:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-warning-active) !important;
        border-color: var(--ts-semantic-color-border-warning-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Danger */
    ::slotted(a.button--standard.button--danger) {
        background-color: var(--ts-semantic-color-background-danger-default) !important;
        border-color: var(--ts-semantic-color-border-danger-default) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--danger:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-danger-hover) !important;
        border-color: var(--ts-semantic-color-border-danger-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--danger:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-danger-active) !important;
        border-color: var(--ts-semantic-color-border-danger-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* accent01 */
    ::slotted(a.button--standard.button--accent01) {
        background-color: var(--ts-semantic-color-background-accent01-default) !important;
        border-color: var(--ts-semantic-color-border-accent01-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--accent01:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent01-hover) !important;
        border-color: var(--ts-semantic-color-border-accent01-hover) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--accent01:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent01-active) !important;
        border-color: var(--ts-semantic-color-border-accent01-active) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    /* accent02 */
    ::slotted(a.button--standard.button--accent02) {
        background-color: var(--ts-semantic-color-background-accent02-default) !important;
        border-color: var(--ts-semantic-color-border-accent02-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--accent02:hover:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent02-hover) !important;
        border-color: var(--ts-semantic-color-border-accent02-hover) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--standard.button--accent02:active:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent02-active) !important;
        border-color: var(--ts-semantic-color-border-accent02-active) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    /* navbar */
    ::slotted(a.button--standard.button--navbar) {
        background: none !important;
        border: none !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--standard.button--navbar:hover:not(.button--disabled)) {
        background: none !important;
        border: none !important;
        color: var(--ts-semantic-color-text-inverted-hover) !important;
    }

    ::slotted(a.button--standard.button--navbar:active:not(.button--disabled)) {
        background: none !important;
        border: none !important;
        color: var(--ts-semantic-color-text-inverted-disabled) !important;
    }

    /*
   * Outline buttons
   */
    ::slotted(a.button--outline) {
        background: none !important;
        border: solid var(--ts-semantic-size-width-sm) !important;
    }

    /* Default */
    ::slotted(a.button--outline.button--default) {
        border-color: var(--ts-semantic-color-border-base-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--outline.button--default:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--default.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-base-hover) !important;
    }

    ::slotted(a.button--outline.button--default:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-base-active) !important;
        background-color: var(--ts-semantic-color-background-base-active) !important;
    }

    /* Primary */
    ::slotted(a.button--outline.button--primary) {
        border-color: var(--ts-semantic-color-border-primary-default) !important;
        color: var(--ts-semantic-color-text-primary-default) !important;
    }

    ::slotted(a.button--outline.button--primary:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--primary.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-primary-hover) !important;
        border-color: var(--ts-semantic-color-background-primary-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--outline.button--primary:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-primary-active) !important;
        background-color: var(--ts-semantic-color-background-primary-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Success */
    ::slotted(a.button--outline.button--success) {
        border-color: var(--ts-semantic-color-border-success-default) !important;
        color: var(--ts-semantic-color-text-success-default) !important;
    }

    ::slotted(a.button--outline.button--success:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--success.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-success-hover) !important;
        border-color: var(--ts-semantic-color-background-success-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--outline.button--success:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-success-active) !important;
        background-color: var(--ts-semantic-color-background-success-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* accent01 */
    ::slotted(a.button--outline.button--accent01:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent01-active) !important;
        background-color: var(--ts-semantic-color-background-accent01-active) !important;
        color: var(--ts-semantic-color-border-accent01-active) !important;
    }

    ::slotted(a.button--outline.button--accent01:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--accent01.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent01-hover) !important;
        border-color: var(--ts-semantic-color-background-accent01-hover) !important;
        color: var(--ts-semantic-color-border-accent01-active) !important;
    }

    ::slotted(a.button--outline.button--accent01:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent01-active) !important;
        background-color: var(--ts-semantic-color-background-accent01-active) !important;
        color: var(--ts-semantic-color-border-accent01-active) !important;
    }

    /* accent02 */
    ::slotted(a.button--outline.button--accent02:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent02-active) !important;
        background-color: var(--ts-semantic-color-background-accent02-active) !important;
        color: var(--ts-semantic-color-border-accent02-active) !important;
    }

    ::slotted(a.button--outline.button--accent02:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--accent02.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent02-hover) !important;
        border-color: var(--ts-semantic-color-background-accent02-hover) !important;
        color: var(--ts-semantic-color-border-accent02-active) !important;
    }

    ::slotted(a.button--outline.button--accent02:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent02-active) !important;
        background-color: var(--ts-semantic-color-background-accent02-active) !important;
        color: var(--ts-semantic-color-border-accent02-active) !important;
    }

    /* Neutral */
    ::slotted(a.button--outline.button--neutral) {
        border-color: var(--ts-semantic-color-border-neutral-default) !important;
        color: var(--ts-semantic-color-text-neutral-default) !important;
    }

    ::slotted(a.button--outline.button--neutral:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--neutral.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-neutral-hover) !important;
        border-color: var(--ts-semantic-color-background-neutral-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--outline.button--neutral:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-neutral-active) !important;
        background-color: var(--ts-semantic-color-background-neutral-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Warning */
    ::slotted(a.button--outline.button--warning) {
        border-color: var(--ts-semantic-color-border-warning-default) !important;
        color: var(--ts-semantic-color-text-warning-default) !important;
    }

    ::slotted(a.button--outline.button--warning:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--warning.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-warning-hover) !important;
        border-color: var(--ts-semantic-color-background-warning-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--outline.button--warning:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-warning-active) !important;
        background-color: var(--ts-semantic-color-background-warning-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* Danger */
    ::slotted(a.button--outline.button--danger) {
        border-color: var(--ts-semantic-color-border-danger-default) !important;
        color: var(--ts-semantic-color-text-danger-default) !important;
    }

    ::slotted(a.button--outline.button--danger:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--danger.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-danger-hover) !important;
        border-color: var(--ts-semantic-color-background-danger-hover) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    ::slotted(a.button--outline.button--danger:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-danger-active) !important;
        background-color: var(--ts-semantic-color-background-danger-active) !important;
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    /* accent01 */
    ::slotted(a.button--outline.button--accent01) {
        border-color: var(--ts-semantic-color-border-accent01-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--outline.button--accent01:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--accent01.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent01-hover) !important;
        border-color: var(--ts-semantic-color-background-accent01-hover) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--outline.button--accent01:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent01-active) !important;
        background-color: var(--ts-semantic-color-background-accent01-active) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    /* accent02 */
    ::slotted(a.button--outline.button--accent02) {
        border-color: var(--ts-semantic-color-border-accent02-default) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--outline.button--accent02:hover:not(.button--disabled)),
    ::slotted(a.button--outline.button--accent02.button--checked:not(.button--disabled)) {
        background-color: var(--ts-semantic-color-background-accent02-hover) !important;
        border-color: var(--ts-semantic-color-background-accent02-hover) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    ::slotted(a.button--outline.button--accent02:active:not(.button--disabled)) {
        border-color: var(--ts-semantic-color-border-accent02-active) !important;
        background-color: var(--ts-semantic-color-background-accent02-active) !important;
        color: var(--ts-semantic-color-text-base-default) !important;
    }

    @media (forced-colors: active) {
        ::slotted(a.button.button--outline.button--checked:not(.button--disabled)) {
            outline: solid 2px transparent !important;
        }
    }

    /*
   * Text buttons
   */

    ::slotted(a.button--text) {
        background-color: transparent !important;
        border-color: transparent !important;
        color: var(--ts-semantic-color-text-primary-default) !important;
    }

    ::slotted(a.button--text:hover:not(.button--disabled)) {
        background-color: transparent !important;
        border-color: transparent !important;
        color: var(--ts-semantic-color-text-primary-hover) !important;
    }

    ::slotted(a.button--text:focus-visible:not(.button--disabled)) {
        background-color: transparent !important;
        border-color: transparent !important;
        color: var(--ts-semantic-color-text-primary-default) !important;
    }

    ::slotted(a.button--text:active:not(.button--disabled)) {
        background-color: transparent !important;
        border-color: transparent !important;
        color: var(--ts-semantic-color-text-primary-active) !important;
    }

    /* slotted <a> exact control heights */
    ::slotted(a.button--small) {
        font-size: var(--ts-font-size-200) !important;
        line-height: var(--ts-line-height-300) !important;
        border-radius: var(--ts-semantic-size-radius-md) !important;
        padding: 0 var(--ts-semantic-size-space-400, 12px) !important;
        height: 32px !important;
        min-height: 32px !important;
    }

    ::slotted(a.button--medium) {
        font-size: var(--ts-font-size-200) !important;
        line-height: var(--ts-line-height-300) !important;
        border-radius: var(--ts-semantic-size-radius-md) !important;
        padding: 0 var(--ts-semantic-size-space-500, 16px) !important;
        height: 40px !important;
        min-height: 40px !important;
    }

    ::slotted(a.button--large) {
        font-size: var(--ts-font-size-300) !important;
        line-height: var(--ts-line-height-300) !important;
        border-radius: var(--ts-semantic-size-radius-md) !important;
        padding: 0 var(--ts-semantic-size-space-700, 24px) !important;
        height: 48px !important;
        min-height: 48px !important;
    }

    /*
   * Pill modifier
   */
    ::slotted(a.button--pill.button--small) {
        border-radius: var(--ts-semantic-size-radius-pill) !important;
    }

    ::slotted(a.button--pill.button--medium) {
        border-radius: var(--ts-semantic-size-radius-pill) !important;
    }

    ::slotted(a.button--pill.button--large) {
        border-radius: var(--ts-semantic-size-radius-pill) !important;
    }

    /*
   * Circle modifier
   */

    ::slotted(a.button--circle) {
        padding: 0 !important;
    }

    ::slotted(a.button--circle.button--small) {
        width: 2rem !important;
        height: 2rem !important;
        border-radius: 50% !important;
        align-items: center !important;
        justify-content: center !important;
    }

    ::slotted(a.button--circle.button--medium) {
        width: 2.5rem !important;
        height: 2.5rem !important;
        border-radius: 50% !important;
        align-items: center !important;
        justify-content: center !important;
    }

    ::slotted(a.button--circle.button--large) {
        width: 3rem !important;
        height: 3rem !important;
        border-radius: 50% !important;
        align-items: center !important;
        justify-content: center !important;
    }

    /*
   * Loading modifier
   */

    ::slotted(a.button--loading) {
        position: relative !important;
        cursor: wait !important;
    }
`;
