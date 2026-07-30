import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsSpinner as Spinner } from '@components/spinner/index.js';

export const TsSpinner = createComponent({
    tagName: 'ts-spinner',
    elementClass: Spinner,
    react: React,
    events: {},
});
