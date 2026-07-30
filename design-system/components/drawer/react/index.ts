import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsAfterHideEvent } from '@utils/events/ts-after-hide.js';
import type { TsAfterShowEvent } from '@utils/events/ts-after-show.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsInitialFocusEvent } from '@utils/events/ts-initial-focus.js';
import type { TsRequestCloseEvent } from '@utils/events/ts-request-close.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import { TsDrawer as Drawer } from '@components/drawer/index.js';

export const TsDrawer = createComponent({
    tagName: 'ts-drawer',
    elementClass: Drawer,
    react: React,
    events: {
        onTsShow: 'ts-show' as EventName<TsShowEvent>,
        onTsAfterShow: 'ts-after-show' as EventName<TsAfterShowEvent>,
        onTsHide: 'ts-hide' as EventName<TsHideEvent>,
        onTsAfterHide: 'ts-after-hide' as EventName<TsAfterHideEvent>,
        onTsInitialFocus: 'ts-initial-focus' as EventName<TsInitialFocusEvent>,
        onTsRequestClose: 'ts-request-close' as EventName<TsRequestCloseEvent>,
    },
});
