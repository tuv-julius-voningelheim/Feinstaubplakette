import { html, nothing } from 'lit';

import type {
    TsTableColumnDef,
    TsTablePageChangeEvent,
    TsTablePageSizeChangeEvent,
    TsTableRowClickEvent,
    TsTableSearchChangeEvent,
    TsTableSortChangeEvent,
} from '@utils/events/events.js';

import type { TsTable } from '@components/table/index.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/icon';
import '@tuvsud/design-system/icon-button';
import '@tuvsud/design-system/badge';
import '@tuvsud/design-system/link';
import '@tuvsud/design-system/dropdown';
import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/divider';
import '@tuvsud/design-system/table';
import '@tuvsud/design-system/table/table-footer';
import '@tuvsud/design-system/table/table-header';

const NAMES = ['Ada Lovelace', 'Alan Turing', 'Linus Torvalds', 'Grace Hopper', 'Tim Berners-Lee'];
const ROLES = ['Engineer', 'Designer', 'Manager', 'Analyst'];
const STATUSES = ['Active', 'Pending', 'Inactive'];

const SAMPLE_DATA = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length] as string,
    email: `user${i + 1}@example.com`,
    role: ROLES[i % ROLES.length] as string,
    status: STATUSES[i % STATUSES.length] as string,
    salary: 40000 + ((i * 1337) % 80000),
}));

const SIMPLE_COLUMNS: TsTableColumnDef[] = [
    { field: 'id', label: '#', width: '70px', align: 'center' },
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
    { field: 'status', label: 'Status' },
];

const SORTABLE_COLUMNS: TsTableColumnDef[] = [
    { field: 'id', label: '#', sortable: true, width: '70px', align: 'center' },
    { field: 'name', label: 'Name', sortable: true },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'role', label: 'Role', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'salary', label: 'Salary', sortable: true, align: 'right' },
];

const FIXED_COLUMNS: TsTableColumnDef[] = [
    { field: 'id', label: '#', width: '70px', fixed: 'left', align: 'center' },
    { field: 'name', label: 'Name', width: '220px' },
    { field: 'email', label: 'Email', width: '240px' },
    { field: 'role', label: 'Role', width: '140px' },
    { field: 'status', label: 'Status', width: '120px' },
    {
        field: 'salary',
        label: 'Salary',
        align: 'right',
        width: '140px',
        fixed: 'right',
        render: row => `$${(row['salary'] as number).toLocaleString()}`,
    },
];

type TsTableArgs = TsTable & {
    variant?: 'primary' | 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    striped?: boolean;
    bordered?: boolean;
    columnBorders?: boolean;
    hover?: boolean;
    clickable?: boolean;
    sortable?: boolean;
    stickyHeader?: boolean;
    maxHeight?: number;
    pageSize?: number;
    showHeader?: boolean;
    showFooter?: boolean;
    showSearch?: boolean;
    showPageSize?: boolean;
    showPagination?: boolean;
    locale?: string;
    loading?: boolean;
    skeleton?: boolean;
    skeletonRows?: number;
    'ts-table-sort-change'?: unknown;
    'ts-table-page-change'?: unknown;
    'ts-table-page-size-change'?: unknown;
    'ts-table-search-change'?: unknown;
    'ts-table-row-click'?: unknown;
};

