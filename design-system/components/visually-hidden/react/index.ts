import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsVisuallyHidden as VisuallyHidden } from '@components/visually-hidden/index.js';

export const TsVisuallyHidden = createComponent({
    tagName: 'ts-visually-hidden',
    elementClass: VisuallyHidden,
    react: React,
    events: {},
});
