import type { TsStepperStepDetail } from './ts-next-step.js';

export type TsSelectStepEvent = CustomEvent<TsStepperStepDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-select-step': TsSelectStepEvent;
    }
}
