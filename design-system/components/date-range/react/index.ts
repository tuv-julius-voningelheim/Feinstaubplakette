import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsDateChangeEvent } from '@utils/events/ts-date-change.js';
import type { TsDateRangeApplyEvent, TsDateRangeCancelEvent } from '@utils/events/ts-date-range.js';
import type { TsNextMonthClickEvent, TsPrevMonthClickEvent } from '@utils/events/ts-month-navigation.js';
import type { TsShortcutSelectEvent } from '@utils/events/ts-shortcut-select.js';

import { TsDateRange as DateRange } from '@components/date-range/index.js';

export const TsDateRange = createComponent({
    tagName: 'ts-date-range',
    elementClass: DateRange,
    react: React,
    events: {
        onTsDateChange: 'ts-date-change' as EventName<TsDateChangeEvent>,
        onTsDateApply: 'ts-date-apply' as EventName<TsDateRangeApplyEvent>,
        onTsDateCancel: 'ts-date-cancel' as EventName<TsDateRangeCancelEvent>,
        onTsDateBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsShortcutSelect: 'ts-shortcut-select' as EventName<TsShortcutSelectEvent>,
        onTsPrevMonthClick: 'ts-prev-month-click' as EventName<TsPrevMonthClickEvent>,
        onTsNextMonthClick: 'ts-next-month-click' as EventName<TsNextMonthClickEvent>,
    },
});
