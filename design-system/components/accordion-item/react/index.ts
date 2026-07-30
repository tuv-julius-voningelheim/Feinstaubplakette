import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsAfterHideEvent } from '@utils/events/ts-after-hide.js';
import type { TsAfterShowEvent } from '@utils/events/ts-after-show.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import { TsAccordionItem as AccordionItem } from '@components/accordion-item/index.js';

export const TsAccordionItem = createComponent({
    tagName: 'ts-accordion-item',
    elementClass: AccordionItem,
    react: React,
    events: {
        onTsShow: 'ts-show' as EventName<TsShowEvent>,
        onTsAfterShow: 'ts-after-show' as EventName<TsAfterShowEvent>,
        onTsHide: 'ts-hide' as EventName<TsHideEvent>,
        onTsAfterHide: 'ts-after-hide' as EventName<TsAfterHideEvent>,
    },
});
