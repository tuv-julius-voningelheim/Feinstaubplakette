import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsBadge as Badge } from '@components/badge/index.js';

export const TsBadge = createComponent({
    tagName: 'ts-badge',
    elementClass: Badge,
    react: React,
    events: {},
});
