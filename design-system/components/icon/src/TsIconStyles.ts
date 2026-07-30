import { css } from 'lit';

export default css`
    :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: content-box !important;
        color: var(--icon-color, var(--ts-semantic-color-text-base-default));
        width: var(--ts-icon-size);
        height: var(--ts-icon-size);
    }

    svg {
        display: block;
        width: 100%;
        height: 100%;
        fill: currentColor;
    }

    /* Style SVGs and images passed via slot */
    ::slotted(svg) {
        display: block;
        width: 100%;
        height: 100%;
        fill: currentColor;
        color: inherit;
    }

    ::slotted(img) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
