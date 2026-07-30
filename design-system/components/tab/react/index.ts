import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsCloseEvent } from '@utils/events/ts-close.js';
import type { TsTabClickEvent } from '@utils/events/ts-tab-click.js';

import { TsTab as Tab } from '@components/tab/index.js';

export const TsTab = createComponent({
    tagName: 'ts-tab',
    elementClass: Tab,
    react: React,
    events: {
        onTsClose: 'ts-close' as EventName<TsCloseEvent>,
        onTsTabClick: 'ts-tab-click' as EventName<TsTabClickEvent>,
    },
});
