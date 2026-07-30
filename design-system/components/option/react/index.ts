import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsOption as Option } from '@components/option/index.js';

export const TsOption = createComponent({
    tagName: 'ts-option',
    elementClass: Option,
    react: React,
    events: {},
});
