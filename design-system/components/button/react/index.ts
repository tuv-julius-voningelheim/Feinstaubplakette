import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { TsButton as Button } from '@components/button/index.js';

export const TsButton = createComponent({
    tagName: 'ts-button',
    elementClass: Button,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
    },
});
