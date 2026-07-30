import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsChangeEvent } from '@utils/events/ts-change.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { TsRadioGroup as RadioGroup } from '@components/radio-group/index.js';

export const TsRadioGroup = createComponent({
    tagName: 'ts-radio-group',
    elementClass: RadioGroup,
    react: React,
    events: {
        onTsChange: 'ts-change' as EventName<TsChangeEvent>,
        onTsInput: 'ts-input' as EventName<TsInputEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
    },
});
