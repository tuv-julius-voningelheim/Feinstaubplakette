import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsTabHideEvent } from '@utils/events/ts-tab-hide.js';
import type { TsTabShowEvent } from '@utils/events/ts-tab-show.js';

import { TsTabGroup as TabGroup } from '@components/tab-group/index.js';

export const TsTabGroup = createComponent({
    tagName: 'ts-tab-group',
    elementClass: TabGroup,
    react: React,
    events: {
        onTsTabShow: 'ts-tab-show' as EventName<TsTabShowEvent>,
        onTsTabHide: 'ts-tab-hide' as EventName<TsTabHideEvent>,
    },
});
