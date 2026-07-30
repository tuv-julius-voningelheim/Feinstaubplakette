import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsMutationEvent } from '@utils/events/ts-mutation.js';

import { TsMutationObserver as MutationObserver } from '@components/mutation-observer/index.js';

export const TsMutationObserver = createComponent({
    tagName: 'ts-mutation-observer',
    elementClass: MutationObserver,
    react: React,
    events: {
        onTsMutation: 'ts-mutation' as EventName<TsMutationEvent>,
    },
});
