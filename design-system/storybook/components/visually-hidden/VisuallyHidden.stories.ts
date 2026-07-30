import { html } from 'lit';

import type { TsVisuallyHidden } from '@tuvsud/design-system/visually-hidden';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/visually-hidden';

const meta = {
    title: 'Components/Visually Hidden',
    component: 'ts-visually-hidden',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use the visually hidden utility to deliver accessible, screen‑reader‑only content without affecting your visual layout.',
            },
        },
    },
    render: () => html`
        <p style="color: var(--ts-semantic-color-text-base-default);">
            This text is visible.
            <ts-visually-hidden>But this part is only for screen readers.</ts-visually-hidden>
        </p>
    `,
} satisfies MetaWithLabel<TsVisuallyHidden>;

export default meta;
type Story = StoryObjWithLabel<TsVisuallyHidden>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'This example shows how to use the visually hidden component to hide content from visual display while keeping it accessible to screen readers.',
            },
        },
    },
};
