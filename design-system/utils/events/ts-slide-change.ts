export interface TsCarouselSlideDetail {
    /** Zero-based index of the active slide. */
    index: number;
    /** The carousel item element that became active, or undefined if no slides exist. */
    slide: HTMLElement | undefined;
}

export type TsSlideChangeEvent = CustomEvent<TsCarouselSlideDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-slide-change': TsSlideChangeEvent;
    }
}
