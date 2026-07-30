import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsTableFooter as TableFooter } from '@components/table/table-footer/index.js';

export const TsTableFooter = createComponent({
    tagName: 'ts-table-footer',
    elementClass: TableFooter,
    react: React,
    events: {
        onTsPageClick: 'ts-page-click',
        onTsPrevClick: 'ts-prev-click',
        onTsNextClick: 'ts-next-click',
    },
});
