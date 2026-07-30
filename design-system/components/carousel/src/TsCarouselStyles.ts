import { css } from 'lit';

export default css`
    :host {
        --slide-gap: var(--ts-semantic-size-space-500, 1rem);
        --aspect-ratio: 16 / 9;
        --scroll-hint: 0px;

        display: flex;
    }

    .carousel {
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        grid-template-rows: 1fr min-content;
        grid-template-areas:
            '. slides .'
            '. pagination .';
        gap: var(--ts-semantic-size-space-500);
        align-items: center;
        min-height: 100%;
        min-width: 100%;
        position: relative;
    }

    .carousel__pagination {
        grid-area: pagination;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: var(--ts-semantic-size-space-400);
        overflow: hidden;
        max-width: 100%;
        padding: var(--ts-semantic-size-space-200) 0;
    }

    .carousel__pagination--vertical {
        align-items: center;
        width: 18px;
    }

    .carousel__slides {
        grid-area: slides;

        display: grid;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-items: center;
        overflow: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        aspect-ratio: calc(var(--aspect-ratio) * var(--slides-per-page));
        border-radius: var(--ts-semantic-size-radius-md);

        --slide-size: calc((100% - (var(--slides-per-page) - 1) * var(--slide-gap)) / var(--slides-per-page));
    }

    @media (prefers-reduced-motion) {
        :where(.carousel__slides) {
            scroll-behavior: auto;
        }
    }

    .carousel__slides--horizontal {
        grid-auto-flow: column;
        grid-auto-columns: var(--slide-size);
        grid-auto-rows: 100%;
        column-gap: var(--slide-gap);
        scroll-snap-type: x mandatory;
        scroll-padding-inline: var(--scroll-hint);
        padding-inline: var(--scroll-hint);
        overflow-y: hidden;
    }

    .carousel__slides--vertical {
        grid-auto-flow: row;
        grid-auto-columns: 100%;
        grid-auto-rows: var(--slide-size);
        row-gap: var(--slide-gap);
        scroll-snap-type: y mandatory;
        scroll-padding-block: var(--scroll-hint);
        padding-block: var(--scroll-hint);
        overflow-x: hidden;
    }

    .carousel__slides--dragging {
    }

    :host([vertical]) ::slotted(ts-carousel-item) {
        height: 100%;
    }

    .carousel__slides::-webkit-scrollbar {
        display: none;
    }

    .carousel__navigation {
        grid-area: navigation;
        display: contents;
        font-size: var(--ts-semantic-typography-ui-font-size-xl);
    }

    .carousel__navigation-button {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        background: none;
        border: none;
        border-radius: var(--ts-semantic-size-radius-md);
        font-size: inherit;
        color: var(--ts-semantic-color-icon-base-default);
        padding: var(--ts-semantic-size-space-300);
        cursor: pointer;
        transition: var(--ts-semantic-transition-duration-medium) color;
        appearance: none;
    }

    .carousel__navigation-button--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .carousel__navigation-button--disabled::part(base) {
        pointer-events: none;
    }

    .carousel__navigation-button--previous {
        grid-column: 1;
        grid-row: 1;
    }

    .carousel__navigation-button--next {
        grid-column: 3;
        grid-row: 1;
    }

    .carousel__pagination-item {
        display: block;
        cursor: pointer;
        border: 0;
        border-radius: 50%;
        width: var(--ts-semantic-size-space-300);
        height: var(--ts-semantic-size-space-300);
        background-color: var(--ts-semantic-color-background-neutral-default);
        padding: 0;
        margin: 0;
    }

    .carousel__pagination-item--active {
        background-color: var(--ts-semantic-color-background-primary-dark-default);
        transform: scale(1.2);
    }

    /* Focus styles */
    .carousel__slides:focus-visible,
    .carousel__pagination-item:focus-visible {
        outline: solid 3px var(--ts-semantic-color-border-primary-focused);
        outline-offset: 1px;
    }
`;
