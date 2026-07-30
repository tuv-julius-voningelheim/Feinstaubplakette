import { css } from 'lit';

export default css`
    :host {
        display: inline-block;
        --size: var(--ts-semantic-size-space-1000, 48px);
        --avatar-ring-width: 0px;
        --avatar-ring-color: transparent;
    }

    .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: var(--size);
        height: var(--size);
        font-family: var(--ts-semantic-typography-font-family-default), system-ui, sans-serif;
        font-size: calc(var(--size) * 0.5 - 4px);
        font-weight: var(--ts-semantic-typography-font-weight-regular);
        color: var(--ts-semantic-color-text-inverted-default);
        user-select: none;
        -webkit-user-select: none;
        vertical-align: middle;
        box-shadow: 0 0 0 var(--avatar-ring-width) var(--avatar-ring-color);
        border-radius: var(--ts-semantic-size-radius-pill, 99999px);
        border: var(--ts-semantic-size-width-sm, 2px) solid
            var(--ts-semantic-color-border-primary-subtle-default, #f0f6ff);
    }

    .avatar:not(.avatar--has-image) {
        background-color: var(--ts-semantic-color-background-neutral-default);
    }

    .avatar--circle,
    .avatar--circle .avatar__image {
        border-radius: var(--ts-semantic-size-radius-pill);
    }

    .avatar--rounded,
    .avatar--rounded .avatar__image {
        border-radius: var(--ts-semantic-size-radius-md);
    }

    .avatar--square {
        border-radius: 0;
    }

    .avatar__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        --icon-color: var(--ts-semantic-color-text-inverted-default);
    }

    .avatar__initials {
        line-height: 1;
        text-transform: uppercase;
    }

    .avatar__image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;
    }
`;