const meta = {
    title: 'Components/Table/Data Table',
    component: 'ts-table',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `Set \`columns\` and \`data\` as **properties** (or via your framework's property binding). They cannot be set as HTML attributes because objects/arrays can't be serialized as attribute strings.
`,
            },
        },
    },
    argTypes: {
        locale: {
            control: { type: 'select' },
            options: ['en', 'de', 'fr', 'es', 'it', 'zh', 'ru', 'tr', 'da'],
            description: 'BCP 47 locale for built-in UI strings.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'en' }, category: 'Properties' },
        },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'light', 'dark'],
            description: 'Header color variant.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'primary' }, category: 'Properties' },
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: 'Row height.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        striped: {
            control: 'boolean',
            description: 'Alternate row background.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        bordered: {
            control: 'boolean',
            description: 'Draw a border around the table.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        columnBorders: {
            control: 'boolean',
            description: 'Draw vertical borders between each column.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        hover: {
            control: 'boolean',
            description: 'Highlight rows on hover.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        clickable: {
            control: 'boolean',
            description: 'Make body rows selectable — emits `ts-table-row-click`.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        sortable: {
            control: 'boolean',
            description: 'Enable sorting on ALL columns at once.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        stickyHeader: {
            control: 'boolean',
            description: 'Stick the header row to the top while scrolling.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        maxHeight: {
            control: { type: 'number', min: 0 },
            description: 'Maximum visible height (px) before vertical scrolling kicks in.',
            table: { type: { summary: 'number' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'Show a centered `ts-spinner` overlay and disable all interaction.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        skeleton: {
            control: 'boolean',
            description: 'Replace body rows with animated `ts-skeleton` placeholder rows.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        skeletonRows: {
            control: { type: 'number', min: 1 },
            description: 'Number of skeleton rows when `skeleton` is `true`. Defaults to `page-size`.',
            table: { type: { summary: 'number' }, category: 'Properties' },
        },
        pageSize: {
            control: { type: 'number', min: 1 },
            description: 'Number of rows per page.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '10' }, category: 'Properties' },
        },
        showHeader: {
            control: 'boolean',
            description: 'Show the top bar (items-per-page + search).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        showFooter: {
            control: 'boolean',
            description: 'Show the bottom bar (entries info + pagination).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        showSearch: {
            control: 'boolean',
            description: 'Show the search input in the top bar (requires `show-header`).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        showPageSize: {
            control: 'boolean',
            description: 'Show the items-per-page selector in the top bar (requires `show-header`).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
        showPagination: {
            control: 'boolean',
            description: 'Show the pagination control in the bottom bar (requires `show-footer`).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },

        'ts-table-row-click': {
            action: 'ts-table-row-click',
            description: 'Emitted when a body row is clicked (requires `clickable`).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-table-sort-change': {
            action: 'ts-table-sort-change',
            description: 'Emitted when a sortable column header is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-table-page-change': {
            action: 'ts-table-page-change',
            description: 'Emitted when the current page changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-table-page-size-change': {
            action: 'ts-table-page-size-change',
            description: 'Emitted when the items-per-page selector changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-table-search-change': {
            action: 'ts-table-search-change',
            description: 'Emitted (debounced) when the search input changes.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        locale: 'en',
        variant: 'primary' as const,
        size: 'medium' as const,
        striped: false,
        bordered: true,
        columnBorders: false,
        hover: true,
        clickable: false,
        sortable: false,
        stickyHeader: true,
        maxHeight: undefined,
        pageSize: 10,
        showHeader: false,
        showFooter: false,
        showSearch: true,
        showPageSize: true,
        showPagination: true,
        loading: false,
        skeleton: false,
        skeletonRows: undefined,
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || nothing}
            size=${args.size || nothing}
            ?striped=${args.striped}
            .bordered=${args.bordered ?? true}
            ?hover=${args.hover}
            ?clickable=${args.clickable}
            ?sortable=${args.sortable}
            ?sticky-header=${args.stickyHeader}
            max-height=${args.maxHeight ?? nothing}
            ?column-borders=${args.columnBorders}
            page-size=${args.pageSize ?? 10}
            locale=${args.locale || nothing}
            .showHeader=${args.showHeader ?? false}
            .showFooter=${args.showFooter ?? false}
            .showSearch=${args.showSearch ?? true}
            .showPageSize=${args.showPageSize ?? true}
            .showPagination=${args.showPagination ?? true}
            ?loading=${args.loading}
            ?skeleton=${args.skeleton}
            skeleton-rows=${args.skeletonRows ?? nothing}
            .columns=${SIMPLE_COLUMNS}
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
} satisfies MetaWithLabel<TsTableArgs>;

export default meta;
type Story = StoryObjWithLabel<TsTableArgs>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A basic data table. Pass `columns` and `data` to render rows automatically.',
            },
        },
    },
};

export const HeaderAndFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Enable `show-header` and `show-footer` to display the top bar (items-per-page + search) and the bottom bar (entries info + pagination).',
            },
        },
    },
    args: { showHeader: true, showFooter: true, showSearch: true, showPageSize: true, showPagination: true },
};

