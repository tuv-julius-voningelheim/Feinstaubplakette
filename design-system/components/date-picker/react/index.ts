import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';

import type { TsDateApplyEvent } from '@utils/events/ts-date-apply.js';
import type { TsDateCancelEvent } from '@utils/events/ts-date-cancel.js';
import type { TsDateChangeEvent } from '@utils/events/ts-date-change.js';
import type { TsDateChangeMonth } from '@utils/events/ts-date-change-month.js';
import type { TsDateChangeYearEvent } from '@utils/events/ts-date-change-year.js';
import type { TsDatePickerBlurEvent } from '@utils/events/ts-date-picker-blur.js';
import type { TsDateSelectEvent } from '@utils/events/ts-date-select.js';

import { TsDatePicker as DatePicker } from '@components/date-picker/index.js';

export const TsDatePicker = createComponent({
    tagName: 'ts-date-picker',
    elementClass: DatePicker,
    react: React,
    events: {
        onTsDateChange: 'ts-date-change' as EventName<TsDateChangeEvent>,
        onTsDateChangeMonth: 'ts-date-change-month' as EventName<TsDateChangeMonth>,
        onTsDateChangeYear: 'ts-date-change-year' as EventName<TsDateChangeYearEvent>,
        onTsDateBlur: 'ts-blur' as EventName<TsDatePickerBlurEvent>,
        onTsDateSelect: 'ts-date-select' as EventName<TsDateSelectEvent>,
        onTsDateApply: 'ts-date-apply' as EventName<TsDateApplyEvent>,
        onTsDateCancel: 'ts-date-cancel' as EventName<TsDateCancelEvent>,
    },
});
