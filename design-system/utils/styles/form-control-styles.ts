import { css } from 'lit';

export default css`
    .form-control .form-control__label {
        display: none;
    }

    .form-control .form-control__help-text {
        display: none;
    }

    /* Label with icon */
    .form-control__label--has-icon {
        display: inline-flex !important;
        align-items: center;
        gap: var(--ts-semantic-size-space-100, 0.25rem);
    }

    .form-control__label--has-icon ::slotted([slot='label-icon']) {
        display: inline-flex !important;
        align-items: center;
        flex-shrink: 0;
        line-height: 1;
        vertical-align: middle;
    }

    /* Label */
    .form-control--has-label .form-control__label {
        display: inline-block;
        color: var(--ts-semantic-color-text-base-default);
        margin-bottom: var(--ts-semantic-size-space-100);
    }

    .form-control--has-label.form-control--small .form-control__label {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
    }

    .form-control--has-label.form-control--medium .form-control__label {
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    .form-control--has-label.form-control--large .form-control__label {
        font-size: var(--ts-semantic-typography-ui-font-size-lg);
    }

    /* Visually hidden label - accessible but not visible */
    .form-control--label-hidden .form-control__label {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        clip: rect(0 0 0 0) !important;
        clip-path: inset(50%) !important;
        border: none !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        padding: 0 !important;
        margin: -1px !important;
    }

    :host([required]) .form-control--has-label .form-control__label::after {
        content: '*';
        color: var(--ts-semantic-color-text-danger-default);
        margin-inline-start: 2px;
    }

    /* Help text */
    .form-control--has-help-text .form-control__help-text:not(.form-control__help-text--error) {
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .form-control--has-help-text .form-control__help-text {
        display: block;
        margin-top: var(--ts-semantic-size-space-100);
    }

    .form-control--has-help-text.form-control--small .form-control__help-text {
        font-size: var(--ts-semantic-typography-ui-font-size-xs);
    }

    .form-control--has-help-text.form-control--medium .form-control__help-text {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
    }

    .form-control--has-help-text.form-control--large .form-control__help-text {
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    .form-control--has-help-text.form-control--radio-group .form-control__help-text {
        margin-top: var(--ts-semantic-size-space-200);
    }

    /* Error state */
    .form-control__help-text--error {
        display: block;
        color: var(--ts-semantic-color-text-danger-default);
    }

    /* Visually hidden utility class - accessible but not visible */
    .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