export const Striped: Story = {
    parameters: {
        docs: { description: { story: 'Use `striped` to add alternating row backgrounds for easier scanning.' } },
    },
    args: { striped: true, hover: false },
};

export const ColumnBorders: Story = {
    parameters: {
        docs: { description: { story: 'Use `column-borders` to render a vertical divider between every column.' } },
    },
    args: { columnBorders: true },
};

export const Clickable: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use `clickable` to make body rows interactive. Keyboard navigation (↑ ↓ Home End Enter/Space) is fully supported.',
            },
        },
    },
    args: { clickable: true, hover: true },
};

export const SortableAll: Story = {
    parameters: {
        docs: { description: { story: 'Use the `sortable` property to enable sorting on every column at once.' } },
    },
    args: { sortable: true },
};

export const SortablePerColumn: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set `sortable: true` on individual `TsTableColumnDef` entries to enable sorting only on specific columns.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            .columns=${
                [
                    { field: 'id', label: '#', width: '70px', align: 'center' },
                    { field: 'name', label: 'Name', sortable: true },
                    { field: 'email', label: 'Email' },
                    { field: 'role', label: 'Role', sortable: true },
                    { field: 'status', label: 'Status' },
                ] satisfies TsTableColumnDef[]
            }
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
};

export const FixedColumns: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set `fixed: "left"` or `fixed: "right"` on a column definition to pin it while the table scrolls horizontally.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table header-variant=${args.variant || 'primary'} .columns=${FIXED_COLUMNS} .data=${SAMPLE_DATA}></ts-table>
    `,
};

export const ResizableColumns: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Set `resizable: true` on a column to allow users to drag its right edge to adjust the width at runtime.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            show-header
            show-footer
            .columns=${SORTABLE_COLUMNS.map(c => ({ ...c, resizable: true }))}
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
};

export const CustomCell: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `render` function in a `TsTableColumnDef` to customize how a cell is displayed — e.g. `ts-badge` status indicators with `pulse`, formatted numbers, or any Lit `TemplateResult`.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            .columns=${
                [
                    { field: 'id', label: '#', width: '70px', align: 'center' },
                    { field: 'name', label: 'Name' },
                    { field: 'email', label: 'Email' },
                    {
                        field: 'status',
                        label: 'Status',
                        render: (row: Record<string, unknown>) => {
                            const status = row['status'] as string;
                            const variant =
                                status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'neutral';
                            return html`<ts-badge variant=${variant} pill ?pulse=${status === 'Active'} size="small"
                                >${status}</ts-badge
                            >`;
                        },
                    },
                    {
                        field: 'salary',
                        label: 'Salary',
                        align: 'right',
                        render: (row: Record<string, unknown>) => `$${(row['salary'] as number).toLocaleString()}`,
                    },
                ] satisfies TsTableColumnDef[]
            }
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
};

export const LinksInCells: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `render` function to return `ts-link` elements for clickable links in cells. Remember to set `href` and use `variant="primary"` or `variant="secondary"` for best accessibility.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            ?hover=${args.hover ?? true}
            .bordered=${args.bordered ?? true}
            .columns=${
                [
                    { field: 'id', label: '#', width: '70px', align: 'center' },
                    {
                        field: 'name',
                        label: 'Name',
                        render: (row: Record<string, unknown>) => html`
                            <ts-link href=${`/users/${row['id'] as number}`} variant="primary"
                                >${row['name'] as string}</ts-link
                            >
                        `,
                    },
                    {
                        field: 'email',
                        label: 'Email',
                        render: (row: Record<string, unknown>) => html`
                            <ts-link href=${`mailto:${row['email'] as string}`} variant="secondary"
                                >${row['email'] as string}</ts-link
                            >
                        `,
                    },
                    { field: 'role', label: 'Role' },
                    {
                        field: 'status',
                        label: 'Status',
                        render: (row: Record<string, unknown>) => {
                            const status = row['status'] as string;
                            const variant =
                                status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'neutral';
                            return html`<ts-badge variant=${variant} pill size="small" ?pulse=${status === 'Active'}
                                >${status}</ts-badge
                            >`;
                        },
                    },
                ] satisfies TsTableColumnDef[]
            }
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
};

export const CustomHeaderCell: Story = {
    parameters: {
        docs: {
            description: {
                story: `Use **\`renderHeader\`** on a column definition to replace the plain text label with any custom content — an icon, a badge, or any Lit \`TemplateResult\`. Sorting and resize handles are still rendered automatically.`,
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            ?hover=${args.hover ?? true}
            .bordered=${args.bordered ?? true}
            sortable
            .columns=${
                [
                    { field: 'id', label: '#', width: '70px', align: 'center' },
                    {
                        field: 'name',
                        label: 'Name',
                        renderHeader: () => html`
                            <span style="display:inline-flex;align-items:center;gap:6px;">
                                <ts-icon size="14" style="--icon-color: currentColor"
                                    ><img src="/assets/svg/person.svg" alt=""
                                /></ts-icon>
                                Name
                            </span>
                        `,
                    },
                    {
                        field: 'status',
                        label: 'Status',
                        renderHeader: () => html`
                            <span style="display:inline-flex;align-items:center;gap:6px;">
                                Status
                                <ts-badge variant="neutral" size="small" pill>live</ts-badge>
                            </span>
                        `,
                        render: (row: Record<string, unknown>) => {
                            const status = row['status'] as string;
                            const variant =
                                status === 'Active' ? 'success' : status === 'Pending' ? 'warning' : 'neutral';
                            return html`<ts-badge variant=${variant} pill size="small" ?pulse=${status === 'Active'}
                                >${status}</ts-badge
                            >`;
                        },
                    },
                    {
                        field: 'salary',
                        label: 'Salary',
                        align: 'right',
                        renderHeader: () => html`
                            <span style="display:inline-flex;align-items:center;gap:6px;">
                                <ts-icon size="14" style="--icon-color: currentColor"
                                    ><img src="/assets/svg/credit_card.svg" alt=""
                                /></ts-icon>
                                Salary (USD)
                            </span>
                        `,
                        render: (row: Record<string, unknown>) => `$${(row['salary'] as number).toLocaleString()}`,
                    },
                ] satisfies TsTableColumnDef[]
            }
            .data=${SAMPLE_DATA}
        ></ts-table>
    `,
};

export const RowActionsInline: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use a custom `render` function to add action buttons directly in cells. Remember to call `e.stopPropagation()` in the click handler to prevent the row click event from firing when interacting with buttons.',
            },
        },
    },
    render: (args: TsTableArgs) => {
        const handleEdit = (row: Record<string, unknown>) =>
            alert(`Edit #${row['id'] as number}: ${row['name'] as string}`);
        const handleDelete = (row: Record<string, unknown>) =>
            alert(`Delete #${row['id'] as number}: ${row['name'] as string}`);
        return html`
            <ts-table
                header-variant=${args.variant || 'primary'}
                ?hover=${args.hover ?? true}
                .bordered=${args.bordered ?? true}
                ?clickable=${args.clickable}
                .columns=${
                    [
                        ...SIMPLE_COLUMNS,
                        {
                            field: 'actions',
                            label: 'Actions',
                            width: '110px',
                            align: 'center',
                            render: (row: Record<string, unknown>) => html`
                                <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
                                    <ts-icon-button
                                        label="Edit row"
                                        size="20"
                                        variant="subtle"
                                        intent="default"
                                        @click=${(e: MouseEvent) => {
                                            e.stopPropagation();
                                            handleEdit(row);
                                        }}
                                    >
                                        <img src="/assets/svg/save.svg" alt="edit" />
                                    </ts-icon-button>
                                    <ts-icon-button
                                        label="Delete row"
                                        size="20"
                                        variant="subtle"
                                        intent="danger"
                                        @click=${(e: MouseEvent) => {
                                            e.stopPropagation();
                                            handleDelete(row);
                                        }}
                                    >
                                        <img src="/assets/svg/delete_forever.svg" alt="delete" />
                                    </ts-icon-button>
                                </div>
                            `,
                        },
                    ] satisfies TsTableColumnDef[]
                }
                .data=${SAMPLE_DATA}
            ></ts-table>
        `;
    },
};

