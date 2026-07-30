import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsProgressRing as ProgressRing } from '@components/progress-ring/index.js';

export const TsProgressRing = createComponent({
    tagName: 'ts-progress-ring',
    elementClass: ProgressRing,
    react: React,
    events: {},
});
