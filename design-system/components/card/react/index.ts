import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsCard as Card } from '@components/card/index.js';

export const TsCard = createComponent({
    tagName: 'ts-card',
    elementClass: Card,
    react: React,
    events: {},
});
