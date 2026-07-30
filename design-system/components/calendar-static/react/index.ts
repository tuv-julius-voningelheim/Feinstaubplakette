import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';

import type { TsCalendarStaticSelectEvent } from '@utils/events/ts-calendar-static-select.js';
import type { TsDateApplyEvent } from '@utils/events/ts-date-apply.js';
import type { TsDateCancelEvent } from '@utils/events/ts-date-cancel.js';
import type { TsDateChangeMonth } from '@utils/events/ts-date-change-month.js';
import type { TsMonthChangeEvent } from '@utils/events/ts-month-change.js';
import type { TsYearChangeEvent } from '@utils/events/ts-year-change.js';

import { TsCalendarStatic as CalendarStatic } from '@components/calendar-static/index.js';

export const TsCalendarStatic = createComponent({
    tagName: 'ts-calendar-static',
    elementClass: CalendarStatic,
    react: React,
    events: {
        onTsDateChangeMonth: 'ts-date-change-month' as EventName<TsDateChangeMonth>,
        onTsDateSelect: 'ts-date-select' as EventName<TsCalendarStaticSelectEvent>,
        onTsDateApply: 'ts-date-apply' as EventName<TsDateApplyEvent>,
        onTsDateCancel: 'ts-date-cancel' as EventName<TsDateCancelEvent>,
        onTsYearChange: 'ts-year-change' as EventName<TsYearChangeEvent>,
        onTsMonthChange: 'ts-month-change' as EventName<TsMonthChangeEvent>,
    },
});
