import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsErrorEvent } from '@utils/events/ts-error.js';
import type { TsLoadEvent } from '@utils/events/ts-load.js';

import { TsIcon as Icon } from '@components/icon/index.js';

export const TsIcon = createComponent({
    tagName: 'ts-icon',
    elementClass: Icon,
    react: React,
    events: {
        onTsLoad: 'ts-load' as EventName<TsLoadEvent>,
        onTsError: 'ts-error' as EventName<TsErrorEvent>,
    },
});
