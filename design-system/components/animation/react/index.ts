import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsCancelEvent } from '@utils/events/ts-cancel.js';
import type { TsFinishEvent } from '@utils/events/ts-finish.js';
import type { TsStartEvent } from '@utils/events/ts-start.js';

import { TsAnimation as Animation } from '@components/animation/index.js';

export const TsAnimation = createComponent({
    tagName: 'ts-animation',
    elementClass: Animation,
    react: React,
    events: {
        onTsCancel: 'ts-cancel' as EventName<TsCancelEvent>,
        onTsFinish: 'ts-finish' as EventName<TsFinishEvent>,
        onTsStart: 'ts-start' as EventName<TsStartEvent>,
    },
});
