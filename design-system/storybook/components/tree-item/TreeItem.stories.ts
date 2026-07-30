import { html } from 'lit';

import type { TsTreeItem } from '@tuvsud/design-system/tree-item';
import type { StoryContext } from 'storybook/internal/types';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tree';
import '@tuvsud/design-system/tree-item';

type TreeItemArgs = StoryContext<WebComponentsRenderer>['args'];

type TreeItemEvents = {
    'ts-expand': unknown;
    'ts-after-expand': unknown;
    'ts-collapse': unknown;
    'ts-after-collapse': unknown;
    'ts-lazy-change': unknown;
    'ts-lazy-load': unknown;
};

const meta = {
    title: 'Components/Tree Item',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Tree items act as the building blocks of a tree, representing each node in your hierarchical navigation or data structure.',
            },
        },
    },
    argTypes: {
        // Properties category
        expanded: {
            control: 'boolean',
            description: 'Expands the tree item.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        selected: {
            control: 'boolean',
            description: 'Marks the tree item as selected.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the tree item.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        lazy: {
            control: 'boolean',
            description: 'Enables lazy loading behavior.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Events category
        'ts-expand': {
            action: 'ts-expand',
            description: 'Emitted when the tree item expands.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-expand': {
            action: 'ts-after-expand',
            description: 'Emitted after the tree item expands and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-collapse': {
            action: 'ts-collapse',
            description: 'Emitted when the tree item collapses.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-after-collapse': {
            action: 'ts-after-collapse',
            description: 'Emitted after the tree item collapses and all animations are complete.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-lazy-change': {
            action: 'ts-lazy-change',
            description: "Emitted when the tree item's lazy state changes.",
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
        'ts-lazy-load': {
            action: 'ts-lazy-load',
            description: 'Emitted when a lazy item is selected to asynchronously load data.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        expanded: false,
        selected: false,
        disabled: false,
        lazy: false,
    },
    render: args => html`
        <ts-tree>
            <ts-tree-item
                .expanded=${args.expanded}
                ?expanded=${args.expanded}
                .selected=${args.selected}
                ?selected=${args.selected}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
                .lazy=${args.lazy}
                ?lazy=${args.lazy}
            >
                Item 1
                <ts-tree-item>Subitem 1</ts-tree-item>
                <ts-tree-item>Subitem 2</ts-tree-item>
            </ts-tree-item>
            <ts-tree-item>Item 2</ts-tree-item>
            <ts-tree-item>Item 3</ts-tree-item>
        </ts-tree>
    `,
} satisfies MetaWithLabel<TsTreeItem & TreeItemEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTreeItem>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This is the default tree item used inside a tree.',
            },
        },
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'tree-item-event-log',
            entries: [
                { event: 'ts-expand', firedWhen: 'Tree item expands', detail: 'void' },
                { event: 'ts-after-expand', firedWhen: 'Expand animation completes', detail: 'void' },
                { event: 'ts-collapse', firedWhen: 'Tree item collapses', detail: 'void' },
                { event: 'ts-after-collapse', firedWhen: 'Collapse animation completes', detail: 'void' },
                { event: 'ts-lazy-change', firedWhen: 'Lazy state changes', detail: 'void' },
                { event: 'ts-lazy-load', firedWhen: 'Lazy item selected for async load', detail: 'void' },
            ],
        });
        return {
            parameters,
            render: (args: TreeItemArgs) =>
                wrap(html`
                    <ts-tree>
                        <ts-tree-item
                            ?expanded=${args.expanded}
                            @ts-expand=${(e: CustomEvent) => log('ts-expand', e.detail)}
                            @ts-after-expand=${(e: CustomEvent) => log('ts-after-expand', e.detail)}
                            @ts-collapse=${(e: CustomEvent) => log('ts-collapse', e.detail)}
                            @ts-after-collapse=${(e: CustomEvent) => log('ts-after-collapse', e.detail)}
                            @ts-lazy-change=${(e: CustomEvent) => log('ts-lazy-change', e.detail)}
                            @ts-lazy-load=${(e: CustomEvent) => log('ts-lazy-load', e.detail)}
                        >
                            Item 1
                            <ts-tree-item>Subitem 1</ts-tree-item>
                            <ts-tree-item>Subitem 2</ts-tree-item>
                        </ts-tree-item>
                        <ts-tree-item>Item 2</ts-tree-item>
                    </ts-tree>
                `),
        };
    })(),
};
