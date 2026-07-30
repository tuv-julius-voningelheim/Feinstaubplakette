import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsCarouselItem as CarouselItem } from '@components/carousel-item/index.js';

export const TsCarouselItem = createComponent({
    tagName: 'ts-carousel-item',
    elementClass: CarouselItem,
    react: React,
    events: {},
});
