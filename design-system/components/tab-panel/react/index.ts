import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsTabPanel as TabPanel } from '@components/tab-panel/index.js';

export const TsTabPanel = createComponent({
    tagName: 'ts-tab-panel',
    elementClass: TabPanel,
    react: React,
    events: {},
});
