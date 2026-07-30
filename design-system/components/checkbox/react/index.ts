import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsCheckboxChangeEvent } from '@utils/events/ts-checkbox-change.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { TsCheckbox as Checkbox } from '../index.js';

export const TsCheckbox = createComponent({
    tagName: 'ts-checkbox',
    elementClass: Checkbox,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsChange: 'ts-change' as EventName<TsCheckboxChangeEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
        onTsInput: 'ts-input' as EventName<TsInputEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
    },
});
