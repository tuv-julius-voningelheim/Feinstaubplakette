import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsSelectEvent } from '@utils/events/ts-select.js';

import { TsMenu as Menu } from '@components/menu/index.js';

export const TsMenu = createComponent({
    tagName: 'ts-menu',
    elementClass: Menu,
    react: React,
    events: {
        onTsSelect: 'ts-select' as EventName<TsSelectEvent>,
    },
});