export const RowActionsDropdown: Story = {
    parameters: {
        docs: {
            description: {
                story: 'For multiple actions, a dropdown can help reduce visual clutter. Use `ts-dropdown` with the `hoist` attribute to ensure the menu is not cut off by overflow:hidden on the table container. Always call `e.stopPropagation()` in the click handler to prevent the row click event from firing when interacting with the dropdown.',
            },
        },
    },
    render: (args: TsTableArgs) => {
        const handleAction = (action: string, row: Record<string, unknown>) =>
            alert(`"${action}" on #${row['id'] as number}: ${row['name'] as string}`);
        return html`
            <ts-table
                header-variant=${args.variant || 'primary'}
                ?hover=${args.hover ?? true}
                .bordered=${args.bordered ?? true}
                ?clickable=${args.clickable}
                .columns=${
                    [
                        ...SIMPLE_COLUMNS,
                        {
                            field: 'actions',
                            label: '',
                            width: '56px',
                            align: 'center',
                            render: (row: Record<string, unknown>) => html`
                                <ts-dropdown
                                    placement="bottom-end"
                                    hoist
                                    @click=${(e: MouseEvent) => e.stopPropagation()}
                                >
                                    <ts-icon-button
                                        slot="trigger"
                                        label="More actions"
                                        size="20"
                                        variant="subtle"
                                        intent="default"
                                    >
                                        <img src="/assets/svg/more_horiz.svg" alt="more" />
                                    </ts-icon-button>
                                    <ts-menu
                                        @ts-select=${(e: CustomEvent<{ item: { value: string } }>) =>
                                            handleAction(e.detail.item.value, row)}
                                    >
                                        <ts-menu-item value="edit">
                                            <ts-icon slot="prefix"><img src="/assets/svg/save.svg" alt="" /></ts-icon>
                                            Edit
                                        </ts-menu-item>
                                        <ts-menu-item value="duplicate">
                                            <ts-icon slot="prefix"
                                                ><img src="/assets/svg/folder_copy.svg" alt=""
                                            /></ts-icon>
                                            Duplicate
                                        </ts-menu-item>
                                        <ts-divider></ts-divider>
                                        <ts-menu-item value="delete">
                                            <ts-icon slot="prefix"
                                                ><img src="/assets/svg/delete_forever.svg" alt=""
                                            /></ts-icon>
                                            Delete
                                        </ts-menu-item>
                                    </ts-menu>
                                </ts-dropdown>
                            `,
                        },
                    ] satisfies TsTableColumnDef[]
                }
                .data=${SAMPLE_DATA}
            ></ts-table>
        `;
    },
};

