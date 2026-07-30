import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
    }

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

    .dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        border: 2px dashed var(--ts-semantic-color-border-base-active);
        border-radius: var(--ts-semantic-size-radius-xl);
        background-color: var(--ts-semantic-color-background-base-default);
        cursor: pointer;
        transition:
            var(--ts-semantic-transition-duration-fast) border-color,
            var(--ts-semantic-transition-duration-fast) background-color,
            var(--ts-semantic-transition-duration-fast) box-shadow;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Size variants */
    .dropzone--small {
        min-height: 120px;
        padding: var(--ts-semantic-size-space-400);
    }

    .dropzone--medium {
        min-height: 180px;
        padding: var(--ts-semantic-size-space-600);
    }

    .dropzone--large {
        min-height: 240px;
        padding: var(--ts-semantic-size-space-800);
    }

    /* Hover state */
    .dropzone:hover:not(.dropzone--disabled) {
        border-color: var(--ts-semantic-color-border-neutral-default);
        background-color: var(--ts-semantic-color-background-base-hover);
    }

    /* Keyboard focus (reliable, uses component JS state) */
    .dropzone.dropzone--focused:not(.dropzone--disabled) {
        outline: 3px solid var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Native focus-visible (keep as progressive enhancement) */
    .dropzone:focus-visible {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Dragging state */
    .dropzone--dragging:not(.dropzone--disabled) {
        border-color: var(--ts-semantic-color-border-base-active);
        background-color: var(--ts-semantic-color-background-base-hover);
        border-style: solid;
        cursor: pointer;
    }

    /* Dragging but locked (can't add more files) */
    .dropzone--dragging.dropzone--disabled {
        cursor: not-allowed;
    }

    /* Error state */
    .dropzone--error {
        border-color: var(--ts-semantic-color-border-danger-default);
    }

    .dropzone--error:hover:not(.dropzone--disabled) {
        border-color: var(--ts-semantic-color-border-danger-hover);
    }

    /* Error + keyboard focus */
    .dropzone--error.dropzone--focused:not(.dropzone--disabled) {
        outline: 2px solid var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    /* Disabled state */
    .dropzone--disabled {
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Hidden file input */
    .dropzone__input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* Content wrapper */
    .dropzone__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        pointer-events: none;
        gap: var(--ts-semantic-size-space-300);
    }

    .dropzone__loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
    }

    /* Icon */
    .dropzone__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        --icon-color: var(--ts-semantic-color-border-base-active);
        background: var(--ts-semantic-color-text-inverted-disabled);
        border-radius: var(--ts-semantic-size-radius-pill);
        padding: var(--ts-semantic-size-space-300);
    }

    .dropzone--dragging .dropzone__icon {
        --icon-color: var(--ts-semantic-color-icon-neutral-default);
    }

    .dropzone--error .dropzone__icon {
        --icon-color: var(--ts-semantic-color-icon-danger-default);
    }

    /* Text content */
    .dropzone__text {
        display: flex;
        flex-direction: column;
        gap: var(--ts-semantic-size-space-100);
    }

    .dropzone__label {
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        color: var(--ts-semantic-color-text-base-default);
    }

    .dropzone--small .dropzone__label {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
    }

    .dropzone--medium .dropzone__label {
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }

    .dropzone--large .dropzone__label {
        font-size: var(--ts-semantic-typography-ui-font-size-lg);
    }

    .dropzone__description {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .dropzone--small .dropzone__description {
        font-size: var(--ts-semantic-typography-ui-font-size-xs);
    }

    /* File list */
    .dropzone__file-list {
        display: flex;
        flex-direction: column;
        gap: var(--ts-semantic-size-space-100);
        margin-top: var(--ts-semantic-size-space-400);
        width: 100%;
    }

    .dropzone__file-item {
        display: flex;
        align-items: center;
        gap: var(--ts-semantic-size-space-300);
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-400) var(--ts-semantic-size-space-300)
            var(--ts-semantic-size-space-500);
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
        border-radius: var(--ts-semantic-size-radius-xl);
        border: 1px solid var(--ts-semantic-color-border-neutral-subtle-default);
    }

    .dropzone__file-icon {
        flex-shrink: 0;
        font-size: 1.25rem;
        color: var(--ts-semantic-color-icon-neutral-default);
    }

    .dropzone__file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        gap: var(--ts-semantic-size-space-100);
    }

    .dropzone__file-name {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        font-weight: var(--ts-semantic-typography-font-weight-medium);
        color: var(--ts-semantic-color-text-base-default);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .dropzone__file-size {
        font-size: var(--ts-semantic-typography-ui-font-size-xs);
        color: var(--ts-semantic-color-text-neutral-default);
    }

    .dropzone__file-remove {
        flex-shrink: 0;
        --icon-button-color: var(--ts-semantic-color-icon-neutral-default);
    }

    .dropzone__file-remove:hover {
        --icon-button-color: var(--ts-semantic-color-icon-danger-default);
    }

    /* File thumbnail (image preview) */
    .dropzone__file-thumbnail-wrapper {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: var(--ts-semantic-size-radius-md);
        overflow: hidden;
        border: 1px solid var(--ts-semantic-color-border-neutral-subtle-default);
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
    }

    .dropzone__file-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform var(--ts-semantic-transition-duration-fast);
    }

    .dropzone__file-thumbnail-wrapper:hover .dropzone__file-thumbnail {
        transform: scale(1.05);
    }

    /* File type icon (non-image files) */
    .dropzone__file-type-icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        border-radius: var(--ts-semantic-size-radius-md);
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
        border: 1px solid var(--ts-semantic-color-border-neutral-subtle-default);
        color: var(--ts-semantic-color-icon-neutral-default);
        --icon-color: var(--ts-semantic-color-icon-neutral-default);
    }

    .dropzone__file-type-ext {
        font-size: 9px;
        font-weight: var(--ts-semantic-typography-font-weight-bold);
        color: var(--ts-semantic-color-text-neutral-default);
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        max-width: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Form control styles for small size */
    .form-control--small .form-control__label {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
    }

    .form-control--small .form-control__help-text {
        font-size: var(--ts-semantic-typography-ui-font-size-xs);
    }

    /* Form control styles for large size */
    .form-control--large .form-control__label {
        font-size: var(--ts-semantic-typography-ui-font-size-lg);
    }

    .form-control--large .form-control__help-text {
        font-size: var(--ts-semantic-typography-ui-font-size-md);
    }
`;
