import { html } from 'lit';

import type { TsDivider } from '@tuvsud/design-system/divider';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/divider';

const meta = {
    title: 'Components/Divider',
    component: 'ts-divider',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'Dividers help organize layouts by visually separating or grouping sections of content.',
            },
        },
    },
    argTypes: {
        // Properties category
        vertical: {
            control: 'boolean',
            description: 'Draws the divider in a vertical orientation.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        decorative: {
            control: 'boolean',
            description:
                'Indicates whether the divider is decorative or not. Decorative dividers are hidden from assistive technologies.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Properties' },
        },
    },
    args: {
        vertical: false,
        decorative: true,
    },
    render: args => html`
        <div style="color: var(--ts-semantic-color-text-base-default)">
            <div>Above Content</div>
            <ts-divider
                .vertical=${args.vertical}
                ?vertical=${args.vertical}
                .decorative=${args.decorative}
                ?decorative=${args.decorative}
            ></ts-divider>
            <div>Below Content</div>
        </div>
    `,
} satisfies MetaWithLabel<TsDivider>;

export default meta;
type Story = StoryObjWithLabel<TsDivider>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the divider is horizontal.',
            },
        },
    },
    args: { vertical: false },
};

export const Vertical: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Add the `vertical` property to draw the divider in a vertical orientation. The divider will span the full height of its container. Vertical dividers work especially well inside of a flex container.',
            },
        },
    },
    render: () => html`
        <div
            style="color: var(--ts-semantic-color-text-base-default); padding: 1rem; height: 2rem; display: flex; align-items: center; gap: 0.5rem;"
        >
            <span>First</span>
            <ts-divider vertical></ts-divider>
            <span>Second</span>
            <ts-divider vertical></ts-divider>
            <span>Third</span>
        </div>
    `,
};
