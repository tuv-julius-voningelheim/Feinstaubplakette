import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .form-control {
        position: relative;
        border: none;
        padding: 0;
        margin: 0;
    }

    .form-control--has-label .form-control__label {
        padding: 0;
        margin-bottom: var(--ts-semantic-size-space-300);
    }

    /* Direction */
    .radio-group__items {
        display: flex;
    }

    .radio-group__items--vertical {
        flex-direction: column;
        align-items: flex-start;
    }

    .radio-group__items--vertical--small {
        gap: var(--ts-semantic-size-space-50, 8px);
    }

    .radio-group__items--vertical--medium {
        gap: var(--ts-semantic-size-space-100, 8px);
    }

    .radio-group__items--vertical--large {
        gap: var(--ts-semantic-size-space-200, 8px);
    }

    .radio-group__items--horizontal {
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-between;
    }

    .radio-group__items--horizontal--small {
        gap: var(--ts-semantic-size-space-200, 8px);
    }

    .radio-group__items--horizontal--medium {
        gap: var(--ts-semantic-size-space-300, 8px);
    }

    .radio-group__items--horizontal--large {
        gap: var(--ts-semantic-size-space-400, 8px);
    }
`;
