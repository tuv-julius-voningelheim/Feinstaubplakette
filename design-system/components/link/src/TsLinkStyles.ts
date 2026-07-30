import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
    }

    .link,
    ::slotted(a.link) {
        display: inline-flex !important;
        gap: var(--ts-semantic-size-space-100, 4px) !important;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif !important;
        font-size: var(--ts-font-size-300) !important;
        font-style: normal !important;
        font-weight: 500 !important;
        line-height: var(--ts-line-height-400) !important;
        text-decoration-line: underline !important;
        text-decoration-style: solid !important;
        text-decoration-skip-ink: none !important;
        text-decoration-thickness: auto !important;
        text-underline-offset: auto !important;
        text-underline-position: from-font !important;
        cursor: pointer !important;
        outline: 2px solid transparent !important;
        outline-offset: 2px !important;
    }

    .link--external::after,
    ::slotted(a.link--external)::after {
        content: '' !important;
        width: 14px !important;
        min-width: 14px !important;
        height: 14px !important;
        display: inline-block !important;
        margin-top: 3px !important;
        background-color: currentColor !important;

        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'%3E%3Cpath d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z'/%3E%3C/svg%3E")
            no-repeat center / contain !important;

        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'%3E%3Cpath d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z'/%3E%3C/svg%3E")
            no-repeat center / contain !important;
    }

    .link--no-underline,
    ::slotted(a.link--no-underline) {
        text-decoration-line: none !important;
    }

    .link:hover,
    ::slotted(a.link:hover) {
        text-decoration-line: none !important;
    }

    .link:focus-visible,
    ::slotted(a.link:focus-visible) {
        outline: solid 2px var(--ts-semantic-color-border-primary-focused) !important;
        outline-offset: 1px !important;
        border-radius: 4px !important;
    }

    .link--primary,
    ::slotted(a.link--primary) {
        color: var(--ts-semantic-color-text-primary-default) !important;
    }

    .link--primary:hover,
    ::slotted(a.link--primary:hover) {
        color: var(--ts-semantic-color-text-primary-hover) !important;
    }

    .link--primary:not(.link--no-visited):visited,
    ::slotted(a.link--primary:not(.link--no-visited):visited) {
        color: var(--ts-semantic-color-text-visited-default) !important;
    }

    .link--secondary,
    ::slotted(a.link--secondary) {
        color: var(--ts-semantic-color-text-primary-active) !important;
    }

    .link--secondary:hover,
    ::slotted(a.link--secondary:hover) {
        color: var(--ts-semantic-color-text-primary-hover) !important;
    }

    .link--secondary:not(.link--no-visited):visited,
    ::slotted(a.link--secondary:not(.link--no-visited):visited) {
        color: var(--ts-semantic-color-text-visited-default) !important;
    }

    .link--inverted-text,
    ::slotted(a.link--inverted-text) {
        color: var(--ts-semantic-color-text-inverted-default) !important;
    }

    .link--inverted-text:hover,
    ::slotted(a.link--inverted-text:hover) {
        color: var(--ts-semantic-color-text-inverted-hover) !important;
    }

    .link--inverted-text:not(.link--no-visited):visited,
    ::slotted(a.link--inverted-text:not(.link--no-visited):visited) {
        color: var(--ts-semantic-color-text-inverted-hover) !important;
    }

    .link--disabled,
    ::slotted(a.link--disabled) {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
    }

    .link--small,
    ::slotted(a.link--small) {
        font-size: var(--ts-font-size-100) !important;
    }

    .link--medium,
    ::slotted(a.link--medium) {
        font-size: var(--ts-font-size-200) !important;
    }

    .link--large,
    ::slotted(a.link--large) {
        font-size: var(--ts-font-size-300) !important;
    }
`;