export const CustomHeaderFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: `Use the \`header\` and \`footer\` named slots to replace the built-in toolbar and pagination bar. When either slot has content the built-in bar is hidden automatically.`,
            },
        },
    },
    render: (args: TsTableArgs) => {
        const today = new Date().toLocaleDateString();
        return html`
            <ts-table
                header-variant=${args.variant || nothing}
                size=${args.size || nothing}
                ?striped=${args.striped}
                .bordered=${args.bordered ?? true}
                ?hover=${args.hover}
                .columns=${SIMPLE_COLUMNS}
                .data=${SAMPLE_DATA}
            >
                <div
                    slot="header"
                    style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;gap:12px;background:var(--ts-semantic-color-background-neutral-subtle-default,#f8f9fa);border-bottom:1px solid var(--ts-semantic-color-border-base-default,#dee2e6);"
                >
                    <strong style="font-size:1rem;">👥 Team Members</strong>
                    <span style="color:var(--ts-semantic-color-text-base-default,#6c757d);font-size:0.875rem;"
                        >${SAMPLE_DATA.length} entries</span
                    >
                </div>
                <div
                    slot="footer"
                    style="display:flex;align-items:center;justify-content:flex-end;padding:10px 16px;gap:8px;background:var(--ts-semantic-color-background-neutral-subtle-default,#f8f9fa);border-top:1px solid var(--ts-semantic-color-border-base-default,#dee2e6);"
                >
                    <span style="font-size:0.875rem;color:var(--ts-semantic-color-text-base-default,#6c757d);"
                        >Last updated: ${today}</span
                    >
                </div>
            </ts-table>
        `;
    },
};

