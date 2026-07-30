import type { TsPaginationClickDetail } from './ts-page-click.js';

export type TsPrevClickEvent = CustomEvent<TsPaginationClickDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-prev-click': TsPrevClickEvent;
    }
}
