import { createComponent } from '@lit/react';
import { type EventName } from '@lit/react';
import * as React from 'react';

import type { TsClickNextEvent } from '@utils/events/ts-click-next.js';
import type { TsClickPreviousEvent } from '@utils/events/ts-click-previous.js';
import type { TsSlideChangeEvent } from '@utils/events/ts-slide-change.js';

import { TsCarousel as Carousel } from '@components/carousel/index.js';

export const TsCarousel = createComponent({
    tagName: 'ts-carousel',
    elementClass: Carousel,
    react: React,
    events: {
        onTsSlideChange: 'ts-slide-change' as EventName<TsSlideChangeEvent>,
        onTsClickNext: 'ts-click-next' as EventName<TsClickNextEvent>,
        onTsClickPrevious: 'ts-click-previous' as EventName<TsClickPreviousEvent>,
    },
});
