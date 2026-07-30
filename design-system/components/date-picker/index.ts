import { safeDefine } from '@utils/helper/safe-define.js';

import TsDateCalendar from '@components/date-picker/date-calendar/date-calendar.component.js';
import TsDateDialogComponent from '@components/date-picker/date-dialog/date-dialog.component.js';
import TsDateDropdownComponent from '@components/date-picker/date-dropdown/date-dropdown.component.js';
import TsDateInput from '@components/date-picker/date-input/date-input.component.js';
import { TsDatePicker } from '@components/date-picker/src/TsDatePicker.js';

safeDefine('ts-date-picker', TsDatePicker);
safeDefine('ts-date-calendar', TsDateCalendar);
safeDefine('ts-date-input', TsDateInput);
safeDefine('ts-date-dropdown', TsDateDropdownComponent);
safeDefine('ts-date-dialog', TsDateDialogComponent);

export { TsDateCalendar, TsDateInput, TsDatePicker };
