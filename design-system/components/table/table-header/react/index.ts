import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsTableHeader as TableHeader } from '@components/table/table-header/index.js';

export const TsTableHeader = createComponent({
    tagName: 'ts-table-header',
    elementClass: TableHeader,
    react: React,
    events: {
        onTsTableSearchChange: 'ts-table-search-change',
        onTsTablePageSizeChange: 'ts-table-page-size-change',
    },
});
