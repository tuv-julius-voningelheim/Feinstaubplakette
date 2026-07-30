import { html, nothing } from 'lit';

import type { TsTree } from '@tuvsud/design-system/tree';
import type { TsTreeItem } from '@tuvsud/design-system/tree-item';
import type { StoryContext } from 'storybook/internal/types';

import type { TsSelectionChangeEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { WebComponentsRenderer } from '@storybook/web-components';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/tree';
import '@tuvsud/design-system/tree-item';
import '@tuvsud/design-system/badge';
import '@tuvsud/design-system/spinner';
import '@tuvsud/design-system/icon';

type TreeArgs = StoryContext<WebComponentsRenderer>['args'];

type TreeEvents = {
    'ts-selection-change': unknown;
};

const meta = {
    title: 'Components/Tree',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Tree component displays hierarchical data in a structured, expandable list. It allows users to navigate and select nested items efficiently.',
            },
        },
    },
    argTypes: {
        // Properties category
        selection: {
            control: 'select',
            options: ['single', 'multiple', 'leaf'],
            description: 'Tree selection mode.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'single' }, category: 'Properties' },
        },
        // Events category
        'ts-selection-change': {
            action: 'ts-selection-change',
            description: 'Emitted when a tree item is selected or deselected.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    args: {
        selection: 'single',
    },
    render: args => html`
        <ts-tree .selection=${args.selection} selection=${args.selection || nothing}>
            <ts-tree-item>
                Item 1
                <ts-tree-item>Subitem 1</ts-tree-item>
                <ts-tree-item>Subitem 2</ts-tree-item>
            </ts-tree-item>
            <ts-tree-item>Item 2</ts-tree-item>
            <ts-tree-item>Item 3</ts-tree-item>
        </ts-tree>
    `,
} satisfies MetaWithLabel<TsTree & TreeEvents>;

export default meta;
type Story = StoryObjWithLabel<TsTree>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default tree with single selection mode.',
            },
        },
    },
};

export const WithSelection: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The selection property lets you change the selection behavior of the tree.',
            },
        },
    },
    args: { selection: 'multiple' },
};

export const WithIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Decorative icons can be used before labels to provide hints for each node.',
            },
        },
    },
    render: () => html`
        <ts-tree selection="single">
            <ts-tree-item>
                <ts-icon slot="expand-icon">
                    <img src="/assets/svg/folder.svg" alt="filter" />
                </ts-icon>
                <ts-icon slot="collapse-icon">
                    <img src="/assets/svg/folder_open.svg" alt="filter" />
                </ts-icon>
                Documents
                <ts-tree-item>
                    <ts-icon slot="expand-icon">
                        <img src="/assets/svg/folder.svg" alt="filter" />
                    </ts-icon>
                    <ts-icon slot="collapse-icon">
                        <img src="/assets/svg/folder_open.svg" alt="filter" />
                    </ts-icon>
                    Photos
                    <ts-tree-item>
                        <ts-icon slot="icon">
                            <img src="/assets/svg/image.svg" alt="filter" />
                        </ts-icon>
                        vacation.jpg
                    </ts-tree-item>
                    <ts-tree-item>
                        <ts-icon slot="icon">
                            <img src="/assets/svg/image.svg" alt="filter" />
                        </ts-icon>
                        family.jpg
                    </ts-tree-item>
                </ts-tree-item>
                <ts-tree-item>
                    <ts-icon slot="expand-icon">
                        <img src="/assets/svg/folder.svg" alt="filter" />
                    </ts-icon>
                    <ts-icon slot="collapse-icon">
                        <img src="/assets/svg/folder_open.svg" alt="filter" />
                    </ts-icon>
                    Documents
                    <ts-tree-item>
                        <ts-icon slot="icon">
                            <img src="/assets/svg/image.svg" alt="filter" />
                        </ts-icon>
                        report.pdf
                    </ts-tree-item>
                    <ts-tree-item><ts-icon slot="icon" name="lab_profile"></ts-icon>presentation.pptx</ts-tree-item>
                </ts-tree-item>
            </ts-tree-item>
            <ts-tree-item>
                <ts-icon slot="expand-icon"><img src="/assets/svg/folder.svg" alt="filter" /></ts-icon>
                <ts-icon slot="collapse-icon"><img src="/assets/svg/folder_open.svg" alt="filter" /></ts-icon>
                Downloads
                <ts-tree-item><ts-icon slot="icon" name="file_open"></ts-icon>software.exe</ts-tree-item>
            </ts-tree-item>
        </ts-tree>
    `,
};

