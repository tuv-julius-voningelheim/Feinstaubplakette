import { html } from 'lit';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/pagination';
import '@tuvsud/design-system/table';
import '@tuvsud/design-system/table/table-footer';
import '@tuvsud/design-system/table/table-header';
import '@tuvsud/design-system/icon';

const meta = {
    title: 'Components/Table',
    component: 'ts-table',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
A full-featured data table with sorting, pagination, search, column resizing, fixed columns, sticky header and row selection.
It supports two rendering modes so you can pick the right trade-off between convenience and control.


## Rendering modes

The mode is chosen **automatically** based on what you pass to the component.

### 1 · Data Table mode *(recommended)*
Set \`columns\` and \`data\` as **properties** (or via your framework's property binding). They cannot be set as HTML attributes because objects/arrays can't be serialized as attribute strings.


\`\`\`tsx

// React
import { TsTable } from '@tuvsud/design-system/react';
import type { TsTableColumnDef } from '@tuvsud/design-system';

const columns: TsTableColumnDef[] = [
    { field: 'id', label: '#', width: '60px', align: 'right' },
    { field: 'name', label: 'Name', sortable: true },
    { field: 'email', label: 'Email' },
];

const data = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@x.io' },
    { id: 2, name: 'Linus Torvalds', email: 'linus@x.io' },
    { id: 3, name: 'Grace Hopper', email: 'grace@x.io' },
];

export default function UsersTable() {
    return <TsTable columns={columns} data={data} showHeader showFooter sortable hover striped pageSize={10}></TsTable>;
}
\`\`\`

Each column definition supports:

| Key | Type | Required | Description |
|---|---|---|---|
| \`field\` | \`string\` | ✅ | Key in the row object |
| \`label\` | \`string\` | - | Header text |
| \`sortable\` | \`boolean\` | - | Enable sort on this column |
| \`resizable\` | \`boolean\` | - | Drag-to-resize handle |
| \`width\` | \`string\` | - | Initial width e.g. \`"200px"\` |
| \`align\` | \`"left" \\| "center" \\| "right"\` | - | Cell text alignment |
| \`fixed\` | \`"left" \\| "right"\` | - | Pin column while scrolling horizontally |
| \`render\` | \`(row, index) => string \\| TemplateResult\` | - | Custom cell renderer |
| \`renderHeader\` | \`() => string \\| TemplateResult\` | - | Custom header cell renderer |

→ [Data Table examples](?path=/docs/components-table-data-table--docs)

### 2 · Native mode
Drop a plain \`<table>\` into the default slot. The component wraps it with scroll and sticky-header behaviour and injects the shared Design System styles into the document head — ideal for server-rendered or SEO-critical markup.

\`\`\`html
<ts-table>
  <table>
    <thead>…</thead>
    <tbody>…</tbody>
  </table>
</ts-table>
\`\`\`

→ [Native Table examples](?path=/docs/components-table-native-table--docs)

`,
            },
        },
    },
} satisfies MetaWithLabel<object>;

export default meta;
type Story = StoryObjWithLabel<object>;

export const Default: Story = {
    tags: ['!dev'],
    render: () => html`<div></div>`,
};
