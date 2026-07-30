import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsBlurEvent } from '@utils/events/ts-blur.js';
import type { TsChangeEvent } from '@utils/events/ts-change.js';
import type { TsFocusEvent } from '@utils/events/ts-focus.js';
import type { TsInputEvent } from '@utils/events/ts-input.js';
import type { TsInvalidEvent } from '@utils/events/ts-invalid.js';

import { TsDropzone as Dropzone } from '@components/dropzone/index.js';

export const TsDropzone = createComponent({
    tagName: 'ts-dropzone',
    elementClass: Dropzone,
    react: React,
    events: {
        onTsBlur: 'ts-blur' as EventName<TsBlurEvent>,
        onTsChange: 'ts-change' as EventName<TsChangeEvent>,
        onTsFocus: 'ts-focus' as EventName<TsFocusEvent>,
        onTsInput: 'ts-input' as EventName<TsInputEvent>,
        onTsInvalid: 'ts-invalid' as EventName<TsInvalidEvent>,
        onTsDrop: 'ts-drop' as EventName<CustomEvent>,
        onTsFileRemove: 'ts-file-remove' as EventName<CustomEvent>,
        onTsFileReject: 'ts-file-reject' as EventName<CustomEvent>,
    },
});
