import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsSelectStepEvent } from '@utils/events/ts-select-step.js';

import { TsStep as Step } from '@components/step/index.js';

export const TsStep = createComponent({
    tagName: 'ts-step',
    elementClass: Step,
    react: React,
    events: {
        onTsSelectStep: 'ts-select-step' as EventName<TsSelectStepEvent>,
    },
});
