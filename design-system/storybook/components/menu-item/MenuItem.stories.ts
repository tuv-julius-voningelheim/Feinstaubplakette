import { html, nothing } from 'lit';

import type { TsMenuItem } from '@tuvsud/design-system/menu-item';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';

const meta = {
    title: 'Components/Menu Item',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Menu items are interactive elements within a menu that allow users to select an option or trigger an action. They are always used as part of a Menu Group to ensure proper structure and accessibility.',
            },
        },
    },
    argTypes: {
        // Properties category
        type: {
            control: 'select',
            options: ['normal', 'checkbox'],
            description: 'The type of menu item to render.',
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'normal' }, category: 'Properties' },
        },
        checked: {
            control: 'boolean',
            description: 'Draws the item in a checked state. Only when type="checkbox".',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        value: {
            control: 'text',
            description: 'A unique value to identify the menu item when selected.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        loading: {
            control: 'boolean',
            description: 'Draws the menu item in a loading state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents selection when true.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Visible text content of the menu item.',
            table: { type: { summary: 'string' }, defaultValue: { summary: 'Menu item' }, category: 'Accessibility' },
        },
    },
    args: {
        type: 'normal',
        checked: false,
        value: '',
        loading: false,
        disabled: false,
        label: 'Menu item',
    },
    render: args => html`
        <ts-menu>
            <ts-menu-item
                type=${args.type || nothing}
                .checked=${args.checked}
                ?checked=${args.checked}
                value=${args.value || nothing}
                .loading=${args.loading}
                ?loading=${args.loading}
                .disabled=${args.disabled}
                ?disabled=${args.disabled}
                >${args.label}</ts-menu-item
            >
        </ts-menu>
    `,
} satisfies MetaWithLabel<TsMenuItem>;

export default meta;
type Story = StoryObjWithLabel<TsMenuItem>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the menu item is of `normal` type and enabled.',
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
        <ts-menu-item>
            <ts-icon slot="prefix">
                <img src="/assets/svg/home.svg" alt="filter" />
            </ts-icon>
            Home
        </ts-menu-item>
    `,
};
