import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsAfterCollapseEvent } from '@utils/events/ts-after-collapse.js';
import type { TsAfterExpandEvent } from '@utils/events/ts-after-expand.js';
import type { TsCollapseEvent } from '@utils/events/ts-collapse.js';
import type { TsExpandEvent } from '@utils/events/ts-expand.js';
import type { TsLazyChangeEvent } from '@utils/events/ts-lazy-change.js';
import type { TsLazyLoadEvent } from '@utils/events/ts-lazy-load.js';

import { TsTreeItem as TreeItem } from '@components/tree-item/index.js';

export const TsTreeItem = createComponent({
    tagName: 'ts-tree-item',
    elementClass: TreeItem,
    react: React,
    events: {
        onTsExpand: 'ts-expand' as EventName<TsExpandEvent>,
        onTsAfterExpand: 'ts-after-expand' as EventName<TsAfterExpandEvent>,
        onTsCollapse: 'ts-collapse' as EventName<TsCollapseEvent>,
        onTsAfterCollapse: 'ts-after-collapse' as EventName<TsAfterCollapseEvent>,
        onTsLazyChange: 'ts-lazy-change' as EventName<TsLazyChangeEvent>,
        onTsLazyLoad: 'ts-lazy-load' as EventName<TsLazyLoadEvent>,
    },
});
