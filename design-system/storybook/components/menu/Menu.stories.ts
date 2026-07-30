import { html } from 'lit';

import type { TsMenu } from '@tuvsud/design-system/menu';

import type { TsSelectEvent } from '@utils/events/events.js';

import { createEventLogger } from '@storybook/event-logger.js';
import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/divider';
import '@tuvsud/design-system/icon';

type MenuEvents = {
    'ts-select': { item: unknown };
};

const meta = {
    title: 'Components/Menu',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Menu is a list of actions or options presented to the user, typically triggered by an interaction such as clicking a button or right-clicking. Menus help organize commands and navigation in a compact, accessible way.',
            },
        },
    },
    argTypes: {
        // Events category
        'ts-select': {
            action: 'ts-select',
            description: 'Emitted when a menu item is selected. The event detail contains the selected `item`.',
            table: { category: 'Events', type: { summary: 'CustomEvent' } },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-item>Option 1</ts-menu-item>
            <ts-menu-item>Option 2</ts-menu-item>
            <ts-menu-item>Option 3</ts-menu-item>
            <ts-divider></ts-divider>
            <ts-menu-item>Separated Option</ts-menu-item>
        </ts-menu>
    `,
} satisfies MetaWithLabel<TsMenu & MenuEvents>;

export default meta;
type Story = StoryObjWithLabel<TsMenu>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the menu displays a list of options with a divider separating groups of items.',
            },
        },
    },
};

export const WithIcons: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add content to the start and end of menu items using the prefix and suffix slots.',
            },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-item>
                <ts-icon slot="prefix">
                    <img src="/assets/svg/home.svg" alt="filter" />
                </ts-icon>
                Home
            </ts-menu-item>
            <ts-menu-item>
                <ts-icon slot="prefix">
                    <img src="/assets/svg/settings.svg" alt="filter" />
                </ts-icon>
                Settings
            </ts-menu-item>
            <ts-menu-item>
                <ts-icon slot="prefix">
                    <img src="/assets/svg/account_circle.svg" alt="filter" />
                </ts-icon>
                Profile
            </ts-menu-item>
            <ts-divider></ts-divider>
            <ts-menu-item>
                <ts-icon slot="prefix">
                    <img src="/assets/svg/logout.svg" alt="filter" />
                </ts-icon>
                Sign Out
            </ts-menu-item>
        </ts-menu>
    `,
};

export const WithSubmenu: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The Menu component supports hierarchical navigation by allowing menus to be nested within each other. This is achieved using the submenu slot, which enables you to embed additional menu instances inside a parent menu for creating multi-level structures.',
            },
        },
    },
    render: () => html`
        <div style="width: 200px">
            <ts-menu>
                <ts-menu-item>Item 1</ts-menu-item>
                <ts-menu-item>Item 2</ts-menu-item>
                <ts-menu-item>
                    More Options
                    <ts-menu slot="submenu">
                        <ts-menu-item>Sub-item 1</ts-menu-item>
                        <ts-menu-item>Sub-item 2</ts-menu-item>
                        <ts-menu-item>
                            Even More
                            <ts-menu slot="submenu">
                                <ts-menu-item>Deep Option 1</ts-menu-item>
                                <ts-menu-item>Deep Option 2</ts-menu-item>
                            </ts-menu>
                        </ts-menu-item>
                    </ts-menu>
                </ts-menu-item>
            </ts-menu>
        </div>
    `,
};

export const WithDisabledItems: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To disable a specific item within the menu, use the disabled property on the corresponding Menu Item.',
            },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-item>Available</ts-menu-item>
            <ts-menu-item disabled>Disabled</ts-menu-item>
            <ts-menu-item>Available</ts-menu-item>
            <ts-divider></ts-divider>
            <ts-menu-item disabled>Disabled Option</ts-menu-item>
        </ts-menu>
    `,
};

export const WithLoadingItems: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To indicate that a menu item is in a loading state, use the loading property on the corresponding Menu Item.',
            },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-item>Available</ts-menu-item>
            <ts-menu-item disabled>Disabled</ts-menu-item>
            <ts-menu-item>Available</ts-menu-item>
            <ts-divider></ts-divider>
            <ts-menu-item loading>Loading Option</ts-menu-item>
        </ts-menu>
    `,
};

export const Checkboxes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Menu items can function as checkboxes by setting their type property to "checkbox". This allows users to select or deselect options directly within the menu interface.',
            },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-item type="checkbox" checked>Bold</ts-menu-item>
            <ts-menu-item type="checkbox">Italic</ts-menu-item>
            <ts-menu-item type="checkbox">Underline</ts-menu-item>
        </ts-menu>
    `,
};

export const EventsLogger: Story = {
    ...(() => {
        const { log, wrap, parameters } = createEventLogger({
            id: 'menu-event-log',
            entries: [
                {
                    event: 'ts-select',
                    firedWhen: 'A menu item is selected',
                    detail: 'TsSelectDetail',
                },
            ],
        });
        return {
            parameters,
            render: () =>
                wrap(html`
                    <ts-menu
                        @ts-select=${(e: TsSelectEvent) =>
                            log('ts-select', {
                                value: e.detail.item.value,
                                textContent: e.detail.item.textContent?.trim(),
                                type: e.detail.item.type,
                                checked: e.detail.item.checked,
                                disabled: e.detail.item.disabled,
                            })}
                    >
                        <ts-menu-item value="option-1">Option 1</ts-menu-item>
                        <ts-menu-item value="option-2">Option 2</ts-menu-item>
                        <ts-menu-item value="option-3">Option 3</ts-menu-item>
                        <ts-divider></ts-divider>
                        <ts-menu-item value="option-4">Separated Option</ts-menu-item>
                    </ts-menu>
                `),
        };
    })(),
};
