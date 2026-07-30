import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsLink as Link } from '@components/link/index.js';

export const TsLink = createComponent({
    tagName: 'ts-link',
    elementClass: Link,
    react: React,
    events: {},
});
