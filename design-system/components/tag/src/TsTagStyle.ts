import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        --tag-prefix-gap: 0.35em;
        --tag-icon-size: 12px;
        --tag-remove-icon-size: 12px;
        --tag-remove-box: 18px;
    }

    .tag {
        display: flex;
        align-items: center;
        justify-content: center;
        border: solid 1px;
        line-height: 1;
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }

    .tag--no-border {
        border: none;
    }

    .tag__prefix {
        display: contents;
    }

    ::slotted([slot='prefix']) {
        display: inline-flex;
        align-items: center;
        margin-inline-end: var(--tag-prefix-gap);
        width: var(--tag-icon-size);
        height: var(--tag-icon-size);
    }

    ::slotted(ts-icon[slot='prefix']),
    ::slotted(ts-icon-button[slot='prefix']) {
        color: inherit;
    }

    .tag__remove {
        color: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tag__remove::part(base) {
        color: inherit;
        padding: 0;
    }

    .tag--primary {
        background-color: var(--ts-semantic-color-background-primary-subtle-default);
        border-color: var(--ts-semantic-color-border-primary-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag--success {
        background-color: var(--ts-semantic-color-background-success-subtle-default);
        border-color: var(--ts-semantic-color-border-success-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag--neutral {
        background-color: var(--ts-semantic-color-background-neutral-subtle-default);
        border-color: var(--ts-semantic-color-border-neutral-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag--warning {
        background-color: var(--ts-semantic-color-background-warning-subtle-default);
        border-color: var(--ts-semantic-color-border-warning-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag--danger {
        background-color: var(--ts-semantic-color-background-danger-subtle-default);
        border-color: var(--ts-semantic-color-border-danger-default);
        color: var(--ts-semantic-color-text-base-default);
    }

    .tag--primary:active > ts-icon-button,
    .tag--success:active > ts-icon-button,
    .tag--neutral:active > ts-icon-button,
    .tag--warning:active > ts-icon-button,
    .tag--danger:active > ts-icon-button {
        color: var(--ts-semantic-color-text-base-active);
    }

    .tag--small {
        font-size: var(--ts-semantic-typography-ui-font-size-xs);
        height: calc(var(--ts-semantic-size-space-750) * 0.8);
        line-height: calc(var(--ts-semantic-size-space-750) - 2px);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: 0 var(--ts-semantic-size-space-300) 0 var(--ts-semantic-size-space-300);
    }

    .tag--small .tag__remove {
        margin-inline-start: var(--ts-semantic-size-space-100);
    }

    :host([size='small']) ::slotted([slot='prefix']) {
        --tag-icon-size: var(--tag-icon-size-small, 12px);
    }

    :host([size='small']) .tag__remove {
        --tag-remove-icon-size: 12px;
        --tag-remove-box: 18px;
    }

    .tag--medium {
        font-size: var(--ts-semantic-typography-ui-font-size-sm);
        height: calc(var(--ts-semantic-size-space-900) * 0.8);
        line-height: calc(var(--ts-semantic-size-space-900) - 2px);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: 0 var(--ts-semantic-size-space-400) 0 var(--ts-semantic-size-space-400);
    }

    .tag--medium .tag__remove {
        margin-inline-start: var(--ts-semantic-size-space-300);
    }

    :host([size='medium']) ::slotted([slot='prefix']) {
        --tag-icon-size: var(--tag-icon-size-medium, 14px);
    }

    :host([size='medium']) .tag__remove {
        --tag-remove-icon-size: 14px;
        --tag-remove-box: 20px;
    }

    .tag--large {
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        height: calc(var(--ts-semantic-size-space-1000) * 0.8);
        line-height: calc(var(--ts-semantic-size-space-1000) - 2px);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: 0 var(--ts-semantic-size-space-500) 0 var(--ts-semantic-size-space-500);
    }

    .tag--large .tag__remove {
        margin-inline-start: var(--ts-semantic-size-space-300);
    }

    :host([size='large']) ::slotted([slot='prefix']) {
        --tag-icon-size: var(--tag-icon-size-large, 16px);
    }

    :host([size='large']) .tag__remove {
        --tag-remove-icon-size: 16px;
        --tag-remove-box: 22px;
    }

    .tag--pill {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .tag__remove,
    .tag__remove::part(base),
    .tag__remove::part(icon) {
        color: inherit;
    }

    ::slotted(ts-icon[slot='prefix']),
    ::slotted(ts-icon-button[slot='prefix']) {
        color: inherit;
    }
`;
