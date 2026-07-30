import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsRelativeTime as RelativeTime } from '@components/relative-time/index.js';

export const TsRelativeTime = createComponent({
    tagName: 'ts-relative-time',
    elementClass: RelativeTime,
    react: React,
    events: {},
});
