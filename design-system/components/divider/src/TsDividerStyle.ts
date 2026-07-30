import { css } from 'lit';

export default css`
    :host {
        --color: var(--ts-semantic-color-border-base-default);
        --width: 1px;
        --spacing: var(--ts-semantic-size-space-500);
    }

    :host(:not([vertical])) {
        display: block;
        border-top: solid var(--width) var(--color);
        margin: var(--spacing) 0;
    }

    :host([vertical]) {
        display: inline-block;
        height: 100%;
        border-left: solid var(--width) var(--color);
        margin: 0 var(--spacing);
    }
`;
