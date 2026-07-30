import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        --overlap: 1rem;
        --avatar-group-ring-width: 2px;
        --avatar-group-ring-color: var(--ts-core-color-neutral-50);
    }

    .group {
        display: inline-flex;
        align-items: center;
    }

    ::slotted(ts-avatar:not(:first-of-type)) {
        margin-left: calc(var(--overlap) * -1);
    }

    ts-avatar.overflow {
        --ts-avatar-ring-width: var(--avatar-group-ring-width);
        --ts-avatar-ring-color: var(--avatar-group-ring-color);
        margin-left: calc(var(--overlap) * -1);
    }
`;
