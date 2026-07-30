import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';

import { TsRadio as Radio } from '@components/radio/index.js';

export const TsRadio = createComponent({
    tagName: 'ts-radio',
    elementClass: Radio,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
    },
});
