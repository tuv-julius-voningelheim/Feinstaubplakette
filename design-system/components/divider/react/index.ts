import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsDivider as Divider } from '@components/divider/index.js';

export const TsDivider = createComponent({
    tagName: 'ts-divider',
    elementClass: Divider,
    react: React,
    events: {},
});
