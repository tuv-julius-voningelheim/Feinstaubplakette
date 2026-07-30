export interface TsDropDetail {
    /** The files that were dropped onto the dropzone. */
    files: File[];
}

export type TsDropEvent = CustomEvent<TsDropDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-drop': TsDropEvent;
    }
}
