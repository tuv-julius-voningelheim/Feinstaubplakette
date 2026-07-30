import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsFormatDate as FormatDate } from '@components/format-date/index.js';

export const TsFormatDate = createComponent({
    tagName: 'ts-format-date',
    elementClass: FormatDate,
    react: React,
    events: {},
});
