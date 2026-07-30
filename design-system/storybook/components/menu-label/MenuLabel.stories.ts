import { html } from 'lit';

import type { TsMenuLabel } from '@tuvsud/design-system/menu-label';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/menu';
import '@tuvsud/design-system/menu-item';
import '@tuvsud/design-system/menu-label';
import '@tuvsud/design-system/divider';

const meta = {
    title: 'Components/Menu Label',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Menu labels are used to describe a group of menu items. Used in Menu Component.',
            },
        },
    },
    render: () => html`
        <ts-menu>
            <ts-menu-label>Fruits</ts-menu-label>
            <ts-menu-item value="apple">Apple</ts-menu-item>
            <ts-menu-item value="banana">Banana</ts-menu-item>
            <ts-menu-item value="orange">Orange</ts-menu-item>
            <ts-divider></ts-divider>
            <ts-menu-label>Vegetables</ts-menu-label>
            <ts-menu-item value="broccoli">Broccoli</ts-menu-item>
            <ts-menu-item value="carrot">Carrot</ts-menu-item>
            <ts-menu-item value="zucchini">Zucchini</ts-menu-item>
        </ts-menu>
    `,
} satisfies MetaWithLabel<TsMenuLabel>;

export default meta;
type Story = StoryObjWithLabel<TsMenuLabel>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'A menu containing two labeled sections: "Fruits" and "Vegetables", each with corresponding menu items.',
            },
        },
    },
};
