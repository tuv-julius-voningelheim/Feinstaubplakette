import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsPaginationItem as PaginationItem } from '@components/pagination-item/index.js';

export const TsPaginationItem = createComponent({
    tagName: 'ts-pagination-item',
    elementClass: PaginationItem,
    react: React,
    events: {
        onTsPageClick: 'ts-page-click',
    },
});
