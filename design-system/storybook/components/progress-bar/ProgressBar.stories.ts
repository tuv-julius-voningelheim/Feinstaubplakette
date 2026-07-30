import { html } from 'lit';
import { nothing } from 'lit';

import type { TsProgressBar } from '@tuvsud/design-system/progress-bar';

import type { MetaWithLabel, StoryObjWithLabel } from '@storybook/with-label.js';

import '@tuvsud/design-system/progress-bar';

const meta = {
    title: 'Components/ProgressBar',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A Progress Bar visually represents the completion status of a process or task. It helps users understand how much of an operation has been completed and how much remains.',
            },
        },
    },
    argTypes: {
        // Properties category
        value: {
            control: { type: 'range', min: 0, max: 100 },
            description: 'The current progress as a percentage, 0–100.',
            table: { type: { summary: 'number' }, defaultValue: { summary: '0' }, category: 'Properties' },
        },
        indeterminate: {
            control: 'boolean',
            description: 'Ignores percentage, hides label, shows indeterminate state.',
            table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Properties' },
        },
        // Accessibility category
        label: {
            control: 'text',
            description: 'Custom label for assistive devices.',
            table: { type: { summary: 'string' }, defaultValue: { summary: '' }, category: 'Accessibility' },
        },
    },
    args: {
        value: 50,
        indeterminate: false,
        label: '',
    },
    render: args => html`
        <ts-progress-bar
            value=${args.value ?? nothing}
            .indeterminate=${args.indeterminate}
            ?indeterminate=${args.indeterminate}
            label=${args.label || nothing}
        >
            20
        </ts-progress-bar>
    `,
} satisfies MetaWithLabel<TsProgressBar>;

export default meta;
type Story = StoryObjWithLabel<TsProgressBar>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'By default, the progress bar shows a determinate state with a value between 0 and 100.',
            },
        },
    },
    args: {
        value: 50,
        indeterminate: false,
        label: '',
    },
};

export const Indeterminate: Story = {
    parameters: {
        docs: {
            description: {
                story: '',
            },
        },
    },
    args: {
        indeterminate: true,
        label: '',
    },
};

export const WithLabel: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `label` attribute to label the progress bar and tell assistive devices how to announce it.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <label>Progressbar</label>
            <ts-progress-bar value="50" label="File upload progress"></ts-progress-bar>
        </div>
    `,
};

export const CustomSizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `--height` custom property to set the progress bar’s height.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ts-progress-bar value="50" style="--height: 4px;"></ts-progress-bar>
            <ts-progress-bar value="50" style="--height: 8px;"></ts-progress-bar>
            <ts-progress-bar value="50" style="--height: 12px;"></ts-progress-bar>
        </div>
    `,
};

export const CustomColors: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use the `--indicator-color` custom property to set the progress bar’s color.',
            },
        },
    },
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
            <ts-progress-bar value="50" style="--indicator-color: var(--ts-core-color-blue-500);"></ts-progress-bar>
            <ts-progress-bar value="50" style="--indicator-color: var(--ts-core-color-green-500);"></ts-progress-bar>
            <ts-progress-bar value="50" style="--indicator-color: var(--ts-core-color-amber-500);"></ts-progress-bar>
            <ts-progress-bar value="50" style="--indicator-color: var(--ts-core-color-red-500);"></ts-progress-bar>
        </div>
    `,
};
