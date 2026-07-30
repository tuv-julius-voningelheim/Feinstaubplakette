import { css } from 'lit';
export default css`
    :host {
        display: block;
    }

    .menu-label {
        display: inline-block;
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: var(--ts-semantic-typography-ui-font-size-md);
        font-weight: var(--ts-semantic-typography-font-weight-bold);
        line-height: var(--ts-line-height-200);
        color: var(--ts-semantic-color-text-base-default);
        padding: var(--ts-semantic-size-space-300) var(--ts-semantic-size-space-500);
        user-select: none;
        -webkit-user-select: none;
    }
`;
