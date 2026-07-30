import type { TsPaginationClickDetail } from './ts-page-click.js';

export type TsNextClickEvent = CustomEvent<TsPaginationClickDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-next-click': TsNextClickEvent;
    }
}
