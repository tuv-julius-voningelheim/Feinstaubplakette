import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsChangeEvent } from '@utils/events/ts-change.js';

import { TsImageComparer as ImageComparer } from '@components/image-comparer/index.js';

export const TsImageComparer = createComponent({
    tagName: 'ts-image-comparer',
    elementClass: ImageComparer,
    react: React,
    events: {
        onTsChange: 'ts-change' as EventName<TsChangeEvent>,
    },
});
