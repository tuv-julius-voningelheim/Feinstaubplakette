import { safeDefine } from '@utils/helper/safe-define.js';

import TsDateCalendarRange from '@components/date-range/date-calendar-range/date-calendar-range.component.js';
import TsDateCalendarRangeMobile from '@components/date-range/date-calendar-range-mobile/date-calendar-range-mobile.component.js';
import TsDateDialogRangeComponent from '@components/date-range/date-dialog-range/date-dialog-range.component.js';
import TsDateDropdownRangeComponent from '@components/date-range/date-dropdown-range/date-dropdown-range.component.js';
import TsDateInputEnd from '@components/date-range/date-input-range/date-input-end.component.js';
import TsDateInputStart from '@components/date-range/date-input-range/date-input-start.component.js';
import TsDateShortcutComponent from '@components/date-range/date-shortcuts/date-shortcuts.component.js';
import { TsDateRange } from '@components/date-range/src/TsDateRange.js';

safeDefine('ts-date-range', TsDateRange);
safeDefine('ts-date-calendar-range', TsDateCalendarRange);
safeDefine('ts-date-calendar-range-mobile', TsDateCalendarRangeMobile);
safeDefine('ts-date-input-start', TsDateInputStart);
safeDefine('ts-date-input-end', TsDateInputEnd);
safeDefine('ts-date-dropdown-range', TsDateDropdownRangeComponent);
safeDefine('ts-date-dialog-range', TsDateDialogRangeComponent);
safeDefine('ts-date-shortcuts', TsDateShortcutComponent);

export {
    TsDateCalendarRange,
    TsDateDialogRangeComponent,
    TsDateDropdownRangeComponent,
    TsDateInputEnd,
    TsDateInputStart,
    TsDateRange,
    TsDateShortcutComponent,
};
