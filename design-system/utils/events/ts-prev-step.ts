import type { TsStepperStepDetail } from './ts-next-step.js';

export type TsPrevStepEvent = CustomEvent<TsStepperStepDetail>;

declare global {
    interface GlobalEventHandlersEventMap {
        'ts-prev-step': TsPrevStepEvent;
    }
}
