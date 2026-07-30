import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsButtonGroup as ButtonGroup } from '@components/button-group/index.js';

export const TsButtonGroup = createComponent({
    tagName: 'ts-button-group',
    elementClass: ButtonGroup,
    react: React,
    events: {},
});
