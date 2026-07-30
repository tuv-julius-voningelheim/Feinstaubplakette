import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsMenuItem as MenuItem } from '@components/menu-item/index.js';

export const TsMenuItem = createComponent({
    tagName: 'ts-menu-item',
    elementClass: MenuItem,
    react: React,
    events: {},
});
