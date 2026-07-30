export interface TsStepperStepDetail {
    /** The new active step index (0-based). */
    index: number;
    /** The previously active step index (0-based). */
    previousIndex?: number;
}

export type TsNextStepEvent = CustomEvent<TsStepperStepDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-next-step': TsNextStepEvent;
    }
}