export const WithCustomContent: Story = {
    parameters: {
        docs: {
            description: {
                story: 'You can customize the content of tree items using any HTML elements, such as icons and badges.',
            },
        },
    },
    render: () => html`
        <ts-tree selection="single">
            <ts-tree-item>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <ts-icon>
                        <img src="/assets/svg/home.svg" alt="filter" />
                    </ts-icon>
                    <span>Home</span>
                    <ts-badge variant="primary">New</ts-badge>
                </div>
            </ts-tree-item>
            <ts-tree-item>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <ts-icon>
                        <img src="/assets/svg/settings.svg" alt="filter" />
                    </ts-icon>
                    <span>Settings</span>
                </div>
                <ts-tree-item>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <ts-icon><img src="/assets/svg/person.svg" alt="filter" /></ts-icon>
                        <span>Profile</span>
                    </div>
                </ts-tree-item>
                <ts-tree-item>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <ts-icon name="notification_important"
                            ><img src="/assets/svg/settings.svg" alt="filter"
                        /></ts-icon>
                        <span>Settings</span>
                        <ts-badge variant="danger">3</ts-badge>
                    </div>
                </ts-tree-item>
            </ts-tree-item>
        </ts-tree>
    `,
};

export const Expanded: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Tree items can be expanded or collapsed by default using the `expanded` attribute.',
            },
        },
    },
    render: () => html`
        <ts-tree>
            <ts-tree-item expanded>
                Expanded Item
                <ts-tree-item>Child 1</ts-tree-item>
                <ts-tree-item>Child 2</ts-tree-item>
                <ts-tree-item>Child 3</ts-tree-item>
            </ts-tree-item>
            <ts-tree-item>
                Collapsed Item
                <ts-tree-item>Child 1</ts-tree-item>
                <ts-tree-item>Child 2</ts-tree-item>
            </ts-tree-item>
        </ts-tree>
    `,
};

export const Disabled: Story = {
    parameters: {
        docs: {
            description: {
                story: 'You can disable individual tree items using the `disabled` attribute.',
            },
        },
    },
    render: () => html`
        <ts-tree selection="single">
            <ts-tree-item>
                Regular Item
                <ts-tree-item>Subitem 1</ts-tree-item>
                <ts-tree-item>Subitem 2</ts-tree-item>
            </ts-tree-item>
            <ts-tree-item disabled>
                Disabled Item
                <ts-tree-item>Subitem 1</ts-tree-item>
                <ts-tree-item>Subitem 2</ts-tree-item>
            </ts-tree-item>
            <ts-tree-item>
                Mixed Item
                <ts-tree-item>Regular Subitem</ts-tree-item>
                <ts-tree-item disabled>Disabled Subitem</ts-tree-item>
            </ts-tree-item>
        </ts-tree>
    `,
};

export const WithLazyLoading: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Tree items can load their children lazily using the `lazy` attribute. When a lazy item is expanded, a loading spinner is shown until the child items are loaded.',
            },
        },
    },
    render: () => {
        const handleExpand = (event: CustomEvent) => {
            const item = event.target as TsTreeItem;
            const loading = item.querySelector('ts-spinner');
            if (loading) {
                setTimeout(() => {
                    loading.remove();
                    item.innerHTML += `
            <ts-tree-item>Async Child 1</ts-tree-item>
            <ts-tree-item>Async Child 2</ts-tree-item>
          `;
                }, 1000);
            }
        };
        return html`
            <ts-tree @ts-expand=${handleExpand}>
                <ts-tree-item>
                    Regular Item
                    <ts-tree-item>Child 1</ts-tree-item>
                    <ts-tree-item>Child 2</ts-tree-item>
                </ts-tree-item>
                <ts-tree-item lazy> Lazy Loaded Items </ts-tree-item>
            </ts-tree>
        `;
    },
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'tree-event-log',
            entries: [
                {
                    event: 'ts-selection-change',
                    firedWhen: 'A tree item is selected or deselected',
                    detail: 'TsSelectionChangeDetail',
                },
            ],
        });
        return {
            parameters,
            render: (args: TreeArgs) =>
                wrap(html`
                    <ts-tree
                        selection=${args.selection || nothing}
                        @ts-selection-change=${(e: TsSelectionChangeEvent) =>
                            log('ts-selection-change', {
                                selection: e.detail.selection.map(item => ({
                                    textContent: item.textContent?.trim(),
                                    selected: item.selected,
                                    disabled: item.disabled,
                                    expanded: item.expanded,
                                })),
                            })}
                    >
                        <ts-tree-item>
                            Item 1
                            <ts-tree-item>Subitem 1</ts-tree-item>
                            <ts-tree-item>Subitem 2</ts-tree-item>
                        </ts-tree-item>
                        <ts-tree-item>Item 2</ts-tree-item>
                        <ts-tree-item>Item 3</ts-tree-item>
                    </ts-tree>
                `),
        };
    })(),
};
