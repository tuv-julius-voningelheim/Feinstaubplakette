export interface TsTabDetail {
    /** The name of the tab panel. */
    name: string;
}

export type TsTabShowEvent = CustomEvent<TsTabDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-tab-show': TsTabShowEvent;
    }
}
