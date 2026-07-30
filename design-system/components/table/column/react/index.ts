import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsColumn as Column } from '@components/table/column/index.js';

export const TsColumn = createComponent({
    tagName: 'ts-column',
    elementClass: Column,
    react: React,
    events: {
        onTsColumnSort: 'ts-column-sort',
        onTsColumnResize: 'ts-column-resize',
    },
});
