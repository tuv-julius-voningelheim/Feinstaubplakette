import { createComponent } from '@lit/react';
import * as React from 'react';

import { TsTable as Table } from '@components/table/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableCtor = new (...args: any[]) => InstanceType<typeof Table> & HTMLElement;

export const TsTable = createComponent({
    tagName: 'ts-table',
    elementClass: Table as unknown as TableCtor,
    react: React,
    events: {
        onTsTableSortChange: 'ts-table-sort-change',
        onTsTablePageChange: 'ts-table-page-change',
        onTsTablePageSizeChange: 'ts-table-page-size-change',
        onTsTableSearchChange: 'ts-table-search-change',
    },
});
