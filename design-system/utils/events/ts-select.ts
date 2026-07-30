import type { TsMenuItem } from '../../components/menu-item/index.js';

export interface TsSelectDetail {
    /** The menu item that was selected. */
    item: TsMenuItem;
}

export type TsSelectEvent = CustomEvent<TsSelectDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-select': TsSelectEvent;
    }
}
