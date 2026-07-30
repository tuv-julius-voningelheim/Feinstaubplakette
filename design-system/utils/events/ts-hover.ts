export interface TsHoverDetail {
    /** The hover phase. */
    phase: 'start' | 'move' | 'end';
    /** The hovered rating value. */
    value: number;
}

export type TsHoverEvent = CustomEvent<TsHoverDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-hover': TsHoverEvent;
    }
}
