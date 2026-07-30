import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsPagination as Pagination } from '@components/pagination/index.js';

export const TsPagination = createComponent({
    tagName: 'ts-pagination',
    elementClass: Pagination,
    react: React,
    events: {
        onTsPageClick: 'ts-page-click',
        onTsPrevClick: 'ts-prev-click',
        onTsNextClick: 'ts-next-click',
    },
});
