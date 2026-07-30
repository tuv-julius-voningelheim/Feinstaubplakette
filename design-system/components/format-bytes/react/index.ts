import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsFormatBytes as FormatBytes } from '@components/format-bytes/index.js';

export const TsFormatBytes = createComponent({
    tagName: 'ts-format-bytes',
    elementClass: FormatBytes,
    react: React,
    events: {},
});
