import { css } from 'lit';

export default css`
    :host {
        display: block;
    }

    .pagination {
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: var(--ts-semantic-size-space-100, 4px);
        list-style: none;
        margin: 0;
        padding: 0;
    }
`;
