import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsAfterHideEvent } from '@utils/events/ts-after-hide.js';
import type { TsAfterShowEvent } from '@utils/events/ts-after-show.js';
import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsChangeEvent } from '@utils/events/ts-change.js';
import type { TsClearEvent } from '@utils/events/ts-clear.js';
import type { TsComboboxFilterEvent } from '@utils/events/ts-combobox-filter.js';
import type { TsComboboxSelectEvent } from '@utils/events/ts-combobox-select.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsHideEvent } from '@utils/events/ts-hide.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';
import type { TsShowEvent } from '@utils/events/ts-show.js';

import { TsCombobox as Combobox } from '@components/combobox/index.js';

export const TsCombobox = createComponent({
    tagName: 'ts-combobox',
    elementClass: Combobox,
    react: React,
    events: {
        onTsChange: 'ts-change' as EventName<TsChangeEvent>,
        onTsClear: 'ts-clear' as EventName<TsClearEvent>,
        onTsInput: 'ts-input' as EventName<TsInputEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsShow: 'ts-show' as EventName<TsShowEvent>,
        onTsAfterShow: 'ts-after-show' as EventName<TsAfterShowEvent>,
        onTsHide: 'ts-hide' as EventName<TsHideEvent>,
        onTsAfterHide: 'ts-after-hide' as EventName<TsAfterHideEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
        onTsFilter: 'ts-combobox-filter' as EventName<TsComboboxFilterEvent>,
        onTsSelect: 'ts-combobox-select' as EventName<TsComboboxSelectEvent>,
    },
});