export const EmptyState: Story = {
    parameters: {
        docs: {
            description: {
                story: 'When `data` is an empty array the table renders a centred empty-state message. Customise it with the `empty-text` property.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            empty-text="No results found"
            .columns=${SIMPLE_COLUMNS}
            .data=${[]}
        ></ts-table>
    `,
};

export const CustomEmptyState: Story = {
    parameters: {
        docs: {
            description: {
                story: `Use the \`empty\` named slot to replace the built-in empty-state block with your own markup. Shown automatically when \`data\` is an empty array.`,
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table header-variant=${args.variant || 'primary'} .columns=${SIMPLE_COLUMNS} .data=${[]}>
            <div
                slot="empty"
                style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 24px;text-align:center;"
            >
                <ts-icon size="60" style="--icon-color: var(--ts-semantic-color-background-neutral-subtle-active)">
                    <img src="/assets/svg/document_search.svg" alt="icon" />
                </ts-icon>
                <p style="margin:0;font-size:1rem;font-weight:600;">No records found</p>
                <p style="margin:0;font-size:0.875rem;color:var(--ts-semantic-color-text-neutral-default,#6b7280);">
                    Try adjusting your search or filters.
                </p>
            </div>
        </ts-table>
    `,
};

export const Loading: Story = {
    parameters: {
        docs: {
            description: {
                story: `Set \`loading\` to \`true\` to show a centered \`ts-spinner\` overlay and disable all interaction (pointer + keyboard).`,
            },
        },
    },
    args: { loading: true, showHeader: true, showFooter: true, hover: true },
};

export const Skeleton: Story = {
    parameters: {
        docs: {
            description: {
                story: `Set \`skeleton\` to \`true\` to replace body rows with animated sheen placeholder rows. The header is still rendered so the layout doesn't shift. Use \`skeleton-rows\` to control row count (defaults to \`page-size\`).`,
            },
        },
    },
    args: { skeleton: true, showHeader: true, showFooter: false },
};

export const EventLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'table-event-log',
            entries: [
                {
                    event: 'ts-table-row-click',
                    firedWhen: 'A body row is clicked (requires clickable)',
                    detail: '{ row, rowIndex }',
                },
                {
                    event: 'ts-table-sort-change',
                    firedWhen: 'A sortable column header is clicked',
                    detail: '{ field, direction }',
                },
                { event: 'ts-table-page-change', firedWhen: 'The current page changes', detail: '{ page }' },
                {
                    event: 'ts-table-page-size-change',
                    firedWhen: 'The items-per-page selector changes',
                    detail: '{ pageSize }',
                },
                {
                    event: 'ts-table-search-change',
                    firedWhen: 'The search input changes (debounced)',
                    detail: '{ query }',
                },
            ],
        });
        return {
            parameters,
            render: () =>
                wrap(html`
                    <ts-table
                        header-variant="primary"
                        clickable
                        show-header
                        show-footer
                        .columns=${SORTABLE_COLUMNS}
                        .data=${SAMPLE_DATA}
                        @ts-table-row-click=${(e: TsTableRowClickEvent) => log('ts-table-row-click', e.detail)}
                        @ts-table-sort-change=${(e: TsTableSortChangeEvent) => log('ts-table-sort-change', e.detail)}
                        @ts-table-page-change=${(e: TsTablePageChangeEvent) => log('ts-table-page-change', e.detail)}
                        @ts-table-page-size-change=${(e: TsTablePageSizeChangeEvent) =>
                            log('ts-table-page-size-change', e.detail)}
                        @ts-table-search-change=${(e: TsTableSearchChangeEvent) =>
                            log('ts-table-search-change', e.detail)}
                    ></ts-table>
                `),
        };
    })(),
};
