import { html } from 'lit';
import { nothing } from 'lit';

import type { TsProgressRing } from '@tuvsud/design-system/progress-ring';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/progress-ring';

const meta = {
    title: 'Components/ProgressRing',
    component: 'ts-progress-ring',
    tags: ['autodocs'],
    parameters: {
        description: {
            component:
                'A Progress Ring is a circular indicator that visually represents the completion status of a task or process. It is commonly used to show progress in percentages within a compact and elegant design.',
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: { type: 'range', min: 0, max: 100 },
            description: 'The current progress as a percentage, 0–100.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'A custom label for assistive devices.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: { value: 50, label: '' },
    render: args => html`
        <ts-progress-ring value=${args.value ?? nothing} label=${args.label || nothing}>
            ${args.value}
        </ts-progress-ring>
    `,
} satisfies MetaWithLabel<TsProgressRing>;

export default meta;
type Story = StoryObjWithLabel<TsProgressRing>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the progress ring displays a value of 50%.',
            },
        },
    },
    args: { value: 50 },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` attribute to label the progress ring and tell assistive devices how to announce it. ',
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center; color: var(--ts-semantic-color-text-base-default)">
            <label>Progress Ring</label>
            <ts-progress-ring value="50">50</ts-progress-ring>
        </div>
    `,
};

export const CustomSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `--size` custom property to set the diameter of the progress ring.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center;">
            <ts-progress-ring value="50" style="--size: 50px; --track-width: 2px;">50</ts-progress-ring>
            <ts-progress-ring value="50" style="--size: 100px; --track-width: 4px;">50</ts-progress-ring>
            <ts-progress-ring value="50" style="--size: 150px; --track-width: 6px;">50</ts-progress-ring>
        </div>
    `,
};

export const CustomColors: Story = {
    parameters: {
        docs: {
            description: {
                story: 'To change the color, use the `--track-color` and `--indicator-color` custom properties.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; gap: 1rem; align-items: center;">
            <ts-progress-ring value="50" style="--indicator-color: var(--ts-core-color-blue-500);">50</ts-progress-ring>
            <ts-progress-ring value="50" style="--indicator-color: var(--ts-core-color-green-500);"
                >50</ts-progress-ring
            >
            <ts-progress-ring value="50" style="--indicator-color: var(--ts-core-color-amber-500);"
                >50</ts-progress-ring
            >
            <ts-progress-ring value="50" style="--indicator-color: var(--ts-core-color-red-500);">50</ts-progress-ring>
        </div>
    `,
};
