import { html, nothing } from 'lit';

import type { TsPagination } from '@tuvsud/design-system/pagination';

import type { TsNextClickEvent, TsPageClickEvent, TsPrevClickEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/pagination';
import '@tuvsud/design-system/pagination-item';
import '@tuvsud/design-system/icon';

const meta = {
    title: 'Components/Pagination',
    component: 'ts-pagination',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Pagination allows users to navigate through multiple pages of content. It supports different sizes, variants, and boundary configurations.',
            },
        },
    },
    argTypes: {
        // Properties category
        count: {
            control: { type: 'number', min: 1 },
            description: 'Total number of pages.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        defaultPage: {
            control: { type: 'number', min: 1 },
            description: 'The initial active page (uncontrolled).',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
            description: 'The size of the pagination items.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'medium' },
                category: 'Properties',
            },
        },
        variant: {
            control: { type: 'select' },
            options: ['outlined', 'text'],
            description: 'The visual variant of the pagination items.',
            table: {
                type: { summary: 'enum' },
                defaultValue: { summary: 'outlined' },
                category: 'Properties',
            },
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Disables all pagination items.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        boundaryCount: {
            control: { type: 'number', min: 0 },
            description: 'Number of pages always shown at the start and end.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        siblingCount: {
            control: { type: 'number', min: 0 },
            description: 'Number of sibling pages shown on each side of the current page.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '1' }, category: 'Properties' },
        },
        // Events category
        'ts-page-click': {
            action: 'ts-page-click',
            description: 'Emitted when a page number is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-prev-click': {
            action: 'ts-prev-click',
            description: 'Emitted when the previous button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-next-click': {
            action: 'ts-next-click',
            description: 'Emitted when the next button is clicked.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        count: 10,
        defaultPage: 1,
        size: 'medium',
        variant: 'outlined',
        disabled: false,
        boundaryCount: 10,
        siblingCount: 1,
    },
    render: args => html`
        <ts-pagination
            count=${args.count ?? nothing}
            default-page=${args.defaultPage ?? nothing}
            size=${args.size || nothing}
            variant=${args.variant || nothing}
            ?disabled=${args.disabled}
            boundary-count=${args.boundaryCount ?? nothing}
            sibling-count=${args.siblingCount ?? nothing}
        ></ts-pagination>
    `,
} satisfies MetaWithLabel<
    TsPagination & { 'ts-page-click': unknown; 'ts-prev-click': unknown; 'ts-next-click': unknown }
>;

export default meta;
type Story = StoryObjWithLabel<TsPagination>;

/** Default pagination with 10 pages, outlined variant, medium size. */
export const Default: Story = {};

/** All three sizes displayed together. */
export const Sizes: Story = {
    render: () => html`
        <div class="sb-story-wrapper--column">
            <ts-pagination count="10" boundary-count="10" size="small" label="Small pagination"></ts-pagination>
            <ts-pagination count="10" boundary-count="10" size="medium" label="Medium pagination"></ts-pagination>
            <ts-pagination count="10" boundary-count="10" size="large" label="Large pagination"></ts-pagination>
        </div>
    `,
};

/** Outlined vs. text variants side by side. */
export const Variants: Story = {
    render: () => html`
        <div class="sb-story-wrapper--column">
            <ts-pagination
                count="10"
                boundary-count="10"
                variant="outlined"
                default-page="3"
                label="Outlined pagination"
            ></ts-pagination>
            <ts-pagination
                count="10"
                boundary-count="10"
                variant="text"
                default-page="3"
                label="Text pagination"
            ></ts-pagination>
        </div>
    `,
};

/** Using boundaryCount=2 to always show 2 pages at each end. */
export const WithBoundaryCount: Story = {
    args: {
        count: 20,
        defaultPage: 10,
        boundaryCount: 2,
    },
};

/** Fully disabled pagination. */
export const Disabled: Story = {
    args: {
        count: 10,
        defaultPage: 3,
        disabled: true,
    },
};

/** Starting on the last page — next button should be disabled. */
export const LastPage: Story = {
    args: {
        count: 10,
        defaultPage: 10,
    },
};

/** Small count — no ellipsis rendered. */
export const SmallCount: Story = {
    args: {
        count: 5,
        defaultPage: 3,
    },
};

/**
 * SEO / SSR-friendly pagination using native `<a>` elements.
 * Pass `href` on each item so the rendered markup contains real anchor tags that
 * search-engine crawlers and server-side renderers can follow without JavaScript.
 * You can also slot a framework router `<a>` (e.g. Next.js `<Link>` / React Router) directly.
 */
export const NativeLinks: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
                <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Via <code>href</code> prop</p>
                <nav aria-label="href prop pagination" style="display: flex; gap: 4px; align-items: center;">
                    <ts-pagination-item type="prev" href="/page/4">
                        <ts-icon library="system" name="arrow_back_ios" size="20"></ts-icon>
                    </ts-pagination-item>
                    <ts-pagination-item type="page" href="/page/1" .page=${1}>1</ts-pagination-item>
                    <ts-pagination-item type="page" href="/page/2" .page=${2}>2</ts-pagination-item>
                    <ts-pagination-item type="page" href="/page/3" .page=${3}>3</ts-pagination-item>
                    <ts-pagination-item type="page" href="/page/4" .page=${4} active>4</ts-pagination-item>
                    <ts-pagination-item type="page" href="/page/5" .page=${5}>5</ts-pagination-item>
                    <ts-pagination-item type="next" href="/page/6">
                        <ts-icon library="system" name="arrow_forward_ios" size="20"></ts-icon>
                    </ts-pagination-item>
                </nav>
            </div>

            <!-- slotted <a>: consumer owns the anchor (e.g. Next.js Link / React Router) -->
            <div>
                <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Via slotted <code>&lt;a&gt;</code></p>
                <nav aria-label="slotted anchor pagination" style="display: flex; gap: 4px; align-items: center;">
                    <ts-pagination-item type="prev">
                        <a href="/page/4">
                            <ts-icon library="system" name="arrow_back_ios" size="20"></ts-icon>
                        </a>
                    </ts-pagination-item>
                    <ts-pagination-item type="page" .page=${1}><a href="/page/1">1</a></ts-pagination-item>
                    <ts-pagination-item type="page" .page=${2}><a href="/page/2">2</a></ts-pagination-item>
                    <ts-pagination-item type="page" .page=${3}><a href="/page/3">3</a></ts-pagination-item>
                    <ts-pagination-item type="page" .page=${4} active><a href="/page/4">4</a></ts-pagination-item>
                    <ts-pagination-item type="page" .page=${5}><a href="/page/5">5</a></ts-pagination-item>
                    <ts-pagination-item type="next">
                        <a href="/page/6">
                            <ts-icon library="system" name="arrow_forward_ios" size="20"></ts-icon>
                        </a>
                    </ts-pagination-item>
                </nav>
            </div>
        </div>
    `,
};

/** Interactive event log — interact with the pagination to see custom events fired in real time. */
export const EventLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'pagination-event-log',
            entries: [
                { event: 'ts-page-click', firedWhen: 'A page number is clicked', detail: 'TsPaginationClickDetail' },
                {
                    event: 'ts-prev-click',
                    firedWhen: 'The previous button is clicked',
                    detail: 'TsPaginationClickDetail',
                },
                { event: 'ts-next-click', firedWhen: 'The next button is clicked', detail: 'TsPaginationClickDetail' },
            ],
        });
        return {
            parameters,
            render: () =>
                wrap(html`
                    <ts-pagination
                        count="10"
                        default-page="5"
                        label="Event log pagination"
                        @ts-page-click=${(e: TsPageClickEvent) => log('ts-page-click', e.detail)}
                        @ts-prev-click=${(e: TsPrevClickEvent) => log('ts-prev-click', e.detail)}
                        @ts-next-click=${(e: TsNextClickEvent) => log('ts-next-click', e.detail)}
                    ></ts-pagination>
                `),
        };
    })(),
};
