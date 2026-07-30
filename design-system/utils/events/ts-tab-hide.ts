import type { TsTabDetail } from './ts-tab-show.js';

export type TsTabHideEvent = CustomEvent<TsTabDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-tab-hide': TsTabHideEvent;
    }
}
