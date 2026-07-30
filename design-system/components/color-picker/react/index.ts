import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsColorPickerChangeEvent, TsColorPickerInputEvent } from '@utils/events/ts-color-picker-change.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { TsColorPicker as ColorPicker } from '@components/color-picker/index.js';

export const TsColorPicker = createComponent({
    tagName: 'ts-color-picker',
    elementClass: ColorPicker,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsChange: 'ts-change' as EventName<TsColorPickerChangeEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
        onTsInput: 'ts-input' as EventName<TsColorPickerInputEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
    },
});
