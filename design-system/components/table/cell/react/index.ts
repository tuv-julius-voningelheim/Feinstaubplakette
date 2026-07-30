import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsCell as Cell } from '@components/table/cell/index.js';

export const TsCell = createComponent({
    tagName: 'ts-cell',
    elementClass: Cell,
    react: React,
    events: {},
});
