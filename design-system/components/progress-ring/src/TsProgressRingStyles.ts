import { css } from 'lit';

export default css`
    :host {
        --size: 128px;
        --track-color: var(--ts-semantic-color-border-base-default);
        --indicator-color: var(--ts-semantic-color-border-primary-default);
        --indicator-transition-duration: 0.35s;
        color: var(--ts-semantic-color-text-base-default);
        display: inline-flex;
    }

    .progress-ring {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .progress-ring__image {
        width: var(--size);
        height: var(--size);
        /* rotate so 0% starts at 12 o'clock */
        rotate: -90deg;
        transform-origin: 50% 50%;
    }

    .progress-ring__track,
    .progress-ring__indicator {
        fill: none;
    }

    .progress-ring__track {
        stroke: var(--track-color);
    }

    .progress-ring__indicator {
        stroke: var(--indicator-color);
        stroke-linecap: round;
        transition: stroke-dashoffset var(--indicator-transition-duration) ease;
    }

    .progress-ring__label {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-align: center;
        user-select: none;
        -webkit-user-select: none;
    }
`;
