import { css } from 'lit';

export default css`
    :host {
        display: block;
        position: relative;
        background: var(--ts-semantic-color-surface-base-default);
        border: solid var(--ts-semantic-size-width-xs) var(--ts-semantic-color-border-neutral-subtle-default);
        border-radius: var(--ts-semantic-size-radius-md);
        padding: var(--ts-semantic-size-space-300) 0;
        overflow: auto;
        overscroll-behavior: none;
    }

    ::slotted(ts-divider) {
        --spacing: var(--ts-semantic-size-space-300);
    }
`;
