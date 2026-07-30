import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsAvatarGroup as AvatarGroup } from '@components/avatar-group/index.js';

export const TsAvatarGroup = createComponent({
    tagName: 'ts-avatar-group',
    elementClass: AvatarGroup,
    react: React,
    events: {},
});
