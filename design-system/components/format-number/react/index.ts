import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsFormatNumber as FormatNumber } from '@components/format-number/index.js';

export const TsFormatNumber = createComponent({
    tagName: 'ts-format-number',
    elementClass: FormatNumber,
    react: React,
    events: {},
});
