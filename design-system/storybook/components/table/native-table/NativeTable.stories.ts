import { html } from 'lit';

import type { TsTable } from '@components/table/index.js';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/table';

type TsTableArgs = TsTable & {
    variant?: 'primary' | 'light' | 'dark';
    size?: 'small' | 'medium' | 'large';
    striped?: boolean;
    bordered?: boolean;
    hover?: boolean;
    clickable?: boolean;
    stickyHeader?: boolean;
    maxHeight?: number;
    loading?: boolean;
    'ts-table-row-click'?: unknown;
};

const meta = {
    title: 'Components/Table/NativeTable',
    component: 'ts-table',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `**Native HTML Table mode** — SEO-friendly, light-DOM markup.

Slot a real \`<table>\` element directly inside \`<ts-table>\`. The markup stays in **light DOM** so search engines can index it and SSR frameworks can hydrate it without a shadow-DOM boundary.

\`\`\`html
<ts-table hover bordered>
  <table>
    <caption>Quarterly sales</caption>
    <thead>
      <tr><th scope="col">Product</th><th scope="col">Q1</th></tr>
    </thead>
    <tbody>
      <tr><td>Keyboard</td><td>$1,200</td></tr>
    </tbody>
  </table>
</ts-table>
\`\`\`

> **Most built-in features are unavailable** in this mode.  
> Search, sort, and pagination must be implemented by you.  
> Use the \`header\` / \`footer\` named slots for custom toolbars.

### CSS utility classes (light-DOM styling)

Because native mode renders in light DOM, shadow CSS cannot reach your \`<table>\`. The component injects a global stylesheet with utility classes you can apply:

| Class | Effect |
|---|---|
| \`ts-align-right\` | Right-align cell text — sets \`text-align: right\` on a \`<th>\` or \`<td>\` |
| \`ts-align-center\` | Centre-align cell text — sets \`text-align: center\` on a \`<th>\` or \`<td>\` |
| \`ts-fixed-left\` | Pin column to the left edge — makes a \`<th>\` / \`<td>\` sticky with \`position: sticky; left: 0\` and adds a subtle right-side shadow separator |
| \`ts-fixed-right\` | Pin column to the right edge — makes a \`<th>\` / \`<td>\` sticky with \`position: sticky; right: 0\` and adds a subtle left-side shadow separator |
| \`ts-table-selected\` | Mark a \`<tr>\` as selected — highlights the row with the primary-subtle background colour (\`--ts-table-row-selected-bg\`). Only takes effect when the \`clickable\` attribute is set on \`<ts-table>\` |

→ Back to [Table overview](?path=/docs/components-table--docs)`,
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'light', 'dark'],
            description: 'Header color variant.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'primary' }, category: 'Properties' },
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: 'Row height: `small` = 32px, `medium` = 40px, `large` = 48px.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'medium' }, category: 'Properties' },
        },
        striped: {
            control: 'boolean',
            description: 'Alternate row background (zebra).',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        bordered: {
            control: 'boolean',
            description: 'Draw a border around the table.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
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
        'ts-table-row-click': {
            action: 'ts-table-row-click',
            description: 'Emitted when a body row is clicked (requires `clickable`).',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        variant: 'primary' as const,
        size: 'medium' as const,
        striped: false,
        bordered: true,
        hover: true,
        clickable: false,
        stickyHeader: true,
        maxHeight: 500,
        loading: false,
    },
} satisfies MetaWithLabel<TsTableArgs>;

export default meta;
type Story = StoryObjWithLabel<TsTableArgs>;

export const Basic: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A plain `<table>` slotted into `<ts-table>`. The component applies design-system styling, scroll behaviour, and sticky header automatically.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            size=${args.size || 'medium'}
            ?hover=${args.hover ?? true}
            ?striped=${args.striped ?? false}
            ?bordered=${args.bordered ?? true}
            ?sticky-header=${args.stickyHeader ?? true}
            ?clickable=${args.clickable ?? false}
            ?loading=${args.loading}
            max-height=${args.maxHeight}
        >
            <table>
                <caption>
                    Quarterly product sales
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col" class="ts-align-right">Q1</th>
                        <th scope="col" class="ts-align-right">Q2</th>
                        <th scope="col" class="ts-align-right">Q3</th>
                        <th scope="col" class="ts-align-right">Q4</th>
                        <th scope="col" class="ts-align-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${[
                        { name: 'Keyboard', q: [1200, 1450, 1180, 1320] },
                        { name: 'Monitor', q: [4200, 3900, 5100, 4600] },
                        { name: 'Mouse', q: [600, 720, 680, 710] },
                        { name: 'Webcam', q: [1800, 2100, 1950, 2200] },
                        { name: 'Headset', q: [900, 1100, 1050, 980] },
                        { name: 'Desk Chair', q: [3200, 3600, 2900, 3400] },
                        { name: 'USB Hub', q: [480, 540, 510, 560] },
                        { name: 'Laptop Stand', q: [740, 820, 790, 850] },
                    ].map(
                        row => html`
                            <tr>
                                <td>${row.name}</td>
                                ${row.q.map(v => html`<td class="ts-align-right">$${v.toLocaleString()}</td>`)}
                                <td class="ts-align-right">$${row.q.reduce((a, b) => a + b, 0).toLocaleString()}</td>
                            </tr>
                        `,
                    )}
                </tbody>
            </table>
        </ts-table>
    `,
};

export const WithFixedColumns: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Apply `ts-fixed-left` / `ts-fixed-right` to `<th>` and `<td>` elements to pin columns while scrolling horizontally.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <div style="max-width:420px">
            <ts-table
                header-variant=${args.variant || 'primary'}
                size=${args.size || 'medium'}
                ?hover=${args.hover ?? true}
                ?striped=${args.striped ?? false}
                ?bordered=${args.bordered ?? true}
                ?sticky-header=${args.stickyHeader ?? true}
                ?clickable=${args.clickable ?? false}
                ?loading=${args.loading}
                max-height=${args.maxHeight ?? 240}
            >
                <table style="min-width:700px">
                    <thead>
                        <tr>
                            <th scope="col" class="ts-fixed-left" style="min-width:150px">Name</th>
                            <th scope="col" class="ts-align-right" style="min-width:100px">Jan</th>
                            <th scope="col" class="ts-align-right" style="min-width:100px">Feb</th>
                            <th scope="col" class="ts-align-right" style="min-width:100px">Mar</th>
                            <th scope="col" class="ts-align-right" style="min-width:100px">Apr</th>
                            <th scope="col" class="ts-align-right ts-fixed-right" style="min-width:110px">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[
                            { name: 'Ada Lovelace', vals: [4200, 3800, 4600, 4100] },
                            { name: 'Alan Turing', vals: [3100, 3400, 3200, 3700] },
                            { name: 'Grace Hopper', vals: [5600, 5200, 5900, 5400] },
                            { name: 'Linus Torvalds', vals: [3900, 4100, 3800, 4300] },
                        ].map(
                            row => html`
                                <tr>
                                    <td class="ts-fixed-left">${row.name}</td>
                                    ${row.vals.map(v => html`<td class="ts-align-right">$${v.toLocaleString()}</td>`)}
                                    <td class="ts-align-right ts-fixed-right">
                                        $${row.vals.reduce((a, b) => a + b, 0).toLocaleString()}
                                    </td>
                                </tr>
                            `,
                        )}
                    </tbody>
                </table>
            </ts-table>
        </div>
    `,
};

