import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsRepositionEvent } from '@utils/events/ts-reposition.js';

import { TsSplitPanel as SplitPanel } from '@components/split-panel/index.js';

export const TsSplitPanel = createComponent({
    tagName: 'ts-split-panel',
    elementClass: SplitPanel,
    react: React,
    events: {
        onTsReposition: 'ts-reposition' as EventName<TsRepositionEvent>,
    },
});
