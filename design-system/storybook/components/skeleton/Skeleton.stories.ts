import { html, nothing } from 'lit';

import type { TsSkeleton } from '@tuvsud/design-system/skeleton';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/skeleton';

const meta = {
    title: 'Components/Skeleton',
    component: 'ts-skeleton',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Skeleton component is a placeholder that indicates loading content. It helps maintain layout stability and improves perceived performance by showing a visual representation of where content will appear.',
            },
        },
    },
    argTypes: {
        // Properties category
        effect: {
            control: 'select',
            description: 'Determines which effect the skeleton will use.\t',
            options: ['none', 'sheen', 'pulse'],
            table: { type: { summary: 'enum' }, defaultValue: { summary: 'none' }, category: 'Properties' },
        },
    },
    render: args => html`<ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>`,
} satisfies MetaWithLabel<TsSkeleton>;

export default meta;
type Story = StoryObjWithLabel<TsSkeleton>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The default skeleton component can be used to represent loading content with different effects.',
            },
        },
    },
    args: { effect: 'pulse' },
    render: args => html`
        <div class="skeleton-overview">
            <header>
                <ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>
                <ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>
            </header>
            <ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>
            <ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>
            <ts-skeleton .effect=${args.effect} effect=${args.effect || nothing}></ts-skeleton>
        </div>
        <style>
            .skeleton-overview header {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
            }
            .skeleton-overview header ts-skeleton:last-child {
                flex: 0 0 auto;
                width: 30%;
            }
            .skeleton-overview ts-skeleton {
                margin-bottom: 1rem;
            }
            .skeleton-overview ts-skeleton:nth-child(1) {
                float: left;
                width: 3rem;
                height: 3rem;
                margin-right: 1rem;
                vertical-align: middle;
            }
            .skeleton-overview ts-skeleton:nth-child(3) {
                width: 95%;
            }
            .skeleton-overview ts-skeleton:nth-child(4) {
                width: 80%;
            }
        </style>
    `,
};

export const Effects: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This example showcases the different effects that can be applied to the skeleton component: none, sheen, and pulse.',
            },
        },
    },
    render: () => html`
        <div class="skeleton-effects">
            <ts-skeleton effect="none"></ts-skeleton>
            None
            <ts-skeleton effect="sheen"></ts-skeleton>
            Sheen
            <ts-skeleton effect="pulse"></ts-skeleton>
            Pulse
        </div>
        <style>
            .skeleton-effects {
                color: var(--ts-semantic-color-text-base-default);
            }
            .skeleton-effects ts-skeleton:not(:first-child) {
                margin-top: 1rem;
            }
        </style>
    `,
};
