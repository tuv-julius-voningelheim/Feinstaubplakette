export interface TsColumnResizeDetail {
    /** The field key of the column being resized. */
    field: string;
    /** The new width as a CSS length string (e.g. `"180px"`). */
    width: string | undefined;
}

export type TsColumnResizeEvent = CustomEvent<TsColumnResizeDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-column-resize': TsColumnResizeEvent;
    }
}
