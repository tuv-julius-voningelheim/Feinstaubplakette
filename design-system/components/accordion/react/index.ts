import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsAccordion as Accordion } from '@components/accordion/index.js';

export const TsAccordion = createComponent({
    tagName: 'ts-accordion',
    elementClass: Accordion,
    react: React,
    events: {},
});
