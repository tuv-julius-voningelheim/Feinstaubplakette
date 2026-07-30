import type { TsCarouselSlideDetail } from './ts-slide-change.js';

export type TsClickNextEvent = CustomEvent<TsCarouselSlideDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-click-next': TsClickNextEvent;
    }
}