export const WithCustomHeaderFooter: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `header` and `footer` named slots work in native mode too — use them to add a custom toolbar or summary row.',
            },
        },
    },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            size=${args.size || 'medium'}
            ?hover=${args.hover ?? true}
            ?striped=${args.striped ?? false}
            ?bordered=${args.bordered ?? true}
            ?sticky-header=${args.stickyHeader ?? true}
            ?clickable=${args.clickable ?? false}
            ?loading=${args.loading}
            max-height=${args.maxHeight ?? 300}
        >
            <div
                slot="header"
                style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--ts-semantic-color-background-neutral-subtle-default,#f8f9fa);border-bottom:1px solid var(--ts-semantic-color-border-base-default,#dee2e6);"
            >
                <strong>📊 Sales Report — Q1 2026</strong>
                <span style="font-size:0.875rem;color:#6c757d;">Export ↓</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col" class="ts-align-right">Revenue</th>
                        <th scope="col" class="ts-align-right">Units</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Keyboard</td>
                        <td class="ts-align-right">$12,400</td>
                        <td class="ts-align-right">155</td>
                    </tr>
                    <tr>
                        <td>Monitor</td>
                        <td class="ts-align-right">$42,000</td>
                        <td class="ts-align-right">120</td>
                    </tr>
                    <tr>
                        <td>Mouse</td>
                        <td class="ts-align-right">$6,000</td>
                        <td class="ts-align-right">240</td>
                    </tr>
                    <tr>
                        <td>Webcam</td>
                        <td class="ts-align-right">$18,000</td>
                        <td class="ts-align-right">90</td>
                    </tr>
                </tbody>
            </table>
            <div
                slot="footer"
                style="display:flex;align-items:center;justify-content:flex-end;gap:24px;padding:10px 16px;background:var(--ts-semantic-color-background-neutral-subtle-default,#f8f9fa);border-top:1px solid var(--ts-semantic-color-border-base-default,#dee2e6);"
            >
                <span style="font-size:0.875rem;color:#6c757d;">Total revenue</span>
                <strong>$78,400</strong>
            </div>
        </ts-table>
    `,
};

export const Striped: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The `striped` property applies the zebra-stripe background to native `<tr>` elements too.',
            },
        },
    },
    args: { striped: true, hover: false },
    render: (args: TsTableArgs) => html`
        <ts-table
            header-variant=${args.variant || 'primary'}
            size=${args.size || 'medium'}
            ?striped=${args.striped}
            ?hover=${args.hover}
            ?bordered=${args.bordered ?? true}
            ?sticky-header=${args.stickyHeader ?? true}
            ?clickable=${args.clickable ?? false}
            ?loading=${args.loading}
            max-height=${args.maxHeight}
        >
            <table>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${[
                        { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
                        { id: 2, name: 'Alan Turing', role: 'Analyst', status: 'Pending' },
                        { id: 3, name: 'Grace Hopper', role: 'Manager', status: 'Active' },
                        { id: 4, name: 'Linus Torvalds', role: 'Engineer', status: 'Inactive' },
                        { id: 5, name: 'Tim Berners-Lee', role: 'Designer', status: 'Active' },
                    ].map(
                        row => html`
                            <tr>
                                <td>${row.id}</td>
                                <td>${row.name}</td>
                                <td>${row.role}</td>
                                <td>${row.status}</td>
                            </tr>
                        `,
                    )}
                </tbody>
            </table>
        </ts-table>
    `,
};
