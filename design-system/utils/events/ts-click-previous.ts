import type { TsCarouselSlideDetail } from './ts-slide-change.js';

export type TsClickPreviousEvent = CustomEvent<TsCarouselSlideDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-click-previous': TsClickPreviousEvent;
    }
}
