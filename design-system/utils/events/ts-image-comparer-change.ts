export interface TsImageComparerChangeDetail {
    /** The current divider position as a percentage (0–100). */
    position: number;
}

export type TsImageComparerChangeEvent = CustomEvent<TsImageComparerChangeDetail>;
