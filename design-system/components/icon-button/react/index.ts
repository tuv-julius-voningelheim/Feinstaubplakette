import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';

import { TsIconButton as IconButton } from '@components/icon-button/index.js';

export const TsIconButton = createComponent({
    tagName: 'ts-icon-button',
    elementClass: IconButton,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
    },
});
