export interface TsRangeChangeDetail {
    /** The current value of the range. */
    value: number;
}

export type TsRangeChangeEvent = CustomEvent<TsRangeChangeDetail>;

/** Emitted by ts-range on every input interaction (while dragging). Same detail as ts-change. */
export type TsRangeInputEvent = CustomEvent<TsRangeChangeDetail>;
