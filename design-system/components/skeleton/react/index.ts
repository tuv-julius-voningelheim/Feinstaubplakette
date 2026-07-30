import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsSkeleton as Skeleton } from '@components/skeleton/index.js';

export const TsSkeleton = createComponent({
    tagName: 'ts-skeleton',
    elementClass: Skeleton,
    react: React,
    events: {},
});
