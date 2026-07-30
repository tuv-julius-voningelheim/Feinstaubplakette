import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';

import { TsRadioButton as RadioButton } from '@components/radio-button/index.js';

export const TsRadioButton = createComponent({
    tagName: 'ts-radio-button',
    elementClass: RadioButton,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
    },
});
