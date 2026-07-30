import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsRemoveEvent } from '@utils/events/ts-remove.js';

import { TsTag as Tag } from '@components/tag/index.js';

export const TsTag = createComponent({
    tagName: 'ts-tag',
    elementClass: Tag,
    react: React,
    events: {
        onTsRemove: 'ts-remove' as EventName<TsRemoveEvent>,
    },
});
