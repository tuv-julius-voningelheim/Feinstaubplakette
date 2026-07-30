import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsRow as Row } from '@components/table/row/index.js';

export const TsRow = createComponent({
    tagName: 'ts-row',
    elementClass: Row,
    react: React,
    events: {},
});
