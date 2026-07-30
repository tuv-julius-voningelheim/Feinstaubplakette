import { html, nothing } from 'lit';

import type { TsAnimatedImage } from '@tuvsud/design-system/animated-image';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/animated-image';

const meta = {
    title: 'Components/Animated Image',
    component: 'ts-animated-image',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A UI component that handles GIF and WEBP animation playback, enabling play/pause control through user interaction.',
            },
        },
    },
    argTypes: {
        src: {
            control: 'text',
            description: 'The path to the image.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        alt: {
            control: 'text',
            description: 'Description for assistive devices.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Properties' },
        },
        play: {
            control: 'boolean',
            description: 'Play or pause the animation.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
    },
    args: {
        src: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
        alt: 'Animated example',
        play: true,
    },
    render: args => html`
        <ts-animated-image src=${args.src || nothing} alt=${args.alt || nothing} ?play=${args.play}>
        </ts-animated-image>
    `,
} satisfies MetaWithLabel<TsAnimatedImage>;

export default meta;
type Story = StoryObjWithLabel<TsAnimatedImage>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Default animated image playing automatically.',
            },
        },
    },
};
