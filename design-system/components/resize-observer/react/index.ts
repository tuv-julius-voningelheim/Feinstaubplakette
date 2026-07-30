import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsResizeEvent } from '@utils/events/ts-resize.js';

import { TsResizeObserver as ResizeObserver } from '@components/resize-observer/index.js';

export const TsResizeObserver = createComponent({
    tagName: 'ts-resize-observer',
    elementClass: ResizeObserver,
    react: React,
    events: {
        onTsResize: 'ts-resize' as EventName<TsResizeEvent>,
    },
});
